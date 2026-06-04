import { orderRepository } from '../repositories/order.repository';
import { productRepository } from '../repositories/product.repository';
import { couponRepository } from '../repositories/coupon.repository';
import { cartRepository } from '../repositories/cart.repository';
import { userRepository } from '../repositories/user.repository';
import { ApiError } from '../utils/ApiError';
import { getPaginationOptions } from '../utils/pagination';
import { ORDER_STATUS_TRANSITIONS, DISCOUNT_TYPE } from '../utils/constants';
import type { OrderStatus } from '../utils/constants';
import { Request } from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { env } from '../config/env';
import { emailService } from './email.service';
import { logger } from '../config/logger';

const razorpay = new Razorpay({ key_id: env.razorpay.keyId, key_secret: env.razorpay.keySecret });

class OrderService {
  
  async calculateOrderPricing(userId: string, data: any) {
    // 1. Validate items and collect product details
    const orderItems: any[] = [];
    let totalWeightGrams = 0;
    
    for (const item of data.items) {
      const product = await productRepository.findById(item.product);
      if (!product || !product.isActive) throw ApiError.badRequest(`Product ${item.product} not found`);
      if (product.stock < item.qty) throw ApiError.badRequest(`Insufficient stock for ${product.name}`);
      
      const itemWeight = (product.weight || 500) * item.qty; // Default 500g if missing
      totalWeightGrams += itemWeight;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0]?.url ?? '',
        sku: product.sku,
        price: product.price,
        discountPrice: product.discountPrice,
        qty: item.qty,
        total: (product.discountPrice ?? product.price) * item.qty,
        gstPercent: product.gstPercent || 0,
      });
    }

    // 2. Calculate pricing
    const subtotal = orderItems.reduce((s, i) => s + i.total, 0);
    let couponDiscount = 0;
    let couponId: string | undefined;

    if (data.couponCode) {
      const coupon = await couponRepository.findByCode(data.couponCode);
      if (!coupon) throw ApiError.badRequest('Invalid coupon code');
      const now = new Date();
      if (now < coupon.validFrom || now > coupon.validTo) throw ApiError.badRequest('Coupon has expired');
      if (coupon.maxUses && coupon.usesCount >= coupon.maxUses) throw ApiError.badRequest('Coupon usage limit reached');
      if (subtotal < coupon.minOrderValue) throw ApiError.badRequest(`Minimum order value ₹${coupon.minOrderValue} required`);

      const userUsage = await couponRepository.getUserUsageCount(coupon._id.toString(), userId);
      if (userUsage >= coupon.maxUsesPerUser) throw ApiError.badRequest('You have already used this coupon');

      couponDiscount = coupon.discountType === DISCOUNT_TYPE.PERCENTAGE
        ? Math.min((subtotal * coupon.discountValue) / 100, coupon.maxDiscountAmount ?? Infinity)
        : coupon.discountValue;
      couponId = coupon._id.toString();
    }

    // India Post Shipping Calculation
    let shipping = 0;
    const destPin = data.shippingAddress?.pincode;
    
    if (destPin) {
      const prefix = destPin.substring(0, 3);
      const statePrefix = destPin.substring(0, 2);
      
      let baseRate = 0;
      let addlRate = 0;

      if (prefix === '812') {
        // Local (Bhagalpur)
        baseRate = 40;
        addlRate = 15;
      } else if (['80', '81', '82', '83', '84', '85'].includes(statePrefix)) {
        // Within Bihar & Jharkhand
        baseRate = 60;
        addlRate = 20;
      } else if (['70', '71', '72', '73', '74', '20', '21', '22', '23', '24', '25', '26', '27', '28'].includes(statePrefix)) {
        // Neighboring States (WB, UP)
        baseRate = 80;
        addlRate = 25;
      } else {
        // Rest of India
        baseRate = 100;
        addlRate = 30;
      }

      // Calculate based on 500g increments
      const additional500gBlocks = Math.max(0, Math.ceil((totalWeightGrams - 500) / 500));
      shipping = baseRate + (additional500gBlocks * addlRate);
    }
    
    // Tax is calculated as sum of each item's tax
    const tax = orderItems.reduce((acc, item) => {
      const itemProportion = subtotal > 0 ? item.total / subtotal : 0;
      const itemDiscount = couponDiscount * itemProportion;
      const taxableAmount = item.total - itemDiscount;
      return acc + (taxableAmount * item.gstPercent) / 100;
    }, 0);
    
    const total = subtotal - couponDiscount + shipping + tax;
    
    let codAmount = 0;
    if (data.paymentMethod === 'cod') {
      codAmount = subtotal - couponDiscount + tax; // COD amount excludes shipping, as shipping is paid upfront
    }

    return { orderItems, subtotal, couponDiscount, couponId, shipping, tax, total, codAmount, totalWeightGrams };
  }

  async placeOrder(userId: string, data: any) {
    const { orderItems, subtotal, couponDiscount, couponId, shipping, tax, total, codAmount } = await this.calculateOrderPricing(userId, data);
    
    let paymentStatus = 'pending';
    let orderStatus = 'pending';
    let shippingPaid = false;
    
    // If ONLINE payment or COD (requires online shipping payment)
    const requiresRazorpay = data.paymentMethod !== 'cod' || (data.paymentMethod === 'cod' && shipping > 0);
    
    if (requiresRazorpay) {
      const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = data.razorpay || {};
      
      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        throw ApiError.badRequest('Missing Razorpay payment details. Shipping/Order must be paid online.');
      }

      const body = `${razorpayOrderId}|${razorpayPaymentId}`;
      const expectedSig = crypto.createHmac('sha256', env.razorpay.keySecret).update(body).digest('hex');
      
      console.log(`[Razorpay] Verifying Signature for Order: ${razorpayOrderId}, Payment: ${razorpayPaymentId}`);
      
      if (expectedSig !== razorpaySignature) {
        console.error(`[Razorpay] Signature mismatch! Expected: ${expectedSig}, Received: ${razorpaySignature}`);
        throw ApiError.badRequest('Payment verification failed. Invalid signature.');
      }
      console.log(`[Razorpay] Signature Verified Successfully.`);

      // Fetch from Razorpay API to guarantee the exact amount was paid
      console.log(`[Razorpay] Fetching Order from Razorpay API: ${razorpayOrderId}`);
      const rzpOrder = await razorpay.orders.fetch(razorpayOrderId);
      
      const expectedAmount = data.paymentMethod === 'cod' ? Math.round(shipping * 100) : Math.round(total * 100);
      
      console.log(`[Razorpay] Comparing Amounts - Expected: ${expectedAmount}, Actual: ${rzpOrder?.amount}`);
      
      if (!rzpOrder || rzpOrder.amount !== expectedAmount) {
        console.error(`[Razorpay] Amount mismatch! Expected: ${expectedAmount}, Actual: ${rzpOrder?.amount}`);
        throw ApiError.badRequest('Payment verification failed. Amount mismatch or order invalid.');
      }
      
      console.log(`[Razorpay] Amount Verified Successfully.`);

      if (data.paymentMethod === 'cod') {
        shippingPaid = true;
        orderStatus = 'confirmed';
        paymentStatus = 'shipping_paid'; // Changed from 'pending'
        data.razorpay = { shippingPaymentId: razorpayPaymentId, razorpaySignature }; // Store shipping payment ID
      } else {
        paymentStatus = 'paid';
        orderStatus = 'confirmed';
        shippingPaid = true;
        data.razorpay = { razorpayOrderId, razorpayPaymentId, razorpaySignature };
      }
    } else if (data.paymentMethod === 'cod' && shipping === 0) {
      // Rare edge case: free shipping and COD
      orderStatus = 'confirmed';
      shippingPaid = true;
    }

    // 3. Generate order ID and create
    const orderId = await orderRepository.generateOrderId();
    const order = await orderRepository.create({
      orderId,
      user: userId as any,
      items: orderItems,
      shippingAddress: data.shippingAddress,
      shippingMethod: 'SPEED_POST',
      pricing: { subtotal, discount: 0, couponDiscount, couponCode: data.couponCode, shipping, shippingPaid, tax, total, codAmount: data.paymentMethod === 'cod' ? codAmount : undefined },
      paymentInfo: { 
        method: data.paymentMethod, 
        status: paymentStatus,
        razorpayOrderId: data.paymentMethod !== 'cod' ? data.razorpay?.razorpayOrderId : undefined,
        razorpayPaymentId: data.paymentMethod !== 'cod' ? data.razorpay?.razorpayPaymentId : undefined,
        shippingPaymentId: data.paymentMethod === 'cod' ? data.razorpay?.shippingPaymentId : undefined,
        razorpaySignature: data.razorpay?.razorpaySignature,
        paidAt: paymentStatus === 'paid' ? new Date() : undefined
      },
      status: orderStatus,
      statusHistory: [{ status: orderStatus, timestamp: new Date() }],
      coupon: couponId as any,
    } as any);

    // 4. Deduct stock for each item
    await Promise.all(orderItems.map((i) => productRepository.updateStock(i.product.toString(), -i.qty)));

    // Record coupon usage
    if (couponId) {
       await couponRepository.recordUsage(couponId, userId, order._id.toString(), couponDiscount);
    }

    // 5. Clear cart
    await cartRepository.clearCart(userId);

    // 6. Send email notification asynchronously
    try {
      const user = await userRepository.findById(userId);
      if (user && user.email) {
        emailService.sendOrderConfirmation(user.email, order);
      }
    } catch (e) {
      logger.error('Failed to send email confirmation', e);
    }

    return order;
  }

  async getMyOrders(userId: string, req: Request) {
    const pagination = getPaginationOptions(req);
    const { status } = req.query as any;
    return orderRepository.findByUser(userId, pagination, status);
  }

  async getOrderById(orderId: string, userId: string, role: string) {
    const order = await orderRepository.findById(orderId);
    if (!order) throw ApiError.notFound('Order not found');
    if (role === 'customer' && order.user.toString() !== userId) throw ApiError.forbidden('Access denied');
    return order;
  }

  async updateOrderStatus(orderId: string, newStatus: OrderStatus, adminId: string, extra?: any) {
    const order = await orderRepository.findById(orderId);
    if (!order) throw ApiError.notFound('Order not found');

    const allowed = ORDER_STATUS_TRANSITIONS[order.status];
    if (!allowed.includes(newStatus)) {
      throw ApiError.badRequest(`Cannot transition from ${order.status} to ${newStatus}`);
    }

    const update: any = { $set: { status: newStatus }, $push: { statusHistory: { status: newStatus, updatedBy: adminId, timestamp: new Date(), note: extra?.note } } };
    if (extra?.trackingNumber) update.$set.trackingNumber = extra.trackingNumber;
    if (extra?.trackingUrl) update.$set.trackingUrl = extra.trackingUrl;
    if (newStatus === 'delivered') update.$set.deliveredAt = new Date();
    if (newStatus === 'cancelled') { update.$set.cancelledAt = new Date(); update.$set.cancellationReason = extra?.note; }

    return orderRepository.updateById(orderId, update);
  }

  async cancelOrder(orderId: string, userId: string, reason?: string) {
    const order = await orderRepository.findById(orderId);
    if (!order) throw ApiError.notFound('Order not found');
    if (order.user.toString() !== userId) throw ApiError.forbidden('Access denied');
    if (!['pending', 'pending_confirmation', 'confirmed'].includes(order.status)) throw ApiError.badRequest('Order cannot be cancelled at this stage');

    await Promise.all(order.items.map((i) => productRepository.updateStock(i.product.toString(), i.qty)));
    return orderRepository.updateById(orderId, {
      $set: { status: 'cancelled', cancelledAt: new Date(), cancellationReason: reason },
      $push: { statusHistory: { status: 'cancelled', timestamp: new Date(), note: reason } },
    });
  }

  async listAllOrders(req: Request) {
    const pagination = getPaginationOptions(req);
    const { status, search, startDate, endDate } = req.query as any;
    const filter: any = {};
    if (status) filter.status = status;
    if (search) filter.$or = [{ orderId: { $regex: search, $options: 'i' } }];
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    return orderRepository.findAll({ filter, pagination, sort: { createdAt: -1 }, populate: 'user' });
  }
}
export const orderService = new OrderService();

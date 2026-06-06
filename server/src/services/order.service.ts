import { orderRepository } from '../repositories/order.repository';
import { assignmentRepository } from '../models/assignment.model';
import { productRepository } from '../repositories/product.repository';
import { couponRepository } from '../repositories/coupon.repository';
import { cartRepository } from '../repositories/cart.repository';
import { userRepository } from '../repositories/user.repository';
import { ApiError } from '../utils/ApiError';
import { getPaginationOptions } from '../utils/pagination';
import mongoose from 'mongoose';
import { ORDER_STATUS_TRANSITIONS, DISCOUNT_TYPE } from '../utils/constants';
import type { OrderStatus } from '../utils/constants';
import { Request } from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { env } from '../config/env';
import { emailService } from './email.service';
import { logger } from '../config/logger';
import path from 'path';

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
        image: product.images?.fullBody || (product.images as any)?.[0]?.url || (product.images as any)?.[0] || '',
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

    // --- Credits logic ---
    let creditDiscount = 0;
    let creditsRedeemed = 0;
    if (data.creditsToRedeem && data.creditsToRedeem > 0) {
      const { creditService } = await import('./credit.service');
      const requestedCredits = Number(data.creditsToRedeem);
      
      // We validate against the subtotal after coupon but before shipping/tax
      const amountEligibleForCredits = subtotal - couponDiscount;
      await creditService.validateRedemption(userId, requestedCredits, amountEligibleForCredits);
      
      creditsRedeemed = requestedCredits;
      creditDiscount = requestedCredits; // 1 credit = 1 INR
    }

    const finalTotal = total - creditDiscount;
    if (codAmount > 0) {
      codAmount = Math.max(0, codAmount - creditDiscount);
    }

    return { orderItems, subtotal, couponDiscount, couponId, shipping, tax, total: Math.max(0, finalTotal), codAmount, totalWeightGrams, creditDiscount, creditsRedeemed };
  }

  async initiateOrder(userId: string, data: any) {
    // If a retry is happening, an orderId is provided
    if (data.retryOrderId) {
      const existingOrder = await orderRepository.findById(data.retryOrderId);
      if (!existingOrder) throw ApiError.notFound('Order not found');
      if (existingOrder.status !== 'pending_verification') throw ApiError.badRequest('Order is not in pending state');
      
      const payableAmount = existingOrder.paymentInfo.method === 'cod' ? existingOrder.pricing.shipping : existingOrder.pricing.total;
      
      if (payableAmount > 0) {
        console.log(`[Razorpay] Re-creating order for retry. Amount: ${payableAmount}`);
        const rzpOrder = await razorpay.orders.create({
          amount: Math.round(payableAmount * 100),
          currency: 'INR',
          receipt: existingOrder.orderId,
        });
        
        const attemptNumber = (existingOrder.paymentAttempts?.length || 0) + 1;
        
        await orderRepository.updateById(existingOrder._id.toString(), {
          'paymentInfo.razorpayOrderId': rzpOrder.id,
          $push: {
            paymentAttempts: {
              attemptNumber,
              status: 'initiated',
              gatewayResponse: rzpOrder.id,
              timestamp: new Date()
            }
          }
        });
        
        return {
          order: existingOrder,
          razorpay: { razorpayOrderId: rzpOrder.id, amount: rzpOrder.amount, currency: rzpOrder.currency, keyId: env.razorpay.keyId }
        };
      }
      return { order: existingOrder };
    }

    const { orderItems, subtotal, couponDiscount, couponId, shipping, tax, total, codAmount, creditDiscount, creditsRedeemed } = await this.calculateOrderPricing(userId, data);
    
    let paymentStatus = 'pending';
    let orderStatus = 'pending_verification';
    let shippingPaid = false;
    let rzpOrderResult: any = null;
    
    const requiresRazorpay = data.paymentMethod !== 'cod' || (data.paymentMethod === 'cod' && shipping > 0);
    
    // 1. Generate Razorpay intent if needed
    if (requiresRazorpay) {
      const payableAmount = data.paymentMethod === 'cod' ? shipping : total;
      console.log(`[Razorpay] Creating order. Amount: ${payableAmount}`);
      const rzpOrder = await razorpay.orders.create({
        amount: Math.round(payableAmount * 100),
        currency: 'INR',
      });
      rzpOrderResult = { razorpayOrderId: rzpOrder.id, amount: rzpOrder.amount, currency: rzpOrder.currency, keyId: env.razorpay.keyId };
    } else if (data.paymentMethod === 'cod' && shipping === 0) {
      // orderStatus stays pending_verification, admin will confirm later
      shippingPaid = true;
    }

    // 2. Create Order in PENDING state
    const orderId = await orderRepository.generateOrderId();
    const invoiceNumber = await orderRepository.generateInvoiceId();
    const order = await orderRepository.create({
      orderId,
      invoiceNumber,
      user: userId as any,
      items: orderItems,
      shippingAddress: data.shippingAddress,
      shippingMethod: 'SPEED_POST',
      pricing: { subtotal, discount: 0, couponDiscount, couponCode: data.couponCode, creditDiscount, creditsRedeemed, shipping, shippingPaid, tax, total, codAmount: data.paymentMethod === 'cod' ? codAmount : undefined },
      paymentInfo: { 
        method: data.paymentMethod, 
        status: paymentStatus,
        razorpayOrderId: rzpOrderResult?.razorpayOrderId,
      },
      status: orderStatus as any,
      paymentAttempts: rzpOrderResult ? [{
        attemptNumber: 1,
        status: 'initiated',
        gatewayResponse: rzpOrderResult.razorpayOrderId,
        timestamp: new Date()
      }] : [],
      statusHistory: [{ status: orderStatus as any, timestamp: new Date() }],
      coupon: couponId as any,
    } as any);

    // 3. Deduct stock for each item (Reservation)
    await Promise.all(orderItems.map((i) => productRepository.updateStock(i.product.toString(), -i.qty)));

    // 4. If COD + free shipping, record as pending_verification but auto-finalize payment details
    if (data.paymentMethod === 'cod' && shipping === 0) {
      await this.finalizeOrder(order._id.toString());
    }

    // Return the created order and razorpay intent, BUT cart is NOT cleared yet
    return { order, razorpay: rzpOrderResult };
  }

  async finalizeOrder(orderId: string, razorpayData?: any) {
    const order = await orderRepository.findById(orderId);
    if (!order) throw ApiError.notFound('Order not found');

    const updateData: any = {
      'paymentInfo.status': order.paymentInfo.method === 'cod' ? 'shipping_paid' : 'paid',
      'pricing.shippingPaid': true,
      'paymentInfo.paidAt': new Date(),
      $push: {
        paymentAttempts: {
          attemptNumber: (order.paymentAttempts?.length || 0) + 1,
          status: 'success',
          gatewayResponse: razorpayData ? razorpayData.razorpayPaymentId : 'cod_verified',
          timestamp: new Date()
        }
      }
    };

    if (razorpayData) {
      updateData['paymentInfo.razorpayPaymentId'] = razorpayData.razorpayPaymentId;
      updateData['paymentInfo.razorpaySignature'] = razorpayData.razorpaySignature;
      if (order.paymentInfo.method === 'cod') {
        updateData['paymentInfo.shippingPaymentId'] = razorpayData.razorpayPaymentId;
      }
    }

    const updatedOrder = await orderRepository.updateById(orderId, {
      ...updateData,
    });

    if (!updatedOrder) throw ApiError.internal('Failed to update order');

    // Clear cart now that payment is confirmed
    await cartRepository.clearCart(updatedOrder.user.toString());

    // Record coupon usage
    if (updatedOrder.coupon) {
      await couponRepository.recordUsage(updatedOrder.coupon.toString(), updatedOrder.user.toString(), updatedOrder._id.toString(), updatedOrder.pricing.couponDiscount);
    }

    // Deduct redeemed credits
    if (updatedOrder.pricing.creditsRedeemed && updatedOrder.pricing.creditsRedeemed > 0) {
      const { creditService } = await import('./credit.service');
      await creditService.redeemCredits(updatedOrder.user.toString(), updatedOrder._id.toString(), updatedOrder.pricing.creditsRedeemed);
    }

    // Generate invoice and send email
    try {
      const user = await userRepository.findById(updatedOrder.user.toString());
      if (user && user.email) {
        const { invoiceService } = await import('./invoice.service');
        const { pdfPath, imagePath } = await invoiceService.generateInvoice(updatedOrder);
        await orderRepository.updateById(updatedOrder._id.toString(), { invoicePdfUrl: pdfPath, invoiceImageUrl: imagePath });
        updatedOrder.invoicePdfUrl = pdfPath;
        updatedOrder.invoiceImageUrl = imagePath;
        const fullPdfPath = path.join(process.cwd(), pdfPath);
        const fullImagePath = path.join(process.cwd(), imagePath);
        emailService.sendOrderConfirmation(user.email, updatedOrder, fullPdfPath, fullImagePath);
      }
    } catch (e) {
      logger.error('Failed to send email confirmation', e);
    }

    return updatedOrder;
  }

  async getMyOrders(userId: string, req: Request) {
    const pagination = getPaginationOptions(req);
    const { status } = req.query as any;
    return orderRepository.findByUser(userId, pagination, status);
  }

  async getOrderById(orderId: string, userId: string, role: string) {
    let order;
    const mongoose = require('mongoose');
    if (mongoose.Types.ObjectId.isValid(orderId)) {
      order = await orderRepository.findById(orderId);
    }
    if (!order) {
      order = await orderRepository.findByOrderId(orderId);
    }
    if (!order) throw ApiError.notFound('Order not found');
    if (role === 'customer' && order.user.toString() !== userId && order.user._id?.toString() !== userId) throw ApiError.forbidden('Access denied');
    return order;
  }

  async verifyPaymentAdmin(orderId: string, action: 'approve' | 'reject', adminId: string) {
    const newStatus = action === 'approve' ? 'confirmed' : 'payment_failed';
    return this.updateOrderStatus(orderId, newStatus, adminId, { note: `Payment ${action}d` });
  }

  async assignArtisan(orderId: string, artisanId: string, adminId: string) {
    const order = await orderRepository.findById(orderId);
    if (!order) throw ApiError.notFound('Order not found');

    await orderRepository.updateById(orderId, { $set: { assignedArtisan: artisanId as any, productionStage: 'assigned' } });
    
    // Create assignment record
    await assignmentRepository.create({
      assignmentId: `ASN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      orderId: order._id,
      artisanId: artisanId,
      assignedBy: adminId,
      status: 'in_progress',
      currentStage: 'assigned',
      artisanCharge: 0,
      amountPaid: 0,
      remainingAmount: 0,
      paymentCompleted: false
    });
    
    return this.updateOrderStatus(orderId, 'in_production', adminId, { note: `Assigned to artisan` });
  }

  async updateProductionStage(orderId: string, stage: string, adminId: string) {
    const order = await orderRepository.findById(orderId);
    if (!order) throw ApiError.notFound('Order not found');

    await orderRepository.updateById(orderId, { $set: { productionStage: stage } });
    
    // Sync currentStage to assignment
    if (order.assignedArtisan) {
      await assignmentRepository.findOneAndUpdate(
        { orderId: order._id, artisanId: order.assignedArtisan },
        { currentStage: stage }
      );
    }
    
    // Keep a note in the status history without changing the main status
    return orderRepository.updateById(orderId, {
      $push: { statusHistory: { status: 'in_production', updatedBy: adminId, timestamp: new Date(), note: `Production stage updated to: ${stage.replace('_', ' ')}` } }
    });
  }

  async markReadyForShipping(orderId: string, artisanId: string) {
    const order = await orderRepository.findById(orderId);
    if (order && order.assignedArtisan) {
      await assignmentRepository.findOneAndUpdate(
        { orderId: order._id, artisanId: order.assignedArtisan },
        { status: 'completed', currentStage: 'ready_for_dispatch' }
      );
      // We no longer update activeOrders or completedOrders statically on the Artisan model
    }
    return this.updateOrderStatus(orderId, 'ready_for_shipping', artisanId, { note: 'Work completed by artisan' });
  }

  async shipOrder(orderId: string, shippingData: any, adminId: string) {
    await orderRepository.updateById(orderId, {
      $set: { 
        courierName: shippingData.courierName, 
        trackingNumber: shippingData.trackingNumber,
        shippingDate: new Date()
      }
    });
    return this.updateOrderStatus(orderId, 'shipped', adminId, { 
      note: `Shipped via ${shippingData.courierName}`,
      trackingNumber: shippingData.trackingNumber
    });
  }

  async markDelivered(orderId: string, adminId: string) {
    return this.updateOrderStatus(orderId, 'delivered', adminId, { note: 'Order successfully delivered to customer' });
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

    const updatedOrder = await orderRepository.updateById(orderId, update);
    
    // Call Credit Service to earn or reverse credits
    if (newStatus === 'delivered' && updatedOrder) {
      const { creditService } = await import('./credit.service');
      await creditService.earnCredits(updatedOrder.user.toString(), updatedOrder._id.toString(), updatedOrder.pricing.total);
    } else if ((newStatus === 'cancelled' || newStatus as string === 'refund_approved' || newStatus as string === 'refunded') && updatedOrder) {
      const { creditService } = await import('./credit.service');
      await creditService.reverseCredits(updatedOrder.user.toString(), updatedOrder._id.toString());
    }

    // Send status update email asynchronously
    try {
      if (updatedOrder) {
        const user = await userRepository.findById(updatedOrder.user.toString());
        if (user && user.email) {
          emailService.sendStatusUpdateEmail(user.email, updatedOrder, newStatus);
        }
      }
    } catch (e) {
      logger.error('Failed to send status update email', e);
    }
    
    return updatedOrder;
  }

  async cancelOrder(orderId: string, userId: string, reason?: string) {
    const order = await orderRepository.findById(orderId);
    if (!order) throw ApiError.notFound('Order not found');
    if (order.user.toString() !== userId) throw ApiError.forbidden('Access denied');
    if (!['pending', 'pending_verification', 'confirmed'].includes(order.status)) throw ApiError.badRequest('Order cannot be cancelled at this stage');

    await Promise.all(order.items.map((i) => productRepository.updateStock(i.product.toString(), i.qty)));
    const updatedOrder = await orderRepository.updateById(orderId, {
      $set: { status: 'cancelled', cancelledAt: new Date(), cancellationReason: reason },
      $push: { statusHistory: { status: 'cancelled', timestamp: new Date(), note: reason } },
    });
    
    // Send cancellation email asynchronously
    try {
      if (updatedOrder) {
        const user = await userRepository.findById(userId);
        if (user && user.email) {
          emailService.sendStatusUpdateEmail(user.email, updatedOrder, 'cancelled');
        }
      }
    } catch (e) {
      logger.error('Failed to send cancellation email', e);
    }
    
    return updatedOrder;
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

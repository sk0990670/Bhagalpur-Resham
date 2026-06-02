import { orderRepository } from '../repositories/order.repository';
import { productRepository } from '../repositories/product.repository';
import { couponRepository } from '../repositories/coupon.repository';
import { cartRepository } from '../repositories/cart.repository';
import { ApiError } from '../utils/ApiError';
import { getPaginationOptions } from '../utils/pagination';
import { ORDER_STATUS_TRANSITIONS, DISCOUNT_TYPE } from '../utils/constants';
import type { OrderStatus } from '../utils/constants';
import { Request } from 'express';

class OrderService {
  async placeOrder(userId: string, data: any) {
    // 1. Validate items and collect product details
    const orderItems: any[] = [];
    for (const item of data.items) {
      const product = await productRepository.findById(item.product);
      if (!product || !product.isActive) throw ApiError.badRequest(`Product ${item.product} not found`);
      if (product.stock < item.qty) throw ApiError.badRequest(`Insufficient stock for ${product.name}`);
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0]?.url ?? '',
        sku: product.sku,
        price: product.price,
        discountPrice: product.discountPrice,
        qty: item.qty,
        total: (product.discountPrice ?? product.price) * item.qty,
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

    const shipping = subtotal > 1499 ? 0 : 99;
    const tax = Math.round((subtotal - couponDiscount) * 0.05); // 5% GST
    const total = subtotal - couponDiscount + shipping + tax;

    // 3. Generate order ID and create
    const orderId = await orderRepository.generateOrderId();
    const order = await orderRepository.create({
      orderId,
      user: userId as any,
      items: orderItems,
      shippingAddress: data.shippingAddress,
      pricing: { subtotal, discount: 0, couponDiscount, couponCode: data.couponCode, shipping, tax, total },
      paymentInfo: { method: data.paymentMethod, status: 'pending' },
      status: 'pending',
      statusHistory: [{ status: 'pending', timestamp: new Date() }],
      coupon: couponId as any,
    } as any);

    // 4. Deduct stock for each item
    await Promise.all(orderItems.map((i) => productRepository.updateStock(i.product.toString(), -i.qty)));

    // 5. Clear cart
    await cartRepository.clearCart(userId);

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
    if (!['pending', 'confirmed'].includes(order.status)) throw ApiError.badRequest('Order cannot be cancelled at this stage');

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

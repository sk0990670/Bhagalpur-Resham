import Razorpay from 'razorpay';
import crypto from 'crypto';
import { env } from '../config/env';
import { orderRepository } from '../repositories/order.repository';
import { couponRepository } from '../repositories/coupon.repository';
import { ApiError } from '../utils/ApiError';
import { logger } from '../config/logger';
import { orderService } from './order.service';

const razorpay = new Razorpay({ key_id: env.razorpay.keyId, key_secret: env.razorpay.keySecret });

class PaymentService {
  async initRazorpayOrder(userId: string, data: any) {
    // 1. Validate items and calculate exact price statelessly
    const { total, shipping } = await orderService.calculateOrderPricing(userId, data);
    
    // If COD, we only charge shipping upfront
    const payableAmount = data.paymentMethod === 'cod' ? shipping : total;

    if (payableAmount === 0) {
      throw ApiError.badRequest('Amount to pay is zero');
    }

    // 2. Generate Razorpay intent
    console.log(`[Razorpay] Creating order for user ${userId}. Amount: ${payableAmount} INR (${Math.round(payableAmount * 100)} paise)`);
    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(payableAmount * 100), // paise
      currency: 'INR',
    });
    console.log(`[Razorpay] Order created successfully: ${rzpOrder.id}`);

    return { 
      razorpayOrderId: rzpOrder.id, 
      amount: rzpOrder.amount, 
      currency: rzpOrder.currency, 
      keyId: env.razorpay.keyId 
    };
  }

  // Legacy method for admin or old flows, though likely unused now
  async createRazorpayOrder(orderId: string) {
    const order = await orderRepository.findById(orderId);
    if (!order) throw ApiError.notFound('Order not found');
    if (order.paymentInfo.method !== 'razorpay') throw ApiError.badRequest('Order is not a Razorpay order');

    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(order.pricing.total * 100), // paise
      currency: 'INR',
      receipt: order.orderId,
    });

    await orderRepository.updateById(orderId, { 'paymentInfo.razorpayOrderId': rzpOrder.id });
    return { razorpayOrderId: rzpOrder.id, amount: rzpOrder.amount, currency: rzpOrder.currency, keyId: env.razorpay.keyId };
  }

  async verifyPayment(data: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string; orderId: string }) {
    const body = `${data.razorpayOrderId}|${data.razorpayPaymentId}`;
    const expectedSig = crypto.createHmac('sha256', env.razorpay.keySecret).update(body).digest('hex');

    if (expectedSig !== data.razorpaySignature) {
      logger.warn(`Payment verification failed for order ${data.orderId}`);
      throw ApiError.badRequest('Payment verification failed. Invalid signature.');
    }

    const order = await orderService.finalizeOrder(data.orderId, data);

    logger.info(`Payment verified for order ${data.orderId}`);
    return order;
  }

  async getRazorpayKey() {
    return { keyId: env.razorpay.keyId };
  }
}
export const paymentService = new PaymentService();

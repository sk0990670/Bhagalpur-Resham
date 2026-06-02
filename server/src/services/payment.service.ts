import Razorpay from 'razorpay';
import crypto from 'crypto';
import { env } from '../config/env';
import { orderRepository } from '../repositories/order.repository';
import { couponRepository } from '../repositories/coupon.repository';
import { ApiError } from '../utils/ApiError';
import { logger } from '../config/logger';

const razorpay = new Razorpay({ key_id: env.razorpay.keyId, key_secret: env.razorpay.keySecret });

class PaymentService {
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

    const order = await orderRepository.updateById(data.orderId, {
      'paymentInfo.status': 'paid',
      'paymentInfo.razorpayOrderId': data.razorpayOrderId,
      'paymentInfo.razorpayPaymentId': data.razorpayPaymentId,
      'paymentInfo.razorpaySignature': data.razorpaySignature,
      'paymentInfo.paidAt': new Date(),
      status: 'confirmed',
      $push: { statusHistory: { status: 'confirmed', timestamp: new Date(), note: 'Payment verified' } },
    });

    // Record coupon usage after successful payment
    if (order?.coupon) {
      const fullOrder = await orderRepository.findById(data.orderId);
      if (fullOrder) {
        await couponRepository.recordUsage(
          order.coupon.toString(),
          fullOrder.user.toString(),
          data.orderId,
          fullOrder.pricing.couponDiscount
        );
      }
    }

    logger.info(`Payment verified for order ${data.orderId}`);
    return order;
  }

  async getRazorpayKey() {
    return { keyId: env.razorpay.keyId };
  }
}
export const paymentService = new PaymentService();

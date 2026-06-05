import { BaseRepository } from './base.repository';
import { Order, IOrder } from '../models/order.model';
import { Counter } from '../models/counter.model';
import { ORDER_STATUS, OrderStatus } from '../utils/constants';

export class OrderRepository extends BaseRepository<IOrder> {
  constructor() { super(Order); }

  async findByUser(userId: string, pagination: any, status?: string) {
    const filter: any = { user: userId };
    if (status) filter.status = status;
    return this.findAll({ filter, pagination, sort: { createdAt: -1 }, populate: 'items.product' });
  }

  async findByOrderId(orderId: string) {
    return Order.findOne({ orderId }).populate('user', 'name email').exec();
  }

  async updateStatus(orderId: string, status: OrderStatus, note?: string, adminId?: string) {
    return Order.findByIdAndUpdate(
      orderId,
      {
        $set: { status },
        $push: { statusHistory: { status, note, updatedBy: adminId, timestamp: new Date() } },
      },
      { new: true }
    ).exec();
  }

  async generateOrderId(): Promise<string> {
    const today = new Date();
    const dateStr = today.getFullYear().toString() +
      (today.getMonth() + 1).toString().padStart(2, '0') +
      today.getDate().toString().padStart(2, '0');

    const counterId = `order_${dateStr}`;
    const counter = await Counter.findOneAndUpdate(
      { id: counterId },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const seqStr = counter.seq.toString().padStart(6, '0');
    return `BRS-${dateStr}-${seqStr}`;
  }

  async generateInvoiceId(): Promise<string> {
    const today = new Date();
    const dateStr = today.getFullYear().toString() +
      (today.getMonth() + 1).toString().padStart(2, '0') +
      today.getDate().toString().padStart(2, '0');

    const counterId = `invoice_${dateStr}`;
    const counter = await Counter.findOneAndUpdate(
      { id: counterId },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const seqStr = counter.seq.toString().padStart(6, '0');
    return `INV-${dateStr}-${seqStr}`;
  }

  async getRevenueStats(startDate: Date, endDate: Date) {
    return Order.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate }, status: { $nin: [ORDER_STATUS.CANCELLED, ORDER_STATUS.REFUND_APPROVED] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$pricing.total' }, totalOrders: { $sum: 1 }, avgOrderValue: { $avg: '$pricing.total' } } },
    ]);
  }

  async getDailyRevenue(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    return Order.aggregate([
      { $match: { createdAt: { $gte: startDate }, status: { $nin: [ORDER_STATUS.CANCELLED, ORDER_STATUS.REFUND_APPROVED] } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, revenue: { $sum: '$pricing.total' }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
  }
}
export const orderRepository = new OrderRepository();

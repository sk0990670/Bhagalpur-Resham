import { BaseRepository } from './base.repository';
import { Order, IOrder } from '../models/order.model';
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
    const date = new Date();
    const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    const count = await Order.countDocuments();
    return `ORD-${dateStr}-${String(count + 1).padStart(4, '0')}`;
  }

  async getRevenueStats(startDate: Date, endDate: Date) {
    return Order.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate }, status: { $nin: [ORDER_STATUS.CANCELLED, ORDER_STATUS.REFUNDED] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$pricing.total' }, totalOrders: { $sum: 1 }, avgOrderValue: { $avg: '$pricing.total' } } },
    ]);
  }

  async getDailyRevenue(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    return Order.aggregate([
      { $match: { createdAt: { $gte: startDate }, status: { $nin: [ORDER_STATUS.CANCELLED, ORDER_STATUS.REFUNDED] } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, revenue: { $sum: '$pricing.total' }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
  }
}
export const orderRepository = new OrderRepository();

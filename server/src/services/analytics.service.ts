import { Order } from '../models/order.model';
import { Product } from '../models/product.model';
import { User } from '../models/user.model';
import { Review } from '../models/review.model';
import { orderRepository } from '../repositories/order.repository';
import { ORDER_STATUS } from '../utils/constants';

class AnalyticsService {
  async getDashboardStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalRevenue, monthRevenue, lastMonthRevenue,
      totalOrders, pendingOrders, totalUsers, totalProducts,
      lowStockProducts, avgRating, recentOrders,
    ] = await Promise.all([
      Order.aggregate([{ $match: { status: { $nin: [ORDER_STATUS.CANCELLED, ORDER_STATUS.REFUND_APPROVED] } } }, { $group: { _id: null, total: { $sum: '$pricing.total' } } }]),
      Order.aggregate([{ $match: { createdAt: { $gte: startOfMonth }, status: { $nin: [ORDER_STATUS.CANCELLED, ORDER_STATUS.REFUND_APPROVED] } } }, { $group: { _id: null, total: { $sum: '$pricing.total' }, count: { $sum: 1 } } }]),
      Order.aggregate([{ $match: { createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }, status: { $nin: [ORDER_STATUS.CANCELLED, ORDER_STATUS.REFUND_APPROVED] } } }, { $group: { _id: null, total: { $sum: '$pricing.total' } } }]),
      Order.countDocuments(),
      Order.countDocuments({ status: ORDER_STATUS.PENDING_VERIFICATION }),
      User.countDocuments({ role: 'customer' }),
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ stock: { $lte: 5 }, isActive: true }),
      Review.aggregate([{ $match: { status: 'approved' } }, { $group: { _id: null, avg: { $avg: '$rating' } } }]),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email').exec(),
    ]);

    const currentMonthRevenue = monthRevenue[0]?.total ?? 0;
    const prevMonthRevenue = lastMonthRevenue[0]?.total ?? 0;
    const revenueGrowth = prevMonthRevenue > 0 ? ((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100 : 0;

    return {
      revenue: { total: totalRevenue[0]?.total ?? 0, thisMonth: currentMonthRevenue, lastMonth: prevMonthRevenue, growth: revenueGrowth.toFixed(1) },
      orders: { total: totalOrders, thisMonth: monthRevenue[0]?.count ?? 0, pending: pendingOrders },
      users: { total: totalUsers },
      products: { total: totalProducts, lowStock: lowStockProducts },
      avgRating: avgRating[0]?.avg?.toFixed(1) ?? 0,
      recentOrders,
    };
  }

  async getSalesChart(days = 30) {
    return orderRepository.getDailyRevenue(days);
  }

  async getTopProducts(limit = 10) {
    return Order.aggregate([
      { $match: { status: { $nin: [ORDER_STATUS.CANCELLED, ORDER_STATUS.REFUND_APPROVED] } } },
      { $unwind: '$items' },
      { $group: { _id: '$items.product', name: { $first: '$items.name' }, totalQty: { $sum: '$items.qty' }, totalRevenue: { $sum: '$items.total' } } },
      { $sort: { totalRevenue: -1 } },
      { $limit: limit },
    ]);
  }

  async getOrderStatusBreakdown() {
    return Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
  }

  async getRevenueByCategory() {
    return Order.aggregate([
      { $match: { status: { $nin: [ORDER_STATUS.CANCELLED, ORDER_STATUS.REFUND_APPROVED] } } },
      { $unwind: '$items' },
      { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'productData' } },
      { $unwind: '$productData' },
      { $lookup: { from: 'categories', localField: 'productData.category', foreignField: '_id', as: 'categoryData' } },
      { $unwind: '$categoryData' },
      { $group: { _id: '$categoryData.name', revenue: { $sum: '$items.total' }, qty: { $sum: '$items.qty' } } },
      { $sort: { revenue: -1 } },
    ]);
  }

  async getCustomerGrowth(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    return User.aggregate([
      { $match: { role: 'customer', createdAt: { $gte: startDate } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
  }
}
export const analyticsService = new AnalyticsService();

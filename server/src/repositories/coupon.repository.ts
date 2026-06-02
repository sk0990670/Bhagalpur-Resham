import { BaseRepository } from './base.repository';
import { Coupon, ICoupon } from '../models/coupon.model';

export class CouponRepository extends BaseRepository<ICoupon> {
  constructor() { super(Coupon); }

  async findByCode(code: string) {
    return Coupon.findOne({ code: code.toUpperCase(), isActive: true }).exec();
  }

  async findActive(pagination: any) {
    const now = new Date();
    return this.findAll({
      filter: { isActive: true, validFrom: { $lte: now }, validTo: { $gte: now } },
      pagination,
      sort: { validTo: 1 },
    });
  }

  async recordUsage(couponId: string, userId: string, orderId: string, discountApplied: number) {
    return Coupon.findByIdAndUpdate(
      couponId,
      {
        $inc: { usesCount: 1 },
        $push: { usageHistory: { user: userId, order: orderId, usedAt: new Date(), discountApplied } },
      },
      { new: true }
    ).exec();
  }

  async getUserUsageCount(couponId: string, userId: string): Promise<number> {
    const result = await Coupon.aggregate([
      { $match: { _id: couponId as any } },
      { $project: { count: { $size: { $filter: { input: '$usageHistory', as: 'u', cond: { $eq: ['$$u.user', userId as any] } } } } } },
    ]);
    return result[0]?.count ?? 0;
  }
}
export const couponRepository = new CouponRepository();

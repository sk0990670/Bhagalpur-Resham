import { couponRepository } from '../repositories/coupon.repository';
import { ApiError } from '../utils/ApiError';
import { getPaginationOptions } from '../utils/pagination';
import { DISCOUNT_TYPE } from '../utils/constants';
import { Request } from 'express';

class CouponService {
  async listCoupons(req: Request) {
    const pagination = getPaginationOptions(req);
    return couponRepository.findAll({ pagination, sort: { validTo: 1 } });
  }

  async getCouponById(id: string) {
    const coupon = await couponRepository.findById(id);
    if (!coupon) throw ApiError.notFound('Coupon not found');
    return coupon;
  }

  async createCoupon(data: any, adminId: string) {
    const exists = await couponRepository.exists({ code: data.code });
    if (exists) throw ApiError.conflict('Coupon code already exists');
    return couponRepository.create({ ...data, createdBy: adminId, validFrom: new Date(data.validFrom), validTo: new Date(data.validTo) } as any);
  }

  async updateCoupon(id: string, data: any) {
    const coupon = await couponRepository.findById(id);
    if (!coupon) throw ApiError.notFound('Coupon not found');
    if (data.validFrom) data.validFrom = new Date(data.validFrom);
    if (data.validTo) data.validTo = new Date(data.validTo);
    return couponRepository.updateById(id, data);
  }

  async deleteCoupon(id: string) {
    const coupon = await couponRepository.deleteById(id);
    if (!coupon) throw ApiError.notFound('Coupon not found');
  }

  async validateCoupon(code: string, orderTotal: number, userId: string) {
    const coupon = await couponRepository.findByCode(code);
    if (!coupon) throw ApiError.badRequest('Invalid coupon code');

    const now = new Date();
    if (now < coupon.validFrom || now > coupon.validTo) throw ApiError.badRequest('Coupon has expired');
    if (coupon.maxUses && coupon.usesCount >= coupon.maxUses) throw ApiError.badRequest('Coupon usage limit reached');
    if (orderTotal < coupon.minOrderValue) throw ApiError.badRequest(`Minimum order value ₹${coupon.minOrderValue} required`);

    const userUsage = await couponRepository.getUserUsageCount(coupon._id.toString(), userId);
    if (userUsage >= coupon.maxUsesPerUser) throw ApiError.badRequest('You have already used this coupon');

    const discount = coupon.discountType === DISCOUNT_TYPE.PERCENTAGE
      ? Math.min((orderTotal * coupon.discountValue) / 100, coupon.maxDiscountAmount ?? Infinity)
      : Math.min(coupon.discountValue, orderTotal);

    return { valid: true, discount: Math.round(discount), coupon };
  }
}
export const couponService = new CouponService();

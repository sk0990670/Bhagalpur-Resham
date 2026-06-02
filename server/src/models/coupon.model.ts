import mongoose, { Document, Schema } from 'mongoose';
import { DISCOUNT_TYPE, DiscountType } from '../utils/constants';

/**
 * @swagger
 * components:
 *   schemas:
 *     Coupon:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         code: { type: string }
 *         description: { type: string }
 *         discountType: { type: string, enum: [percentage, fixed] }
 *         discountValue: { type: number }
 *         minOrderValue: { type: number }
 *         maxDiscountAmount: { type: number }
 *         maxUses: { type: integer }
 *         usesCount: { type: integer }
 *         maxUsesPerUser: { type: integer }
 *         validFrom: { type: string, format: date-time }
 *         validTo: { type: string, format: date-time }
 *         isActive: { type: boolean }
 *         applicableProducts: { type: array, items: { type: string } }
 *         applicableCategories: { type: array, items: { type: string } }
 */

export interface ICouponUsage {
  user: mongoose.Types.ObjectId;
  order: mongoose.Types.ObjectId;
  usedAt: Date;
  discountApplied: number;
}

export interface ICoupon extends Document {
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderValue: number;
  maxDiscountAmount?: number;  // Cap for percentage coupons
  maxUses?: number;            // null = unlimited
  usesCount: number;
  maxUsesPerUser: number;
  usageHistory: ICouponUsage[];
  validFrom: Date;
  validTo: Date;
  isActive: boolean;
  applicableProducts?: mongoose.Types.ObjectId[];  // Empty = all products
  applicableCategories?: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const couponUsageSchema = new Schema<ICouponUsage>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    usedAt: { type: Date, default: Date.now },
    discountApplied: { type: Number, required: true },
  },
  { _id: false },
);

const couponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: [30, 'Code cannot exceed 30 characters'],
      match: [/^[A-Z0-9_-]+$/, 'Code must contain only uppercase letters, numbers, hyphens, underscores'],
    },
    description: { type: String, trim: true },
    discountType: {
      type: String,
      enum: Object.values(DISCOUNT_TYPE),
      required: [true, 'Discount type is required'],
    },
    discountValue: {
      type: Number,
      required: [true, 'Discount value is required'],
      min: [0, 'Discount value cannot be negative'],
    },
    minOrderValue: { type: Number, default: 0, min: 0 },
    maxDiscountAmount: { type: Number, min: 0 },
    maxUses: { type: Number, min: 1 },
    usesCount: { type: Number, default: 0 },
    maxUsesPerUser: { type: Number, default: 1, min: 1 },
    usageHistory: [couponUsageSchema],
    validFrom: { type: Date, required: true },
    validTo: {
      type: Date,
      required: true,
    },
    isActive: { type: Boolean, default: true },
    applicableProducts: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    applicableCategories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// ── Virtuals ────────────────────────────────────────────
couponSchema.virtual('isExpired').get(function (this: ICoupon) {
  return new Date() > this.validTo;
});

couponSchema.virtual('isExhausted').get(function (this: ICoupon) {
  return this.maxUses != null && this.usesCount >= this.maxUses;
});

couponSchema.virtual('remainingUses').get(function (this: ICoupon) {
  if (this.maxUses == null) return null;
  return Math.max(0, this.maxUses - this.usesCount);
});

// ── Indexes ──────────────────────────────────────────────────
// Checkout coupon validation (most critical)
couponSchema.index({ code: 1, isActive: 1 });
// Validity window filter (active + not expired)
couponSchema.index({ isActive: 1, validFrom: 1, validTo: 1 });
// Per-user usage check (embedded usage history indexed by user)
couponSchema.index({ 'usageHistory.user': 1 });
// Admin coupon list by expiry
couponSchema.index({ validTo: 1 });

export const Coupon = mongoose.model<ICoupon>('Coupon', couponSchema);

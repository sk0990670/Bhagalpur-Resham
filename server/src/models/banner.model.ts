import mongoose, { Document, Schema } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Banner:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         title: { type: string }
 *         subtitle: { type: string }
 *         desktopImage: { type: string }
 *         mobileImage: { type: string }
 *         linkUrl: { type: string }
 *         linkText: { type: string }
 *         placement: { type: string }
 *         isActive: { type: boolean }
 *         sortOrder: { type: integer }
 *         validFrom: { type: string, format: date-time }
 *         validTo: { type: string, format: date-time }
 *         targetAudience: { type: string, enum: [all, logged_in, guest] }
 *         clickCount: { type: integer }
 */

export type BannerPlacement =
  | 'hero'
  | 'hero_secondary'
  | 'category_top'
  | 'product_listing'
  | 'checkout'
  | 'popup'
  | 'marquee';

export interface IBanner extends Document {
  title: string;
  subtitle?: string;
  desktopImage: string;
  desktopImagePublicId: string;
  mobileImage?: string;
  mobileImagePublicId?: string;
  alt?: string;
  linkUrl?: string;
  linkText?: string;
  openInNewTab: boolean;
  placement: BannerPlacement;
  isActive: boolean;
  sortOrder: number;
  validFrom?: Date;
  validTo?: Date;
  targetAudience: 'all' | 'logged_in' | 'guest';
  targetCategories?: mongoose.Types.ObjectId[];
  clickCount: number;
  viewCount: number;
  createdBy: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const bannerSchema = new Schema<IBanner>(
  {
    title: {
      type: String,
      required: [true, 'Banner title is required'],
      trim: true,
      maxlength: 150,
    },
    subtitle: { type: String, trim: true, maxlength: 300 },
    desktopImage: { type: String, required: [true, 'Desktop image is required'] },
    desktopImagePublicId: { type: String, required: true },
    mobileImage: { type: String },
    mobileImagePublicId: { type: String },
    alt: { type: String },
    linkUrl: { type: String, trim: true },
    linkText: { type: String, trim: true, maxlength: 50 },
    openInNewTab: { type: Boolean, default: false },
    placement: {
      type: String,
      enum: ['hero', 'hero_secondary', 'category_top', 'product_listing', 'checkout', 'popup', 'marquee'],
      required: [true, 'Placement is required'],
    },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    validFrom: { type: Date },
    validTo: { type: Date },
    targetAudience: {
      type: String,
      enum: ['all', 'logged_in', 'guest'],
      default: 'all',
    },
    targetCategories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    clickCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// ── Virtuals ─────────────────────────────────────────────────
bannerSchema.virtual('ctr').get(function () {
  if (this.viewCount === 0) return 0;
  return Number(((this.clickCount / this.viewCount) * 100).toFixed(2));
});

bannerSchema.virtual('isScheduled').get(function () {
  const now = new Date();
  if (this.validFrom && now < this.validFrom) return true;
  if (this.validTo && now > this.validTo) return true;
  return false;
});

// ── Indexes ──────────────────────────────────────────────────
// Storefront banner fetch (most critical — runs on every page load)
bannerSchema.index({ placement: 1, isActive: 1, sortOrder: 1 });
// Validity window filter for scheduled banners
bannerSchema.index({ isActive: 1, validFrom: 1, validTo: 1 });
// Target audience segmentation
bannerSchema.index({ placement: 1, isActive: 1, targetAudience: 1 });
// Admin dashboard list
bannerSchema.index({ placement: 1, createdAt: -1 });
// Analytics — top clicked banners
bannerSchema.index({ clickCount: -1 });

export const Banner = mongoose.model<IBanner>('Banner', bannerSchema);

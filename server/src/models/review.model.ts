import mongoose, { Document, Schema } from 'mongoose';
import { REVIEW_STATUS, ReviewStatus } from '../utils/constants';

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         user: { type: string }
 *         product: { type: string }
 *         order: { type: string }
 *         rating: { type: number, minimum: 1, maximum: 5 }
 *         title: { type: string }
 *         body: { type: string }
 *         images: { type: array, items: { type: string } }
 *         status: { type: string, enum: [pending, approved, rejected] }
 *         adminResponse: { type: string, nullable: true }
 *         helpfulVotes: { type: integer }
 *         votedBy: { type: array, items: { type: string } }
 */

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  order?: mongoose.Types.ObjectId;  // Verified purchase link
  rating: number;
  title?: string;
  body: string;
  images: string[];                 // Cloudinary URLs
  status: ReviewStatus;
  adminResponse?: string;
  adminRespondedAt?: Date;
  helpfulVotes: number;
  votedBy: mongoose.Types.ObjectId[];
  rejectionReason?: string;
  isVerifiedPurchase: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    title: {
      type: String,
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    body: {
      type: String,
      required: [true, 'Review text is required'],
      trim: true,
      minlength: [10, 'Review must be at least 10 characters'],
      maxlength: [2000, 'Review cannot exceed 2000 characters'],
    },
    images: [{ type: String }],
    status: {
      type: String,
      enum: Object.values(REVIEW_STATUS),
      default: REVIEW_STATUS.PENDING,
    },
    adminResponse: { type: String, trim: true },
    adminRespondedAt: { type: Date },
    helpfulVotes: { type: Number, default: 0 },
    votedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    rejectionReason: { type: String },
    isVerifiedPurchase: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// ── Compound unique: one review per user per product ─────────
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// ── Indexes ──────────────────────────────────────────────────
// Product detail page — approved reviews, newest first
reviewSchema.index({ product: 1, status: 1, createdAt: -1 });
// Admin moderation queue — pending reviews
reviewSchema.index({ status: 1, createdAt: -1 });
// Product rating recalculation aggregation
reviewSchema.index({ product: 1, status: 1, rating: 1 });
// User's own reviews
reviewSchema.index({ user: 1, createdAt: -1 });
// Verified purchases only filter
reviewSchema.index({ product: 1, isVerifiedPurchase: 1, status: 1 });
// Top-rated reviews
reviewSchema.index({ product: 1, status: 1, rating: -1, helpfulVotes: -1 });

// ── Post-save: update product avg rating ─────────────────────
reviewSchema.post('save', async function () {
  const ProductModel = mongoose.model('Product');
  const result = await mongoose.model('Review').aggregate([
    { $match: { product: this.product, status: REVIEW_STATUS.APPROVED } },
    { $group: { _id: '$product', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  if (result.length > 0) {
    await ProductModel.findByIdAndUpdate(this.product, {
      avgRating: Math.round(result[0].avgRating * 10) / 10,
      numReviews: result[0].count,
    });
  }
});

export const Review = mongoose.model<IReview>('Review', reviewSchema);

import mongoose, { Document, Schema } from 'mongoose';
import { CMS_TYPES, CmsType } from '../utils/constants';

/**
 * @swagger
 * components:
 *   schemas:
 *     CmsContent:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         type: { type: string, enum: [banner, faq, policy, artisan, blog, testimonial] }
 *         slug: { type: string }
 *         title: { type: string }
 *         subtitle: { type: string }
 *         content: { type: string }
 *         excerpt: { type: string }
 *         media: { type: object }
 *         metadata: { type: object }
 *         isPublished: { type: boolean }
 *         publishedAt: { type: string, format: date-time }
 *         sortOrder: { type: integer }
 *         tags: { type: array, items: { type: string } }
 */

export interface ICmsMedia {
  imageUrl?: string;
  imagePublicId?: string;
  videoUrl?: string;
  alt?: string;
}

export interface ICmsMetadata {
  metaTitle?: string;
  metaDescription?: string;
  author?: string;
  readTime?: number;         // minutes (for blogs)
  category?: string;         // FAQ category, policy type
  question?: string;         // For FAQ type
  answer?: string;           // For FAQ type
  artisanName?: string;      // For artisan type
  artisanVillage?: string;
  artisanExperience?: number; // Years
  testimonialRating?: number; // 1-5 for testimonials
  testimonialName?: string;
  testimonialLocation?: string;
  linkUrl?: string;          // CTA link for banners
  linkText?: string;         // CTA text for banners
}

export interface ICmsContent extends Document {
  type: CmsType;
  slug: string;
  title: string;
  subtitle?: string;
  content?: string;          // Rich HTML content
  excerpt?: string;
  media?: ICmsMedia;
  metadata?: ICmsMetadata;
  isPublished: boolean;
  publishedAt?: Date;
  sortOrder: number;
  tags: string[];
  createdBy: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const cmsMediaSchema = new Schema<ICmsMedia>(
  {
    imageUrl: { type: String },
    imagePublicId: { type: String },
    videoUrl: { type: String },
    alt: { type: String },
  },
  { _id: false },
);

const cmsMetadataSchema = new Schema<ICmsMetadata>(
  {
    metaTitle: { type: String },
    metaDescription: { type: String },
    author: { type: String },
    readTime: { type: Number },
    category: { type: String },
    question: { type: String },
    answer: { type: String },
    artisanName: { type: String },
    artisanVillage: { type: String },
    artisanExperience: { type: Number },
    testimonialRating: { type: Number, min: 1, max: 5 },
    testimonialName: { type: String },
    testimonialLocation: { type: String },
    linkUrl: { type: String },
    linkText: { type: String },
  },
  { _id: false },
);

const cmsSchema = new Schema<ICmsContent>(
  {
    type: {
      type: String,
      enum: Object.values(CMS_TYPES),
      required: [true, 'Content type is required'],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    subtitle: { type: String, trim: true },
    content: { type: String },
    excerpt: { type: String, maxlength: 500 },
    media: { type: cmsMediaSchema },
    metadata: { type: cmsMetadataSchema },
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date },
    sortOrder: { type: Number, default: 0 },
    tags: [{ type: String, lowercase: true }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// ── Pre-save: set publishedAt timestamp ───────────────────────
cmsSchema.pre('save', function () {
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

// ── Indexes ──────────────────────────────────────────────────
// Slug lookup (page render)
cmsSchema.index({ slug: 1, type: 1 }, { unique: true });
// Storefront: published content by type + sort
cmsSchema.index({ type: 1, isPublished: 1, sortOrder: 1 });
// Published content feed (blogs)
cmsSchema.index({ type: 1, isPublished: 1, publishedAt: -1 });
// Tag filtering
cmsSchema.index({ tags: 1, isPublished: 1 });
// Admin content list
cmsSchema.index({ type: 1, createdAt: -1 });
// Full-text search across CMS content
cmsSchema.index({ title: 'text', content: 'text', excerpt: 'text' });

export const CmsContent = mongoose.model<ICmsContent>('CmsContent', cmsSchema);

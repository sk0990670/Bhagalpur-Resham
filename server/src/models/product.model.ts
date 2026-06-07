import mongoose, { Document, Schema } from 'mongoose';
import { WEAVE_TYPES, WeaveType } from '../utils/constants';

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductImage:
 *       type: object
 *       properties:
 *         url: { type: string }
 *         publicId: { type: string }
 *         alt: { type: string }
 *         isPrimary: { type: boolean }
 *     Product:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         name: { type: string }
 *         slug: { type: string }
 *         description: { type: string }
 *         shortDescription: { type: string }
 *         price: { type: number }
 *         discountPrice: { type: number, nullable: true }
 *         stock: { type: integer }
 *         images: { type: array, items: { $ref: '#/components/schemas/ProductImage' } }
 *         tags: { type: array, items: { type: string } }
 *         weaveType: { type: string }
 *         weight: { type: number }
 *         dimensions: { type: object }
 *         avgRating: { type: number }
 *         numReviews: { type: integer }
 *         isFeatured: { type: boolean }
 *         isActive: { type: boolean }
 *         sku: { type: string }
 */

export interface IProductImageDetails {
  url: string;
  publicId: string;
}

export interface IProductImages {
  fullBody: IProductImageDetails | string;
  closeup?: IProductImageDetails | string;
  micro?: IProductImageDetails | string;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  sku: string;
  price: number;
  discountPrice?: number;
  stock: number;
  images: IProductImages;
  tags: string[];
  weaveType?: WeaveType;
  weight?: number; // grams
  dimensions?: {
    length: number; // cm
    width: number;
  };
  avgRating: number;
  numReviews: number;
  isFeatured: boolean;
  isActive: boolean;
  attributes?: Record<string, string>; // flexible: { color, occasion, blouse_piece }
  careInstructions?: string;
  badge?: 'Normal' | 'Authentic Collection' | 'New Arrival' | 'Best Seller';
  origin?: string;
  gstPercent?: number;
  createdAt: Date;
  updatedAt: Date;
  // Virtuals
  discountPercent?: number;
  effectivePrice?: number;
}

const imageDetailsSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false }
);

const productImagesSchema = new Schema<IProductImages>(
  {
    fullBody: { type: Schema.Types.Mixed, required: [true, 'Full body image is required'] },
    closeup: { type: Schema.Types.Mixed },
    micro: { type: Schema.Types.Mixed },
  },
  { _id: false }
);

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    shortDescription: { type: String, maxlength: 500 },
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    discountPrice: {
      type: Number,
      min: [0, 'Discount price cannot be negative'],
      validate: {
        validator: function (this: IProduct, val: number) {
          return !val || val < this.price;
        },
        message: 'Discount price must be less than original price',
      },
    },
    stock: {
      type: Number,
      required: true,
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    images: {
      type: productImagesSchema,
      required: true,
    },
    tags: [{ type: String, lowercase: true, trim: true }],
    weaveType: {
      type: String,
      enum: WEAVE_TYPES,
    },
    weight: { type: Number, min: 0 },
    dimensions: {
      length: { type: Number },
      width: { type: Number },
    },
    avgRating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0, min: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    attributes: { type: Map, of: String },
    careInstructions: { type: String },
    badge: {
      type: String,
      enum: ['Normal', 'Authentic Collection', 'New Arrival', 'Best Seller'],
      default: 'Normal',
    },
    origin: { type: String, default: 'Bhagalpur, Bihar' },
    gstPercent: { type: Number, default: 5 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// ── Virtuals ─────────────────────────────────────────────────
productSchema.virtual('effectivePrice').get(function () {
  return this.discountPrice ?? this.price;
});

productSchema.virtual('discountPercent').get(function () {
  if (!this.discountPrice || this.discountPrice >= this.price) return 0;
  return Math.round(((this.price - this.discountPrice) / this.price) * 100);
});

// ── Indexes ──────────────────────────────────────────────────
// Storefront listing: active products sorted by rating, price
productSchema.index({ isActive: 1, avgRating: -1 });
// Featured carousel
productSchema.index({ isFeatured: 1, isActive: 1 });
// Admin stock management
productSchema.index({ stock: 1, isActive: 1 });
// Price range filter
productSchema.index({ price: 1, discountPrice: 1 });
// Silk type filter (unique to Bhagalpur domain)
productSchema.index({ weaveType: 1, isActive: 1 });
// Tag-based filtering
productSchema.index({ tags: 1 });
// Full-text search
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
// Popularity (orders count proxy via numReviews + rating)
productSchema.index({ numReviews: -1, avgRating: -1 });

export const Product = mongoose.model<IProduct>('Product', productSchema);

import mongoose, { Document, Schema } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         name: { type: string }
 *         slug: { type: string }
 *         description: { type: string }
 *         image: { type: string }
 *         parent: { type: string, nullable: true }
 *         isActive: { type: boolean }
 *         sortOrder: { type: integer }
 */

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: mongoose.Types.ObjectId | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: { type: String, trim: true },
    image: { type: String },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

// ── Indexes ──────────────────────────────────────────────────
// Primary lookup by slug (nav menus, URLs)
categorySchema.index({ slug: 1 }, { unique: true });
// Fetch all active categories for storefront
categorySchema.index({ isActive: 1, sortOrder: 1 });
// Hierarchical queries — get children of a parent
categorySchema.index({ parent: 1, isActive: 1 });

export const Category = mongoose.model<ICategory>('Category', categorySchema);

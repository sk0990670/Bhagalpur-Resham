import mongoose, { Document, Schema } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     WishlistItem:
 *       type: object
 *       properties:
 *         product: { type: string }
 *         addedAt: { type: string, format: date-time }
 *     Wishlist:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         user: { type: string }
 *         items: { type: array, items: { $ref: '#/components/schemas/WishlistItem' } }
 */

export interface IWishlistItem {
  product: mongoose.Types.ObjectId;
  addedAt: Date;
}

export interface IWishlist extends Document {
  user: mongoose.Types.ObjectId;
  items: IWishlistItem[];
  createdAt: Date;
  updatedAt: Date;
}

const wishlistItemSchema = new Schema<IWishlistItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const wishlistSchema = new Schema<IWishlist>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,    // One wishlist per user
    },
    items: {
      type: [wishlistItemSchema],
      validate: {
        validator: (items: IWishlistItem[]) => items.length <= 100,
        message: 'Wishlist cannot contain more than 100 items',
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// ── Virtuals ─────────────────────────────────────────────────
wishlistSchema.virtual('totalItems').get(function () {
  return this.items.length;
});

// ── Indexes ──────────────────────────────────────────────────
// Primary lookup — one wishlist per user
wishlistSchema.index({ user: 1 }, { unique: true });
// Check if a specific product is in a user's wishlist
wishlistSchema.index({ user: 1, 'items.product': 1 });
// "Customers who wishlisted this" — product popularity signal
wishlistSchema.index({ 'items.product': 1 });

export const Wishlist = mongoose.model<IWishlist>('Wishlist', wishlistSchema);

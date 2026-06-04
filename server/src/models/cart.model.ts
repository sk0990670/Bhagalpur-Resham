import mongoose, { Document, Schema } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       properties:
 *         product: { type: string }
 *         name: { type: string }
 *         image: { type: string }
 *         price: { type: number }
 *         discountPrice: { type: number }
 *         qty: { type: integer }
 *         stock: { type: integer }
 *     Cart:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         user: { type: string }
 *         items: { type: array, items: { $ref: '#/components/schemas/CartItem' } }
 *         subtotal: { type: number }
 *         totalItems: { type: integer }
 */

export interface ICartItem {
  product: mongoose.Types.ObjectId | any;
  qty: number;
  addedToCartAt: Date;
}

export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
  subtotal: number;      // Computed virtual
  totalItems: number;    // Computed virtual
  expiresAt?: Date;      // For guest cart TTL
  updatedAt: Date;
  createdAt: Date;
}

const cartItemSchema = new Schema<ICartItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    qty: { type: Number, required: true, min: 1, default: 1 },
    addedToCartAt: { type: Date, default: Date.now },
  },
  { _id: true },
);

const cartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,    // One cart per user
    },
    items: [cartItemSchema],
    expiresAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// ── Virtuals ─────────────────────────────────────────────────
cartSchema.virtual('totalItems').get(function () {
  return this.items.reduce((sum, item) => sum + item.qty, 0);
});

cartSchema.virtual('subtotal').get(function () {
  return this.items.reduce((sum, item: any) => {
    // If product is populated, use its prices
    if (item.product && typeof item.product === 'object' && item.product.price) {
      const effectivePrice = item.product.discountPrice ?? item.product.price;
      return sum + effectivePrice * item.qty;
    }
    return sum; // Fallback if not populated
  }, 0);
});

// ── Indexes ──────────────────────────────────────────────────
// Cart refresh — lookup by product to update prices/stock
cartSchema.index({ 'items.product': 1 });
// Guest cart TTL (if used for unauthenticated sessions)
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, sparse: true });

export const Cart = mongoose.model<ICart>('Cart', cartSchema);

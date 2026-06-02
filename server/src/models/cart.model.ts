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
  product: mongoose.Types.ObjectId;
  name: string;          // Denormalized for read speed
  image: string;
  price: number;         // Snapshot — updated on cart fetch
  discountPrice?: number;
  qty: number;
  stock: number;         // Current stock — used for validation
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
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    qty: { type: Number, required: true, min: 1, default: 1 },
    stock: { type: Number, required: true, min: 0 },
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
  return this.items.reduce((sum, item) => {
    const effectivePrice = item.discountPrice ?? item.price;
    return sum + effectivePrice * item.qty;
  }, 0);
});

// ── Indexes ──────────────────────────────────────────────────
// Primary lookup — one cart per user
cartSchema.index({ user: 1 }, { unique: true });
// Cart refresh — lookup by product to update prices/stock
cartSchema.index({ 'items.product': 1 });
// Guest cart TTL (if used for unauthenticated sessions)
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, sparse: true });

export const Cart = mongoose.model<ICart>('Cart', cartSchema);

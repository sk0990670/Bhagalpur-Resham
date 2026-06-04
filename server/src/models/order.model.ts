import mongoose, { Document, Schema } from 'mongoose';
import {
  ORDER_STATUS,
  OrderStatus,
  PAYMENT_STATUS,
  PaymentStatus,
} from '../utils/constants';

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       properties:
 *         product: { type: string }
 *         name: { type: string }
 *         image: { type: string }
 *         sku: { type: string }
 *         price: { type: number }
 *         discountPrice: { type: number }
 *         qty: { type: integer }
 *         total: { type: number }
 *     OrderPricing:
 *       type: object
 *       properties:
 *         subtotal: { type: number }
 *         discount: { type: number }
 *         couponDiscount: { type: number }
 *         shipping: { type: number }
 *         tax: { type: number }
 *         total: { type: number }
 *     Order:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         orderId: { type: string }
 *         user: { type: string }
 *         items: { type: array, items: { $ref: '#/components/schemas/OrderItem' } }
 *         shippingAddress: { type: object }
 *         pricing: { $ref: '#/components/schemas/OrderPricing' }
 *         paymentInfo: { type: object }
 *         status: { type: string }
 *         trackingNumber: { type: string }
 *         notes: { type: string }
 */

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;          // Snapshot at time of order
  image: string;         // Snapshot
  sku: string;           // Snapshot
  price: number;         // Original price snapshot
  discountPrice?: number;
  qty: number;
  total: number;
}

export interface IShippingAddress {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
}

export interface IOrderPricing {
  subtotal: number;
  discount: number;
  couponDiscount: number;
  couponCode?: string;
  shipping: number;
  shippingPaid: boolean;
  codAmount?: number;
  tax: number;
  total: number;
}

export interface IPaymentInfo {
  method: 'razorpay' | 'cod' | 'bank_transfer' | 'upi' | 'card' | 'netbanking';
  status: PaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  shippingPaymentId?: string;
  paidAt?: Date;
  refundId?: string;
  refundedAt?: Date;
}

export interface IStatusHistory {
  status: OrderStatus;
  timestamp: Date;
  note?: string;
  updatedBy?: mongoose.Types.ObjectId;
}

export interface IOrder extends Document {
  orderId: string;       // Human-readable: ORD-20241024-0001
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  shippingMethod?: string;
  pricing: IOrderPricing;
  paymentInfo: IPaymentInfo;
  status: OrderStatus;
  statusHistory: IStatusHistory[];
  trackingNumber?: string;
  trackingUrl?: string;
  coupon?: mongoose.Types.ObjectId;
  estimatedDelivery?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
  notes?: string;        // Admin notes
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    sku: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    qty: { type: Number, required: true, min: 1 },
    total: { type: Number, required: true },
  },
  { _id: false },
);

const shippingAddressSchema = new Schema<IShippingAddress>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    locality: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  { _id: false },
);

const pricingSchema = new Schema<IOrderPricing>(
  {
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    couponDiscount: { type: Number, default: 0 },
    couponCode: { type: String },
    shipping: { type: Number, default: 0 },
    shippingPaid: { type: Boolean, default: false },
    codAmount: { type: Number },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
  },
  { _id: false },
);

const paymentInfoSchema = new Schema<IPaymentInfo>(
  {
    method: {
      type: String,
      enum: ['razorpay', 'cod', 'bank_transfer', 'upi', 'card', 'netbanking'],
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    shippingPaymentId: { type: String },
    paidAt: { type: Date },
    refundId: { type: String },
    refundedAt: { type: Date },
  },
  { _id: false },
);

const statusHistorySchema = new Schema<IStatusHistory>(
  {
    status: { type: String, enum: Object.values(ORDER_STATUS), required: true },
    timestamp: { type: Date, default: Date.now },
    note: { type: String },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { _id: false },
);

const orderSchema = new Schema<IOrder>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (items: IOrderItem[]) => items.length > 0,
        message: 'Order must contain at least one item',
      },
    },
    shippingAddress: { type: shippingAddressSchema, required: true },
    shippingMethod: { type: String },
    pricing: { type: pricingSchema, required: true },
    paymentInfo: { type: paymentInfoSchema, required: true },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING,
    },
    statusHistory: [statusHistorySchema],
    trackingNumber: { type: String, trim: true },
    trackingUrl: { type: String },
    coupon: { type: Schema.Types.ObjectId, ref: 'Coupon' },
    estimatedDelivery: { type: Date },
    deliveredAt: { type: Date },
    cancelledAt: { type: Date },
    cancellationReason: { type: String },
    notes: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// ── Indexes ──────────────────────────────────────────────────
// Customer's order history (most frequent query)
orderSchema.index({ user: 1, createdAt: -1 });
// Admin order management by status
orderSchema.index({ status: 1, createdAt: -1 });
// Payment lookup (Razorpay webhook)
orderSchema.index({ 'paymentInfo.razorpayOrderId': 1 }, { sparse: true });
// Revenue analytics by date range
orderSchema.index({ createdAt: -1, 'pricing.total': 1 });
// Pending orders dashboard
orderSchema.index({ status: 1, 'paymentInfo.status': 1 });
// Coupon usage analytics
orderSchema.index({ coupon: 1 }, { sparse: true });
// Delivered orders (for review prompts)
orderSchema.index({ user: 1, status: 1 });

export const Order = mongoose.model<IOrder>('Order', orderSchema);

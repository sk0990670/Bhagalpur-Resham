/** User roles for RBAC */
export const ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin',
  ARTISAN: 'artisan',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

/** Order status machine */
export const ORDER_STATUS = {
  PENDING_VERIFICATION: 'pending_verification',
  CONFIRMED: 'confirmed',
  IN_PRODUCTION: 'in_production',
  READY_FOR_SHIPPING: 'ready_for_shipping',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  PAYMENT_FAILED: 'payment_failed',
  CANCELLED: 'cancelled',
  RETURN_REQUESTED: 'return_requested',
  RETURN_RECEIVED: 'return_received',
  INSPECTION_PENDING: 'inspection_pending',
  REFUND_APPROVED: 'refund_approved',
  REFUND_REJECTED: 'refund_rejected',
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

/** Valid order status transitions (admin) */
export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending_verification: ['confirmed', 'payment_failed', 'cancelled'],
  confirmed: ['in_production', 'cancelled'],
  in_production: ['ready_for_shipping', 'cancelled'],
  ready_for_shipping: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: ['return_requested'],
  payment_failed: [],
  cancelled: [],
  return_requested: ['return_received', 'delivered'],
  return_received: ['inspection_pending'],
  inspection_pending: ['refund_approved', 'refund_rejected'],
  refund_approved: [],
  refund_rejected: [],
};

/** Payment status */
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  SHIPPING_PAID: 'shipping_paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

/** Review moderation status */
export const REVIEW_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export type ReviewStatus = (typeof REVIEW_STATUS)[keyof typeof REVIEW_STATUS];

/** Coupon discount types */
export const DISCOUNT_TYPE = {
  PERCENTAGE: 'percentage',
  FIXED: 'fixed',
} as const;

export type DiscountType = (typeof DISCOUNT_TYPE)[keyof typeof DISCOUNT_TYPE];

/** Weave types specific to Bhagalpur products */
export const WEAVE_TYPES = [
  'Pure Tussar Silk Weave',
  'Ghicha Silk Weave',
  'Matka Silk Weave',
  'Dupion Silk Weave',
  'Cotton-Silk Bhagalpuri Weave',
  'Zari Bhagalpuri Weave'
] as const;
export type WeaveType = (typeof WEAVE_TYPES)[number];

/** Valid color palette */
export const COLOR_TYPES = [
  'Red', 'Maroon', 'Pink', 'Peach', 'Orange', 'Mustard', 'Yellow', 'Gold',
  'Beige', 'Cream', 'Off White', 'White', 'Black', 'Grey', 'Silver', 'Brown',
  'Green', 'Olive Green', 'Mehendi Green', 'Mint Green', 'Sea Green',
  'Bottle Green', 'Emerald Green', 'Blue', 'Navy Blue', 'Royal Blue',
  'Sky Blue', 'Turquoise Blue', 'Teal Blue', 'Purple', 'Lavender',
  'Violet', 'Magenta', 'Wine', 'Rust', 'Coral', 'Multicolor'
] as const;
export type ColorType = (typeof COLOR_TYPES)[number];

/** CMS content types */
export const CMS_TYPES = {
  BANNER: 'banner',
  FAQ: 'faq',
  POLICY: 'policy',
  ARTISAN: 'artisan',
  BLOG: 'blog',
  TESTIMONIAL: 'testimonial',
} as const;

export type CmsType = (typeof CMS_TYPES)[keyof typeof CMS_TYPES];

/** Cookie names */
export const COOKIE_NAMES = {
  REFRESH_TOKEN: 'refreshToken',
} as const;

/** Default pagination */
export const DEFAULT_PAGE_LIMIT = 20;
export const MAX_PAGE_LIMIT = 100;

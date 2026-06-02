/** User roles for RBAC */
export const ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

/** Order status machine */
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
  RETURN_REQUESTED: 'return_requested',
  RETURNED: 'returned',
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

/** Valid order status transitions (admin) */
export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['out_for_delivery'],
  out_for_delivery: ['delivered'],
  delivered: ['return_requested'],
  return_requested: ['returned', 'delivered'],
  returned: ['refunded'],
  cancelled: [],
  refunded: [],
};

/** Payment status */
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
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

/** Silk types specific to Bhagalpur products */
export const SILK_TYPES = ['Tussar', 'Mulberry', 'Eri', 'Muga', 'Blended'] as const;
export type SilkType = (typeof SILK_TYPES)[number];

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

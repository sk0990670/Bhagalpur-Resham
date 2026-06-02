import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(120).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  parent: z.string().min(24).max(24).optional().nullable(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});
export const updateCategorySchema = createCategorySchema.partial();

export const createOrderSchema = z.object({
  items: z.array(z.object({ product: z.string().min(24).max(24), qty: z.number().int().min(1) })).min(1),
  shippingAddress: z.object({
    name: z.string().min(2), phone: z.string().min(10),
    addressLine1: z.string().min(5), addressLine2: z.string().optional(),
    city: z.string().min(2), state: z.string().min(2),
    pincode: z.string().regex(/^\d{6}$/),
  }),
  paymentMethod: z.enum(['razorpay', 'cod', 'bank_transfer']),
  couponCode: z.string().optional(),
  notes: z.string().max(500).optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'return_requested', 'returned', 'refunded']),
  note: z.string().optional(),
  trackingNumber: z.string().optional(),
  trackingUrl: z.string().url().optional(),
});

export const orderQuerySchema = z.object({
  page: z.string().optional(), limit: z.string().optional(),
  status: z.string().optional(), search: z.string().optional(),
  startDate: z.string().optional(), endDate: z.string().optional(),
  sort: z.string().optional(),
});

export const addToCartSchema = z.object({
  productId: z.string().min(24).max(24),
  qty: z.number().int().min(1).max(10),
});
export const updateCartItemSchema = z.object({ qty: z.number().int().min(0).max(10) });

export const createReviewSchema = z.object({
  productId: z.string().min(24).max(24),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(100).optional(),
  body: z.string().min(10).max(2000),
  orderId: z.string().min(24).max(24).optional(),
});
export const moderateReviewSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  rejectionReason: z.string().optional(),
  adminResponse: z.string().max(1000).optional(),
});

export const createCouponSchema = z.object({
  code: z.string().min(3).max(30).regex(/^[A-Z0-9_-]+$/),
  description: z.string().optional(),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.number().positive(),
  minOrderValue: z.number().min(0).default(0),
  maxDiscountAmount: z.number().positive().optional(),
  maxUses: z.number().int().positive().optional(),
  maxUsesPerUser: z.number().int().min(1).default(1),
  validFrom: z.string().datetime(),
  validTo: z.string().datetime(),
  applicableProducts: z.array(z.string().min(24).max(24)).optional(),
  applicableCategories: z.array(z.string().min(24).max(24)).optional(),
});
export const updateCouponSchema = createCouponSchema.partial();
export const applyCouponSchema = z.object({ code: z.string().min(1) });

export const createCmsSchema = z.object({
  type: z.enum(['banner', 'faq', 'policy', 'artisan', 'blog', 'testimonial']),
  slug: z.string().min(2).max(120),
  title: z.string().min(2).max(200),
  subtitle: z.string().optional(),
  content: z.string().optional(),
  excerpt: z.string().max(500).optional(),
  isPublished: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});
export const updateCmsSchema = createCmsSchema.partial();

export const createBannerSchema = z.object({
  title: z.string().min(2).max(150),
  subtitle: z.string().optional(),
  desktopImage: z.string().url(),
  desktopImagePublicId: z.string(),
  mobileImage: z.string().url().optional(),
  mobileImagePublicId: z.string().optional(),
  alt: z.string().optional(),
  linkUrl: z.string().url().optional(),
  linkText: z.string().max(50).optional(),
  openInNewTab: z.boolean().default(false),
  placement: z.enum(['hero', 'hero_secondary', 'category_top', 'product_listing', 'checkout', 'popup', 'marquee']),
  sortOrder: z.number().int().default(0),
  validFrom: z.string().datetime().optional(),
  validTo: z.string().datetime().optional(),
  targetAudience: z.enum(['all', 'logged_in', 'guest']).default('all'),
});
export const updateBannerSchema = createBannerSchema.partial();

export const verifyPaymentSchema = z.object({
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
  orderId: z.string().min(24).max(24),
});

export const analyticsQuerySchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  days: z.string().optional(),
});

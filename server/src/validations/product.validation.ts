import { z } from 'zod';
import { WEAVE_TYPES, COLOR_TYPES } from '../utils/constants';

const productImagesSchema = z.object({
  fullBody: z.string().url(),
  closeup: z.string().url().optional(),
  micro: z.string().url().optional(),
});


// Canonical SKU prefix per weave type — must match the UI SKU_PREFIX map
const SKU_PREFIX: Record<string, string> = {
  'Pure Tussar Silk Weave':       'TSS',
  'Ghicha Silk Weave':            'GHC',
  'Matka Silk Weave':             'MTK',
  'Dupion Silk Weave':            'DUP',
  'Cotton-Silk Bhagalpuri Weave': 'CSB',
  'Zari Bhagalpuri Weave':        'ZAR',
};

/** Validates that SKU prefix matches the chosen weave type */
function validateSkuPrefix(data: { sku?: string; weaveType?: string }): boolean {
  if (data.sku && data.weaveType) {
    const expected = SKU_PREFIX[data.weaveType];
    if (expected && !data.sku.toUpperCase().startsWith(`${expected}-`)) {
      return false;
    }
  }
  return true;
}

// Base object shape — no refine, so .partial().extend() works on updateProductSchema
const productBaseSchema = z.object({
  name: z.string().min(3).max(200),
  description: z.string().min(10),
  shortDescription: z.string().max(500).optional(),
  sku: z.string().min(3).max(50),
  price: z.number().positive(),
  discountPrice: z.number().positive().optional(),
  stock: z.number().int().min(0),
  images: productImagesSchema.optional(),
  tempImages: z.array(z.object({
    tempId: z.string(),
    shotType: z.enum(['fullBody', 'closeup', 'micro'])
  })).optional(),
  tags: z.array(z.string()).optional(),
  weaveType: z.enum(WEAVE_TYPES).optional(),
  weight: z.number().positive().optional(),
  inStock: z.boolean().default(true),
  isActive: z.boolean().optional(),
  careInstructions: z.string().optional(),
  badge: z.enum(['Normal', 'Authentic Collection', 'New Arrival', 'Best Seller']).optional(),
  gstPercent: z.number().min(0).max(28).optional(),
  attributes: z.object({
    color: z.enum(COLOR_TYPES),
    occasion: z.enum(['Wedding', 'Festive', 'Casual']),
  }).catchall(z.string()),
});

// Reusable refinement for discount price
const refineDiscountPrice = (data: any) => {
  if (data.discountPrice !== undefined && data.price !== undefined) {
    return data.discountPrice < data.price;
  }
  return true;
};

// Create schema: enforces SKU prefix rule and requires fullBody image
export const createProductSchema = productBaseSchema.refine(
  validateSkuPrefix,
  {
    message: 'SKU prefix must match the weave type (e.g. TSS- for Pure Tussar Silk Weave)',
    path: ['sku'],
  }
).refine(
  (data) => {
    const hasFullBodyTemp = data.tempImages?.some(img => img.shotType === 'fullBody');
    const hasFullBodyExisting = !!data.images?.fullBody;
    return hasFullBodyTemp || hasFullBodyExisting;
  },
  {
    message: 'Full body image is required to create a product',
    path: ['tempImages'],
  }
).refine(
  refineDiscountPrice,
  {
    message: 'Discount price must be less than the regular price',
    path: ['discountPrice'],
  }
);

// Update schema: all fields optional + image updates, same SKU prefix rule
export const updateProductSchema = productBaseSchema.partial().extend({
  imageUpdates: z.array(z.object({
    type: z.enum(['keep', 'new']),
    tempId: z.string().optional(),
    shotType: z.enum(['fullBody', 'closeup', 'micro'])
  })).optional()
}).refine(
  validateSkuPrefix,
  {
    message: 'SKU prefix must match the weave type (e.g. TSS- for Pure Tussar Silk Weave)',
    path: ['sku'],
  }
).refine(
  refineDiscountPrice,
  {
    message: 'Discount price must be less than the regular price',
    path: ['discountPrice'],
  }
);

export const productQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  weaveType: z.string().optional(),
  color: z.string().optional(),
  occasion: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  minRating: z.string().optional(),
  inStock: z.enum(['true', 'false']).optional(),
  sort: z.enum(['price_asc', 'price_desc', 'rating_desc', 'newest', 'popular']).optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;

import { z } from 'zod';
import { WEAVE_TYPES, COLOR_TYPES } from '../utils/constants';

const productImageSchema = z.object({
  url: z.string().url(),
  publicId: z.string(),
  alt: z.string().optional(),
  isPrimary: z.boolean().default(false),
  shotType: z.enum(['full_body', 'close_up', 'micro']).optional(),
});

export const createProductSchema = z.object({
  name: z.string().min(3).max(200),
  description: z.string().min(10),
  shortDescription: z.string().max(500).optional(),
  sku: z.string().min(3).max(50),
  price: z.number().positive(),
  discountPrice: z.number().positive().optional(),
  stock: z.number().int().min(0),
  images: z.array(productImageSchema).optional(), // optional if using tempImages
  tempImages: z.array(z.object({
    tempId: z.string(),
    shotType: z.enum(['full_body', 'close_up', 'micro'])
  })).length(3, 'Exactly 3 temporary images are required').optional(),
  tags: z.array(z.string()).optional(),
  weaveType: z.enum(WEAVE_TYPES).optional(),
  weight: z.number().positive().optional(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().optional(),
  careInstructions: z.string().optional(),
  badge: z.enum(['Normal', 'Authentic Collection', 'New Arrival', 'Best Seller']).optional(),
  gstPercent: z.number().min(0).max(28).optional(),
  attributes: z.object({
    color: z.enum(COLOR_TYPES).optional(),
    occasion: z.string().optional()
  }).catchall(z.string()).optional(),
});

export const updateProductSchema = createProductSchema.partial().extend({
  imageUpdates: z.array(z.object({
    type: z.enum(['keep', 'new']),
    publicId: z.string().optional(),
    tempId: z.string().optional(),
    shotType: z.enum(['full_body', 'close_up', 'micro'])
  })).optional()
});

export const productQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  weaveType: z.string().optional(), // Now supports comma-separated values
  color: z.string().optional(), // Supports comma-separated values
  occasion: z.string().optional(), // Supports comma-separated values
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  minRating: z.string().optional(),
  isFeatured: z.enum(['true', 'false']).optional(),
  inStock: z.enum(['true', 'false']).optional(),
  sort: z.enum(['price_asc', 'price_desc', 'rating_desc', 'newest', 'popular']).optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;

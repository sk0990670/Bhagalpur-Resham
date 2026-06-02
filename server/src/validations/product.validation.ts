import { z } from 'zod';
import { SILK_TYPES } from '../utils/constants';

const productImageSchema = z.object({
  url: z.string().url(),
  publicId: z.string(),
  alt: z.string().optional(),
  isPrimary: z.boolean().default(false),
});

export const createProductSchema = z.object({
  name: z.string().min(3).max(200),
  description: z.string().min(10),
  shortDescription: z.string().max(500).optional(),
  sku: z.string().min(3).max(50),
  price: z.number().positive(),
  discountPrice: z.number().positive().optional(),
  stock: z.number().int().min(0),
  category: z.string().min(24).max(24),
  tags: z.array(z.string()).optional(),
  silkType: z.enum(SILK_TYPES).optional(),
  weight: z.number().positive().optional(),
  isFeatured: z.boolean().default(false),
  careInstructions: z.string().optional(),
  gstPercent: z.number().min(0).max(28).optional(),
  attributes: z.record(z.string(), z.string()).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  category: z.string().optional(),
  silkType: z.enum(SILK_TYPES).optional(),
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

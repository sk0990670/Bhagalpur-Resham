import slugify from 'slugify';
import { productRepository } from '../repositories/product.repository';
import { ApiError } from '../utils/ApiError';
import { getPaginationOptions } from '../utils/pagination';
import { Request } from 'express';
import type { CreateProductInput, UpdateProductInput } from '../validations/product.validation';
import { productQueue } from '../queues/product.queue';
import { cloudinary } from '../config/cloudinary';
import { valkeyClient } from '../config/valkey';

class ProductService {
  async listProducts(req: Request) {
    const pagination = getPaginationOptions(req);
    const { search, weaveType, color, occasion, minPrice, maxPrice, minRating, isFeatured, inStock, sort } = req.query as any;

    const filter: Record<string, unknown> = {};
    
    if (search) filter.$text = { $search: search };
    if (weaveType) filter.weaveType = { $in: weaveType.split(',') };
    if (color) filter['attributes.color'] = { $in: color.split(',') };
    if (occasion) filter['attributes.occasion'] = { $in: occasion.split(',') };
    if (isFeatured === 'true') filter.isFeatured = true;
    if (inStock === 'true') filter.stock = { $gt: 0 };
    if (minRating) filter.avgRating = { $gte: Number(minRating) };

    const priceFilter: Record<string, number> = {};
    if (minPrice) priceFilter.$gte = Number(minPrice);
    if (maxPrice) priceFilter.$lte = Number(maxPrice);
    if (Object.keys(priceFilter).length) filter.price = priceFilter;

    if (sort === 'best_seller') filter.badge = 'Best Seller';
    if (sort === 'authentic') filter.badge = 'Authentic Collection';

    const sortMap: Record<string, any> = {
      price_asc: { price: 1 }, price_desc: { price: -1 },
      rating_desc: { avgRating: -1 }, newest: { createdAt: -1 }, popular: { numReviews: -1 },
    };
    
    // Sort by text relevance if searching and no explicit sort provided
    const sortObj = search && (!sort || sort === 'newest')
      ? { score: { $meta: 'textScore' } as any }
      : (sortMap[sort as string] ?? { createdAt: -1 });

    return productRepository.findForStorefront({ filter, pagination, sort: sortObj });
  }

  async adminListProducts(req: Request) {
    const pagination = getPaginationOptions(req);
    return productRepository.findAll({ filter: {}, pagination, sort: { createdAt: -1 } });
  }

  async getProductBySlug(slug: string) {
    const product = await productRepository.findBySlug(slug);
    if (!product) throw ApiError.notFound('Product not found');
    return product;
  }

  async getProductBySku(sku: string) {
    const product = await productRepository.findBySku(sku);
    if (!product) throw ApiError.notFound('Product not found');
    return product;
  }

  async getProductById(id: string) {
    const product = await productRepository.findById(id);
    if (!product) throw ApiError.notFound('Product not found');
    return product;
  }

  async getFeaturedProducts() {
    return productRepository.getFeatured(12);
  }

  async createProduct(data: CreateProductInput) {
    const slug = slugify(data.name, { lower: true, strict: true });
    const exists = await productRepository.exists({ slug });
    if (exists) throw ApiError.conflict('A product with this name already exists');

    const skuExists = await productRepository.exists({ sku: data.sku });
    if (skuExists) throw ApiError.conflict('SKU already exists');

    // If we have temporary images, we need to process this asynchronously
    if (data.tempImages && data.tempImages.length > 0) {
      await productQueue.add('process-product', {
        productData: data,
        tempImages: data.tempImages,
      });
      return { status: 'Processing', message: 'Product creation queued. Images are being uploaded in the background.' };
    }

    // Fallback if uploading synchronously
    if (!data.images || !data.images.fullBody) {
      throw ApiError.badRequest('Full body image is required');
    }

    return productRepository.create({ ...data, slug } as any);
  }

  async updateProduct(id: string, data: UpdateProductInput & { imageUpdates?: any }) {
    const product = await productRepository.findById(id);
    if (!product) throw ApiError.notFound('Product not found');

    if (data.name && data.name !== product.name) {
      const newSlug = slugify(data.name, { lower: true, strict: true });
      (data as any).slug = newSlug;
    }

    if (data.imageUpdates && data.imageUpdates.some((img: any) => img.type === 'new')) {
      await productQueue.add('update-product', {
        productId: id,
        productSku: data.sku || product.sku,
        productData: data,
        imageUpdates: data.imageUpdates,
        existingImages: product.images,
      });
      return { status: 'Processing', message: 'Product update queued. Images are being processed in the background.' };
    }

    const updatedProduct = await productRepository.updateById(id, data as Record<string, unknown>);
    
    // Clear Valkey cache
    const keys = await valkeyClient.keys('*');
    for (const key of keys) {
      if (key.includes('product') || key.includes('inventory') || key.includes('featured') || key.includes('category')) {
        await valkeyClient.del(key);
      }
    }
    
    return updatedProduct;
  }

  async deleteProduct(id: string) {
    const product = await productRepository.deleteById(id);
    if (!product) throw ApiError.notFound('Product not found');
    
    // Delete product images from Cloudinary
    try {
      if (product.sku) {
        const prefix = product.sku.split('-')[0];
        const folderPath = `bhagalpur-resham/products/${prefix}/${product.sku}`;
        // Delete all images within the folder
        await cloudinary.api.delete_resources_by_prefix(folderPath);
        // Delete the empty folder itself
        await cloudinary.api.delete_folder(folderPath);
      }
    } catch (error) {
      console.error(`Failed to delete Cloudinary images for product ${product.sku}:`, error);
      // We don't throw error to client if image deletion fails, as the product is already removed from DB
    }
    
    return product;
  }

}

export const productService = new ProductService();

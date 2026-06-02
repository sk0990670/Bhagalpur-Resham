import slugify from 'slugify';
import { productRepository } from '../repositories/product.repository';
import { ApiError } from '../utils/ApiError';
import { getPaginationOptions } from '../utils/pagination';
import { Request } from 'express';
import type { CreateProductInput, UpdateProductInput } from '../validations/product.validation';

class ProductService {
  async listProducts(req: Request) {
    const pagination = getPaginationOptions(req);
    const { search, category, silkType, minPrice, maxPrice, minRating, isFeatured, inStock, sort } = req.query as any;

    if (search) return productRepository.textSearch(search, pagination);

    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;
    if (silkType) filter.silkType = silkType;
    if (isFeatured === 'true') filter.isFeatured = true;
    if (inStock === 'true') filter.stock = { $gt: 0 };
    if (minRating) filter.avgRating = { $gte: Number(minRating) };

    const priceFilter: Record<string, number> = {};
    if (minPrice) priceFilter.$gte = Number(minPrice);
    if (maxPrice) priceFilter.$lte = Number(maxPrice);
    if (Object.keys(priceFilter).length) filter.price = priceFilter;

    const sortMap: Record<string, any> = {
      price_asc: { price: 1 }, price_desc: { price: -1 },
      rating_desc: { avgRating: -1 }, newest: { createdAt: -1 }, popular: { numReviews: -1 },
    };
    const sortObj = sortMap[sort as string] ?? { createdAt: -1 };

    return productRepository.findForStorefront({ filter, pagination, sort: sortObj });
  }

  async getProductBySlug(slug: string) {
    const product = await productRepository.findBySlug(slug);
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

    return productRepository.create({ ...data, slug, category: data.category as any });
  }

  async updateProduct(id: string, data: UpdateProductInput) {
    const product = await productRepository.findById(id);
    if (!product) throw ApiError.notFound('Product not found');

    if (data.name && data.name !== product.name) {
      const newSlug = slugify(data.name, { lower: true, strict: true });
      (data as any).slug = newSlug;
    }
    return productRepository.updateById(id, data as Record<string, unknown>);
  }

  async deleteProduct(id: string) {
    const product = await productRepository.deleteById(id);
    if (!product) throw ApiError.notFound('Product not found');
    return product;
  }

  async addImage(productId: string, image: object) {
    return productRepository.addImage(productId, image);
  }

  async removeImage(productId: string, publicId: string) {
    return productRepository.removeImage(productId, publicId);
  }
}

export const productService = new ProductService();

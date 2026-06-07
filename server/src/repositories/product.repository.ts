import { BaseRepository } from './base.repository';
import { Product, IProduct } from '../models/product.model';

export class ProductRepository extends BaseRepository<IProduct> {
  constructor() { super(Product); }

  async findBySlug(slug: string) {
    return Product.findOne({ slug, isActive: true }).exec();
  }

  async findBySku(sku: string) {
    return Product.findOne({ sku, isActive: true }).exec();
  }

  async findForStorefront(opts: {
    filter: Record<string, unknown>;
    pagination: any;
    sort: any;
  }) {
    return this.findAll({
      filter: { isActive: true, ...opts.filter },
      pagination: opts.pagination,
      sort: opts.sort,
    });
  }

  async textSearch(query: string, pagination: any) {
    const filter = { $text: { $search: query }, isActive: true };
    return this.findAll({ filter, pagination, sort: { score: { $meta: 'textScore' } as any } });
  }

  async updateStock(productId: string, delta: number) {
    return Product.findByIdAndUpdate(
      productId,
      { $inc: { stock: delta } },
      { new: true, runValidators: true }
    ).exec();
  }

}

export const productRepository = new ProductRepository();

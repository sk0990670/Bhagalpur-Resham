import { BaseRepository } from './base.repository';
import { Category, ICategory } from '../models/category.model';

export class CategoryRepository extends BaseRepository<ICategory> {
  constructor() { super(Category); }

  async findBySlug(slug: string) {
    return Category.findOne({ slug, isActive: true }).exec();
  }

  async findTree() {
    return Category.find({ isActive: true, parent: null })
      .sort({ sortOrder: 1 })
      .lean()
      .exec();
  }

  async findChildren(parentId: string) {
    return Category.find({ parent: parentId, isActive: true }).sort({ sortOrder: 1 }).exec();
  }
}
export const categoryRepository = new CategoryRepository();

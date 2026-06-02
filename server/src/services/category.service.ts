import slugify from 'slugify';
import { categoryRepository } from '../repositories/category.repository';
import { ApiError } from '../utils/ApiError';
import { getPaginationOptions } from '../utils/pagination';
import { Request } from 'express';

class CategoryService {
  async listCategories(req: Request) {
    const pagination = getPaginationOptions(req);
    const { isActive, parent } = req.query as any;
    const filter: Record<string, unknown> = {};
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (parent === 'null') filter.parent = null;
    else if (parent) filter.parent = parent;
    return categoryRepository.findAll({ filter, pagination, sort: { sortOrder: 1 } });
  }

  async getCategoryTree() {
    return categoryRepository.findTree();
  }

  async getCategoryBySlug(slug: string) {
    const cat = await categoryRepository.findBySlug(slug);
    if (!cat) throw ApiError.notFound('Category not found');
    return cat;
  }

  async getChildren(parentId: string) {
    return categoryRepository.findChildren(parentId);
  }

  async createCategory(data: Record<string, unknown>) {
    const slug = data.slug ?? slugify(data.name as string, { lower: true, strict: true });
    const exists = await categoryRepository.exists({ slug });
    if (exists) throw ApiError.conflict('Category slug already exists');
    return categoryRepository.create({ ...data, slug } as any);
  }

  async updateCategory(id: string, data: Record<string, unknown>) {
    const cat = await categoryRepository.findById(id);
    if (!cat) throw ApiError.notFound('Category not found');
    return categoryRepository.updateById(id, data);
  }

  async deleteCategory(id: string) {
    const cat = await categoryRepository.deleteById(id);
    if (!cat) throw ApiError.notFound('Category not found');
    return cat;
  }
}
export const categoryService = new CategoryService();

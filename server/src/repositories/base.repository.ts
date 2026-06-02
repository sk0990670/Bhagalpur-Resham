import { Model, Document, SortOrder } from 'mongoose';
import { PaginationOptions, PaginationMeta, buildPaginationMeta } from '../utils/pagination';

export interface FindAllOptions<T> {
  filter?: Record<string, unknown>;
  sort?: Record<string, SortOrder>;
  pagination?: PaginationOptions;
  populate?: string | string[];
  select?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * Generic base repository with common CRUD + pagination
 */
export class BaseRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  async findById(id: string, select?: string): Promise<T | null> {
    const q = this.model.findById(id);
    if (select) q.select(select);
    return q.exec();
  }

  async findOne(filter: Record<string, unknown>, select?: string): Promise<T | null> {
    const q = this.model.findOne(filter as any);
    if (select) q.select(select);
    return q.exec();
  }

  async findAll(opts: FindAllOptions<T> = {}): Promise<PaginatedResult<T>> {
    const { filter = {}, sort = { createdAt: -1 }, pagination, populate, select } = opts;

    const query = this.model.find(filter as any).sort(sort as any);
    const countQuery = this.model.countDocuments(filter as any);

    if (select) query.select(select);
    if (populate) {
      const pops = Array.isArray(populate) ? populate : [populate];
      pops.forEach((p) => query.populate(p));
    }
    if (pagination) {
      query.skip(pagination.skip).limit(pagination.limit);
    }

    const [data, total] = await Promise.all([query.exec(), countQuery]);
    const meta = buildPaginationMeta(total, pagination ?? { page: 1, limit: data.length, skip: 0 });
    return { data, meta };
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async updateById(id: string, update: Record<string, unknown>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, update as any, { new: true, runValidators: true }).exec();
  }

  async deleteById(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }

  async exists(filter: Record<string, unknown>): Promise<boolean> {
    return !!(await this.model.exists(filter as any));
  }

  async count(filter: Record<string, unknown> = {}): Promise<number> {
    return this.model.countDocuments(filter as any);
  }
}

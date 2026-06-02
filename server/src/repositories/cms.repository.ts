import { BaseRepository } from './base.repository';
import { CmsContent, ICmsContent } from '../models/cms.model';
import { Banner, IBanner } from '../models/banner.model';

export class CmsRepository extends BaseRepository<ICmsContent> {
  constructor() { super(CmsContent); }

  async findBySlugAndType(slug: string, type: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return CmsContent.findOne({ slug, type: type as any, isPublished: true }).exec();
  }

  async findPublishedByType(type: string, pagination: any) {
    return this.findAll({
      filter: { type, isPublished: true },
      pagination,
      sort: { sortOrder: 1, publishedAt: -1 },
    });
  }

  async findFAQs() {
    return CmsContent.find({ type: 'faq', isPublished: true }).sort({ sortOrder: 1 }).exec();
  }

  async searchContent(query: string, pagination: any) {
    return this.findAll({
      filter: { $text: { $search: query }, isPublished: true },
      pagination,
      sort: { score: { $meta: 'textScore' } as any },
    });
  }
}

export class BannerRepository extends BaseRepository<IBanner> {
  constructor() { super(Banner); }

  async findActiveBanners(placement: string) {
    const now = new Date();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Banner.find({
      placement: placement as any,
      isActive: true,
      $or: [
        { validFrom: null, validTo: null },
        { validFrom: { $lte: now }, validTo: { $gte: now } },
      ],
    }).sort({ sortOrder: 1 }).exec();
  }

  async incrementClick(bannerId: string) {
    return Banner.findByIdAndUpdate(bannerId, { $inc: { clickCount: 1 } }).exec();
  }

  async incrementView(bannerId: string) {
    return Banner.findByIdAndUpdate(bannerId, { $inc: { viewCount: 1 } }).exec();
  }
}

export const cmsRepository = new CmsRepository();
export const bannerRepository = new BannerRepository();

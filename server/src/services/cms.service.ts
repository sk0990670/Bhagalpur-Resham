import { cmsRepository, bannerRepository } from '../repositories/cms.repository';
import { ApiError } from '../utils/ApiError';
import { getPaginationOptions } from '../utils/pagination';
import { Request } from 'express';

class CmsService {
  // ── CMS Content ──────────────────────────────────────────
  async listContent(req: Request) {
    const pagination = getPaginationOptions(req);
    const { type, isPublished, search } = req.query as any;
    if (search) return cmsRepository.searchContent(search, pagination);
    const filter: any = {};
    if (type) filter.type = type;
    if (isPublished !== undefined) filter.isPublished = isPublished === 'true';
    return cmsRepository.findAll({ filter, pagination, sort: { sortOrder: 1 } });
  }

  async getContentBySlug(slug: string, type: string) {
    const content = await cmsRepository.findBySlugAndType(slug, type);
    if (!content) throw ApiError.notFound('Content not found');
    return content;
  }

  async getFAQs() { return cmsRepository.findFAQs(); }

  async createContent(data: any, adminId: string) {
    const exists = await cmsRepository.exists({ slug: data.slug, type: data.type });
    if (exists) throw ApiError.conflict('Content with this slug and type already exists');
    return cmsRepository.create({ ...data, createdBy: adminId } as any);
  }

  async updateContent(id: string, data: any, adminId: string) {
    const content = await cmsRepository.findById(id);
    if (!content) throw ApiError.notFound('Content not found');
    return cmsRepository.updateById(id, { ...data, updatedBy: adminId });
  }

  async deleteContent(id: string) {
    const content = await cmsRepository.deleteById(id);
    if (!content) throw ApiError.notFound('Content not found');
  }

  async publishContent(id: string) {
    return cmsRepository.updateById(id, { isPublished: true, publishedAt: new Date() });
  }

  async unpublishContent(id: string) {
    return cmsRepository.updateById(id, { isPublished: false });
  }

  // ── Banners ──────────────────────────────────────────────
  async getBannersByPlacement(placement: string) {
    return bannerRepository.findActiveBanners(placement);
  }

  async listBanners(req: Request) {
    const pagination = getPaginationOptions(req);
    const { placement, isActive } = req.query as any;
    const filter: any = {};
    if (placement) filter.placement = placement;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    return bannerRepository.findAll({ filter, pagination, sort: { placement: 1, sortOrder: 1 } });
  }

  async createBanner(data: any, adminId: string) {
    return bannerRepository.create({ ...data, createdBy: adminId, validFrom: data.validFrom ? new Date(data.validFrom) : undefined, validTo: data.validTo ? new Date(data.validTo) : undefined } as any);
  }

  async updateBanner(id: string, data: any, adminId: string) {
    const banner = await bannerRepository.findById(id);
    if (!banner) throw ApiError.notFound('Banner not found');
    return bannerRepository.updateById(id, { ...data, updatedBy: adminId });
  }

  async deleteBanner(id: string) {
    const banner = await bannerRepository.deleteById(id);
    if (!banner) throw ApiError.notFound('Banner not found');
  }

  async trackBannerClick(id: string) { return bannerRepository.incrementClick(id); }
  async trackBannerView(id: string) { return bannerRepository.incrementView(id); }
}
export const cmsService = new CmsService();

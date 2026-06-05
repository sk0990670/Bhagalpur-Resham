import api from './api';

export const cmsService = {
  // Public routes
  getFAQs: async () => {
    const response = await api.get('/cms/faqs');
    return response.data;
  },
  getBanners: async (placement: string) => {
    const response = await api.get(`/cms/banners/${placement}`);
    return response.data;
  },
  getBySlug: async (type: string, slug: string) => {
    const response = await api.get(`/cms/${type}/${slug}`);
    return response.data;
  },
  listContent: async (params?: any) => {
    const response = await api.get('/cms', { params });
    return response.data;
  },
  getStoryStats: async () => {
    const response = await api.get('/cms/story-stats');
    return response.data;
  },
  getPublicArtisans: async () => {
    const response = await api.get('/cms/public-artisans');
    return response.data;
  },

  // Admin routes
  create: async (data: any) => {
    const response = await api.post('/cms', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.patch(`/cms/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/cms/${id}`);
    return response.data;
  },
  publish: async (id: string) => {
    const response = await api.patch(`/cms/${id}/publish`);
    return response.data;
  },
  unpublish: async (id: string) => {
    const response = await api.patch(`/cms/${id}/unpublish`);
    return response.data;
  }
};

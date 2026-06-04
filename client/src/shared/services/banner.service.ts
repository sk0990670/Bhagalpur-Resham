import api from './api';

export const bannerService = {
  // Public routes
  listBanners: async (params?: any) => {
    const response = await api.get('/banners', { params });
    return response.data;
  },
  trackClick: async (id: string) => {
    const response = await api.post(`/banners/track-click/${id}`);
    return response.data;
  },

  // Admin routes
  createBanner: async (data: any) => {
    const response = await api.post('/banners', data);
    return response.data;
  },
  updateBanner: async (id: string, data: any) => {
    const response = await api.patch(`/banners/${id}`, data);
    return response.data;
  },
  deleteBanner: async (id: string) => {
    const response = await api.delete(`/banners/${id}`);
    return response.data;
  }
};

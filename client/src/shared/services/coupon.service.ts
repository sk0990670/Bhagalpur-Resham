import api from './api';

export const couponService = {
  // Customer routes
  validate: async (data: { code: string; cartTotal: number }) => {
    const response = await api.post('/coupons/validate', data);
    return response.data;
  },

  // Admin routes
  list: async (params?: any) => {
    const response = await api.get('/coupons', { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/coupons/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/coupons', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.patch(`/coupons/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/coupons/${id}`);
    return response.data;
  }
};

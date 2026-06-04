import api from './api';

export const categoryService = {
  // Public routes
  list: async (params?: any) => {
    const response = await api.get('/categories', { params });
    return response.data;
  },
  tree: async () => {
    const response = await api.get('/categories/tree');
    return response.data;
  },
  getBySlug: async (slug: string) => {
    const response = await api.get(`/categories/slug/${slug}`);
    return response.data;
  },
  children: async (id: string) => {
    const response = await api.get(`/categories/${id}/children`);
    return response.data;
  },

  // Admin routes
  create: async (data: any) => {
    const response = await api.post('/categories', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.patch(`/categories/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  }
};

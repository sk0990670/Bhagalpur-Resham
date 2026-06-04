import api from './api';

export const productService = {
  // Public routes
  getProducts: async (params?: any) => {
    const response = await api.get('/products', { params });
    return response.data;
  },
  getFeatured: async (params?: any) => {
    const response = await api.get('/products/featured', { params });
    return response.data;
  },
  getProductBySlug: async (slug: string) => {
    const response = await api.get(`/products/slug/${slug}`);
    return response.data;
  },
  getProductBySku: async (sku: string) => {
    const response = await api.get(`/products/sku/${sku}`);
    return response.data;
  },
  getProductById: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Admin routes
  getAdminProducts: async (params?: any) => {
    const response = await api.get('/products/all', { params });
    return response.data;
  },
  createProduct: async (data: any) => {
    const response = await api.post('/products', data);
    return response.data;
  },
  updateProduct: async (id: string, data: any) => {
    const response = await api.patch(`/products/${id}`, data);
    return response.data;
  },
  deleteProduct: async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
  addImage: async (id: string, data: any) => {
    // Assuming formData or image URLs
    const response = await api.post(`/products/${id}/images`, data);
    return response.data;
  },
  removeImage: async (id: string, publicId: string) => {
    const response = await api.delete(`/products/${id}/images/${publicId}`);
    return response.data;
  }
};

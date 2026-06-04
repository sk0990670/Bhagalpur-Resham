import api from './api';

export const analyticsService = {
  // Admin routes
  dashboard: async (params?: any) => {
    const response = await api.get('/analytics/dashboard', { params });
    return response.data;
  },
  sales: async (params?: any) => {
    const response = await api.get('/analytics/sales', { params });
    return response.data;
  },
  topProducts: async (params?: any) => {
    const response = await api.get('/analytics/top-products', { params });
    return response.data;
  },
  orderStatus: async (params?: any) => {
    const response = await api.get('/analytics/order-status', { params });
    return response.data;
  },
  revenueByCategory: async (params?: any) => {
    const response = await api.get('/analytics/revenue-by-category', { params });
    return response.data;
  },
  customerGrowth: async (params?: any) => {
    const response = await api.get('/analytics/customer-growth', { params });
    return response.data;
  }
};

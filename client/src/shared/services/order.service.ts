import api from './api';

export const orderService = {
  // Customer routes
  placeOrder: async (data: any) => {
    const response = await api.post('/orders', data);
    return response.data;
  },
  getMyOrders: async (params?: any) => {
    const response = await api.get('/orders/my-orders', { params });
    return response.data;
  },
  getOrderById: async (id: string) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  cancelOrder: async (id: string, data?: { reason: string }) => {
    const response = await api.patch(`/orders/${id}/cancel`, data);
    return response.data;
  },

  // Admin routes
  listAllOrders: async (params?: any) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },
  updateStatus: async (id: string, data: { status: string }) => {
    const response = await api.patch(`/orders/${id}/status`, data);
    return response.data;
  }
};

import api from './api';

export const orderService = {
  createOrder: async (data: any) => {
    const response = await api.post('/orders', data);
    return response.data;
  },
  getOrderHistory: async () => {
    const response = await api.get('/orders');
    return response.data;
  },
  trackOrder: async (orderId: string) => {
    const response = await api.get(`/orders/${orderId}/track`);
    return response.data;
  }
};

import api from './api';

export const cartService = {
  syncCart: async (items: any[]) => {
    const response = await api.post('/cart/sync', { items });
    return response.data;
  },
  checkout: async (data: any) => {
    const response = await api.post('/checkout', data);
    return response.data;
  }
};

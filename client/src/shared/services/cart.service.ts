import api from './api';

export const cartService = {
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },
  addItem: async (data: { productId: string; qty: number; selectedVariant?: any }) => {
    const response = await api.post('/cart/items', data);
    return response.data;
  },
  updateItem: async (productId: string, data: { qty: number; selectedVariant?: any }) => {
    const response = await api.patch(`/cart/items/${productId}`, data);
    return response.data;
  },
  removeItem: async (productId: string) => {
    const response = await api.delete(`/cart/items/${productId}`);
    return response.data;
  },
  clearCart: async () => {
    const response = await api.delete('/cart');
    return response.data;
  },
  syncCart: async (items: any[]) => {
    const response = await api.post('/cart/sync', { items });
    return response.data;
  }
};

import api from './api';

export const wishlistService = {
  getWishlist: async () => {
    const response = await api.get('/wishlist');
    return response.data;
  },
  addItem: async (data: { productId: string }) => {
    const response = await api.post('/wishlist/items', data);
    return response.data;
  },
  removeItem: async (productId: string) => {
    const response = await api.delete(`/wishlist/items/${productId}`);
    return response.data;
  },
  clearWishlist: async () => {
    const response = await api.delete('/wishlist');
    return response.data;
  },
  check: async (productId: string) => {
    const response = await api.get(`/wishlist/check/${productId}`);
    return response.data;
  }
};

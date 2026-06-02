import api from './api';

export const reviewService = {
  submitReview: async (data: any) => {
    const response = await api.post('/reviews', data);
    return response.data;
  },
  getReviewsForProduct: async (productId: string) => {
    const response = await api.get(`/products/${productId}/reviews`);
    return response.data;
  }
};

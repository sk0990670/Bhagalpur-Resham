import api from './api';

export const reviewService = {
  // Public routes
  getReviewsForProduct: async (productId: string, params?: any) => {
    const response = await api.get(`/reviews/product/${productId}`, { params });
    return response.data;
  },

  // Customer routes
  submitReview: async (data: any) => {
    const response = await api.post('/reviews', data);
    return response.data;
  },
  voteHelpful: async (id: string) => {
    const response = await api.patch(`/reviews/${id}/helpful`);
    return response.data;
  },
  deleteReview: async (id: string) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },

  // Admin routes
  getPendingReviews: async (params?: any) => {
    const response = await api.get('/reviews/pending', { params });
    return response.data;
  },
  moderateReview: async (id: string, data: { status: string; adminNotes?: string }) => {
    const response = await api.patch(`/reviews/${id}/moderate`, data);
    return response.data;
  }
};

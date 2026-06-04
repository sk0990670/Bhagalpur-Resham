import api from './api';

export const paymentService = {
  getKey: async () => {
    const response = await api.get('/payments/key');
    return response.data;
  },
  createOrder: async (orderId: string) => {
    const response = await api.post(`/payments/create-order/${orderId}`);
    return response.data;
  },
  verify: async (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => {
    const response = await api.post('/payments/verify', data);
    return response.data;
  }
};

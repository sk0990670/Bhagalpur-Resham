import api from './api';

export const userService = {
  // Customer routes
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  updateProfile: async (data: any) => {
    const response = await api.patch('/users/profile', data);
    return response.data;
  },
  changePassword: async (data: any) => {
    const response = await api.patch('/users/change-password', data);
    return response.data;
  },
  addAddress: async (data: any) => {
    const response = await api.post('/users/addresses', data);
    return response.data;
  },
  removeAddress: async (addressId: string) => {
    const response = await api.delete(`/users/addresses/${addressId}`);
    return response.data;
  },
  setDefaultAddress: async (addressId: string) => {
    const response = await api.patch(`/users/addresses/${addressId}/default`);
    return response.data;
  },

  // Admin routes
  listUsers: async (params?: any) => {
    const response = await api.get('/users', { params });
    return response.data;
  },
  createUser: async (data: any) => {
    const response = await api.post('/users', data);
    return response.data;
  },
  getUserById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  updateRole: async (id: string, data: { role: string }) => {
    const response = await api.patch(`/users/${id}/role`, data);
    return response.data;
  },
  deactivateUser: async (id: string) => {
    const response = await api.patch(`/users/${id}/deactivate`);
    return response.data;
  },
  activateUser: async (id: string) => {
    const response = await api.patch(`/users/${id}/activate`);
    return response.data;
  }
};

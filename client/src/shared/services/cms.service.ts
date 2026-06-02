import api from './api';

export const cmsService = {
  fetchPageContent: async (pageSlug: string) => {
    const response = await api.get(`/cms/${pageSlug}`);
    return response.data;
  },
  submitContactForm: async (data: any) => {
    const response = await api.post('/cms/contact', data);
    return response.data;
  }
};

import api from './api';

// POST /api/contact
export const sendContactMessage = async (payload) => {
  const { data } = await api.post('/contact', payload);
  return data;
};

import api from './api';

// GET /api/menu
export const fetchMenu = async ({ category, search } = {}) => {
  const { data } = await api.get('/menu', { params: { category, search } });
  return data.data;
};

// POST /api/menu (admin)
export const createMenuItem = async (payload) => {
  const { data } = await api.post('/menu', payload);
  return data.data;
};

// PUT /api/menu/:id (admin)
export const updateMenuItem = async (id, payload) => {
  const { data } = await api.put(`/menu/${id}`, payload);
  return data.data;
};

// DELETE /api/menu/:id (admin)
export const deleteMenuItem = async (id) => {
  const { data } = await api.delete(`/menu/${id}`);
  return data;
};

// PATCH /api/menu/:id/toggle (admin)
export const toggleAvailability = async (id) => {
  const { data } = await api.patch(`/menu/${id}/toggle`);
  return data.data;
};

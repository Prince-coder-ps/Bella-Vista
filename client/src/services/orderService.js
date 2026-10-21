import api from './api';

// POST /api/orders
export const createOrder = async (payload) => {
  const { data } = await api.post('/orders', payload);
  return data.data;
};

// GET /api/orders (admin)
export const fetchOrders = async () => {
  const { data } = await api.get('/orders');
  return data.data;
};

// GET /api/orders/mine (customer — server scopes by authenticated user's email)
export const fetchMyOrders = async () => {
  const { data } = await api.get('/orders/mine');
  return data.data;
};

// PATCH /api/orders/:id/status (admin)
export const updateOrderStatus = async (id, status) => {
  const { data } = await api.patch(`/orders/${id}/status`, { status });
  return data.data;
};

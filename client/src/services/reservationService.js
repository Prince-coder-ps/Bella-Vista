import api from './api';

// POST /api/reservations
export const createReservation = async (payload) => {
  const { data } = await api.post('/reservations', payload);
  return data.data;
};

// GET /api/reservations/availability?date=&time=
export const checkAvailability = async (date, time) => {
  const { data } = await api.get('/reservations/availability', { params: { date, time } });
  return data.data; // { available, remaining }
};

// GET /api/reservations (admin)
export const fetchReservations = async () => {
  const { data } = await api.get('/reservations');
  return data.data;
};

// GET /api/reservations/mine (customer — server scopes by authenticated user's email)
export const fetchMyReservations = async () => {
  const { data } = await api.get('/reservations/mine');
  return data.data;
};

// PATCH /api/reservations/:id/status (admin)
export const updateReservationStatus = async (id, status) => {
  const { data } = await api.patch(`/reservations/${id}/status`, { status });
  return data.data;
};

// DELETE /api/reservations/:id (admin)
export const deleteReservation = async (id) => {
  const { data } = await api.delete(`/reservations/${id}`);
  return data;
};

import api from './api';

// GET /api/admin/stats (admin) — one aggregated call for the dashboard overview
export const fetchDashboardStats = async () => {
  const { data } = await api.get('/admin/stats');
  return data.data;
};

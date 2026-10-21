import api, { setAccessToken } from './api';

// A tiny non-sensitive hint ("this browser has logged in before") so we only
// attempt a silent session restore for returning users — not for every
// anonymous visitor (which would 401 on every page load and burn rate limit).
// It holds no token or user data; the real session is the httpOnly cookie.
const HINT_KEY = 'bv_has_session';
const setHint = () => { try { localStorage.setItem(HINT_KEY, '1'); } catch { /* storage unavailable */ } };
const clearHint = () => { try { localStorage.removeItem(HINT_KEY); } catch { /* storage unavailable */ } };
const hasHint = () => { try { return localStorage.getItem(HINT_KEY) === '1'; } catch { return false; } };

// POST /api/auth/register
export const register = async ({ name, email, password }) => {
  const { data } = await api.post('/auth/register', { name, email, password });
  setAccessToken(data.data.accessToken);
  setHint();
  return data.data; // { user, accessToken }
};

// POST /api/auth/login
export const login = async ({ email, password }) => {
  const { data } = await api.post('/auth/login', { email, password });
  setAccessToken(data.data.accessToken);
  setHint();
  return data.data; // { user, accessToken }
};

// POST /api/auth/logout
export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch {
    // Even if the network call fails, still sign out locally.
  } finally {
    setAccessToken(null);
    clearHint();
  }
};

// POST /api/auth/refresh — uses the httpOnly cookie automatically.
export const refreshSession = async () => {
  const { data } = await api.post('/auth/refresh');
  setAccessToken(data.data.accessToken);
  return data.data.accessToken;
};

export const clearSessionHint = clearHint;

// Called once on app load to silently restore a session.
export const getCurrentUser = async () => {
  if (!hasHint()) return null;
  try {
    await refreshSession();
    const { data } = await api.get('/auth/me');
    return data.data.user;
  } catch (err) {
    setAccessToken(null);
    // Only forget the hint when the server said the session is invalid; keep
    // it on network blips so a flaky connection doesn't log people out.
    if (err?.response?.status === 401) clearHint();
    return null;
  }
};

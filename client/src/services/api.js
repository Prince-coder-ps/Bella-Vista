import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // send/receive the httpOnly refresh-token cookie
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// The access token is kept in memory only (never localStorage) to limit the
// blast radius of an XSS attack — a compromised page could still read
// localStorage, but not a variable that lives only in this module's closure.
let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

// AuthContext registers a callback here so that when a silent refresh fails
// (session expired / revoked) the UI drops to "logged out" immediately
// instead of showing a logged-in state that no longer works.
let onAuthFailure = null;
export const setAuthFailureHandler = (fn) => {
  onAuthFailure = fn;
};

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Track in-flight refresh so concurrent 401s don't all trigger their own refresh call.
let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthRoute =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/register') ||
      originalRequest?.url?.includes('/auth/refresh') ||
      originalRequest?.url?.includes('/auth/logout');

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true;
      try {
        if (!refreshPromise) {
          refreshPromise = api.post('/auth/refresh').finally(() => {
            refreshPromise = null;
          });
        }
        const { data } = await refreshPromise;
        setAccessToken(data.data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        setAccessToken(null);
        if (onAuthFailure) onAuthFailure();
        return Promise.reject(error); // surface the original 401, not the refresh failure
      }
    }

    return Promise.reject(error);
  }
);

export default api;

import axios from 'axios';
import { store } from '../../app/store';
import { setCredentials, logout } from '../../features/auth/authSlice';
import { setWishlistItems } from '../../features/wishlist/wishlistSlice';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request interceptor: attach access token ──────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Track if we are already refreshing to prevent concurrent refresh calls ──
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

// ── Response interceptor: handle 401 with token refresh ──────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh on 401 and only once per request
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      // Don't retry refresh-token or login requests themselves
      !originalRequest.url?.includes('/auth/refresh-token') &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/register')
    ) {
      if (isRefreshing) {
        // Queue request until token is refreshed
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to get a new access token via httpOnly refresh-token cookie
        const res = await api.post('/auth/refresh-token');
        const newAccessToken = res.data?.data?.accessToken;

        if (newAccessToken) {
          // Update Redux store with new token (keep existing user)
          const currentUser = store.getState().auth.user;
          store.dispatch(setCredentials({ token: newAccessToken, user: currentUser }));

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          onRefreshed(newAccessToken);
          isRefreshing = false;
          return api(originalRequest);
        }
      } catch (_refreshError) {
        // Refresh failed — session truly expired
        isRefreshing = false;
        refreshSubscribers = [];

        store.dispatch(logout());
        store.dispatch(setWishlistItems([]));

        // Redirect to login with a single session-expired message
        window.location.href = '/login?session_expired=1';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

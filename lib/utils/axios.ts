import { useAuthStore } from '@/stores/authStore';
import axios from 'axios';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Inject token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// (Optional) Add a response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can handle 401/403 here and auto-logout or refresh
    return Promise.reject(error);
  }
);

export default api;

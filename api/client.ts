import axios, { AxiosInstance, AxiosError } from 'axios';
import { storage } from '../utils/storage';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.API_URL || 'http://localhost:3000';

export const apiClient: AxiosInstance = axios.create({
  baseURL:  API_URL,
  timeout:  15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor:  Add auth token
apiClient.interceptors.request. use(
  async (config) => {
    const token = await storage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor:  Handle 401, refresh token
apiClient.interceptors.response. use(
  (response) => response,
  async (error:  AxiosError) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest?. headers['X-Retry']) {
      originalRequest! .headers['X-Retry'] = 'true';

      try {
        const refreshToken = await storage.getRefreshToken();
        if (!refreshToken) throw new Error('No refresh token');

        const response = await axios.post(`${API_URL}/api/auth/refresh`, {
          refreshToken,
        });

        const { accessToken } = response.data. data;
        await storage.setAccessToken(accessToken);

        return apiClient(originalRequest);
      } catch (refreshError) {
        // Redirect to login
        await storage.clearAll();
        throw refreshError;
      }
    }

    return Promise.reject(error);
  },
);
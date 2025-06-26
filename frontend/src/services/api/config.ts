import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { refreshAccessToken, isTokenExpiredError } from './authUtils';

// Base URL từ backend Spring Boot
const API_BASE_URL = 'http://localhost:8080/TopCV/api/v1';

// Tạo axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Để gửi cookies (refresh_token)
});

// Request interceptor để add token vào header
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig): any => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor để handle errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Kiểm tra nếu là token expired error và chưa retry
    if (isTokenExpiredError(error) && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Gọi utility function để refresh token
        const refreshResult = await refreshAccessToken();
        
        if (refreshResult.success && refreshResult.token) {
          // Cập nhật header cho request gốc
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${refreshResult.token}`;
          }
          
          // Retry request với token mới
          return apiClient(originalRequest);
        } else {
          throw new Error(refreshResult.error || 'Refresh token failed');
        }
      } catch (refreshError) {
        console.error('Refresh token failed in interceptor:', refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient; 
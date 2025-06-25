import apiClient from './config';

// Types dựa trên backend DTOs
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ApiResponse<T> {
  code?: number;
  message?: string;
  result: T;
}

// Authentication API service
export const authApi = {
  // POST /api/v1/auth/login
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  // POST /api/v1/auth/refresh
  refreshToken: async (): Promise<ApiResponse<LoginResponse>> => {
    const response = await apiClient.post('/auth/refresh');
    return response.data;
  },

  // POST /api/v1/auth/logout
  logout: async (): Promise<ApiResponse<void>> => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  // POST /api/v1/auth/forgot-password
  forgotPassword: async (data: ForgotPasswordRequest): Promise<ApiResponse<string>> => {
    const response = await apiClient.post('/auth/forgot-password', data);
    return response.data;
  },

  // POST /api/v1/auth/reset-password
  resetPassword: async (data: ResetPasswordRequest): Promise<ApiResponse<string>> => {
    const response = await apiClient.post('/auth/reset-password', data);
    return response.data;
  },
}; 
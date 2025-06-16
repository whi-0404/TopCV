import apiClient from './config';
import { ApiResponse } from './authApi';

// Types dựa trên backend DTOs
export interface UserRegistrationRequest {
  email: string;
  password: string;
  fullname: string;
  phone?: string;
  address?: string;
}

export interface RegistrationResponse {
  keyRedisToken: string; // Token để verify email
  email: string;
}

export interface UserResponse {
  id: string;
  userName?: string;
  email: string;
  fullname: string;
  phone?: string;
  address?: string;
  avt?: string;
  role: string;
  isActive: boolean;
  isEmailVerified: boolean;
  dob?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserUpdateRequest {
  userName?: string;
  fullName?: string;
  phone?: string;
  address?: string;
  avt?: string;
  dob?: string; // ISO datetime string (e.g., "2004-02-02T00:00:00")
}

export interface VerifyOtpRequest {
  keyRedisToken: string; // Token từ registration response  
  otp: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface PageResponse<T> {
  data: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// User API service
export const userApi = {
  // POST /api/v1/users/register
  register: async (data: UserRegistrationRequest): Promise<ApiResponse<RegistrationResponse>> => {
    const response = await apiClient.post('/users/register', data);
    return response.data;
  },

  // GET /api/v1/users/my-info
  getMyInfo: async (): Promise<ApiResponse<UserResponse>> => {
    const response = await apiClient.get('/users/my-info');
    return response.data;
  },

  // PUT /api/v1/users/my-info
  updateMyInfo: async (data: UserUpdateRequest): Promise<ApiResponse<UserResponse>> => {
    const response = await apiClient.put('/users/my-info', data);
    return response.data;
  },

  // GET /api/v1/users/{userId}
  getUserById: async (userId: string): Promise<ApiResponse<UserResponse>> => {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  },

  // DELETE /api/v1/users/{userId}
  deleteUser: async (userId: string): Promise<ApiResponse<string>> => {
    const response = await apiClient.delete(`/users/${userId}`);
    return response.data;
  },

  // GET /api/v1/users
  getAllUsers: async (page: number = 1, size: number = 10): Promise<ApiResponse<PageResponse<UserResponse>>> => {
    const response = await apiClient.get('/users', {
      params: { page, size }
    });
    return response.data;
  },

  // GET /api/v1/users/search
  searchUsers: async (keyword: string, page: number = 1, size: number = 10): Promise<ApiResponse<PageResponse<UserResponse>>> => {
    const response = await apiClient.get('/users/search', {
      params: { keyword, page, size }
    });
    return response.data;
  },

  // POST /api/v1/users/verify-email
  verifyEmail: async (data: VerifyOtpRequest): Promise<ApiResponse<UserResponse>> => {
    const response = await apiClient.post('/users/verify-email', data);
    return response.data;
  },

  // POST /api/v1/users/change-password
  changePassword: async (data: ChangePasswordRequest): Promise<ApiResponse<string>> => {
    const response = await apiClient.post('/users/change-password', data);
    return response.data;
  },

  // PUT /api/v1/users/{userId}/activate
  activateUser: async (userId: string): Promise<ApiResponse<string>> => {
    const response = await apiClient.put(`/users/${userId}/activate`);
    return response.data;
  },

  // PUT /api/v1/users/{userId}/deactivate
  deactivateUser: async (userId: string): Promise<ApiResponse<string>> => {
    const response = await apiClient.put(`/users/${userId}/deactivate`);
    return response.data;
  },

  // GET /api/v1/users/followed
  getFollowedCompanies: async (page: number = 1, size: number = 10): Promise<ApiResponse<PageResponse<any>>> => {
    const response = await apiClient.get('/users/followed', {
      params: { page, size }
    });
    return response.data;
  },

  // GET /api/v1/users/job-posts-favorite
  getFavoriteJobs: async (page: number = 1, size: number = 10): Promise<ApiResponse<PageResponse<any>>> => {
    const response = await apiClient.get('/users/job-posts-favorite', {
      params: { page, size }
    });
    return response.data;
  },

  // Alias for updateMyInfo
  updateProfile: async (data: UserUpdateRequest): Promise<ApiResponse<UserResponse>> => {
    return userApi.updateMyInfo(data);
  },
}; 
import apiClient from './config';
import { ApiResponse } from './authApi';
import { FileUploadResponse } from './resumeApi';
import { CompanyReviewResponse, CompanyReviewRequest } from '../../types';

// Types dựa trên backend DTOs
export interface CompanyCreationRequest {
  name: string;
  description: string;
  logo?: string;
  website?: string;
  employeeRange?: string;
  address?: string;
  categoryIds?: number[];
}

export interface CompanyUpdateRequest {
  name?: string;
  description?: string;
  logo?: string;
  website?: string;
  employeeRange?: string;
  address?: string;
  categoryIds?: number[];
}

export interface CompanyResponse {
  id: number;
  name: string;
  description: string;
  logo?: string;
  website?: string;
  employeeRange?: string;
  followerCount: number;
  address?: string;
  jobCount: number;
  reviewStats?: CompanyReviewStatsResponse;
  categories: CompanyCategoryResponse[];
}

export interface CompanyDashboardResponse {
  id: number;
  name: string;
  logo?: string;
  description: string;
  jobCount: number;
  categories: CompanyCategoryResponse[];
}

export interface CompanyCategoryResponse {
  id: number;
  name: string;
  description?: string;
}

export interface CompanyReviewStatsResponse {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: { [key: string]: number };
  recommendationRate?: number;
}

export interface CompanySearchRequest {
  keyword?: string;
  location?: string;
  categoryIds?: number[];
  employeeRange?: string;
  status?: string;
  sortBy?: string;
  sortDirection?: string;
}

export interface PageResponse<T> {
  data: T[];
  pageSize: number;
  totalPages: number;
  totalElements: number;
}

// Company API service
export const companyApi = {
  // GET /api/v1/companies/search
  searchCompanies: async (params: CompanySearchRequest & { page?: number; size?: number }): Promise<ApiResponse<PageResponse<CompanyDashboardResponse>>> => {
    const response = await apiClient.get('/companies/search', { params });
    return response.data;
  },

  // POST /api/v1/companies
  createCompany: async (data: CompanyCreationRequest): Promise<ApiResponse<CompanyResponse>> => {
    const response = await apiClient.post('/companies', data);
    return response.data;
  },

  // GET /api/v1/companies
  getAllCompanies: async (page: number = 1, size: number = 10): Promise<ApiResponse<PageResponse<CompanyDashboardResponse>>> => {
    const response = await apiClient.get('/companies', {
      params: { page, size }
    });
    return response.data;
  },

  // GET /api/v1/companies/{id}
  getCompanyById: async (id: number): Promise<ApiResponse<CompanyResponse>> => {
    const response = await apiClient.get(`/companies/${id}`);
    return response.data;
  },

  // PUT /api/v1/companies/{id}
  updateCompany: async (id: number, data: CompanyUpdateRequest): Promise<ApiResponse<CompanyResponse>> => {
    const response = await apiClient.put(`/companies/${id}`, data);
    return response.data;
  },

  // DELETE /api/v1/companies/{id}
  deleteCompany: async (id: number): Promise<ApiResponse<string>> => {
    const response = await apiClient.delete(`/companies/${id}`);
    return response.data;
  },

  // POST /api/v1/companies/{id}/activate
  activateCompany: async (id: number): Promise<ApiResponse<string>> => {
    const response = await apiClient.post(`/companies/${id}/activate`);
    return response.data;
  },

  // POST /api/v1/companies/{id}/deactivate
  deactivateCompany: async (id: number): Promise<ApiResponse<string>> => {
    const response = await apiClient.post(`/companies/${id}/deactivate`);
    return response.data;
  },

  // POST /api/v1/companies/{id}/follow
  followCompany: async (id: number): Promise<ApiResponse<string>> => {
    const response = await apiClient.post(`/companies/${id}/follow`);
    return response.data;
  },

  // DELETE /api/v1/companies/{id}/follow
  unfollowCompany: async (id: number): Promise<ApiResponse<string>> => {
    const response = await apiClient.delete(`/companies/${id}/follow`);
    return response.data;
  },

  // GET /api/v1/companies/{id}/follow-status
  getFollowStatus: async (id: number): Promise<ApiResponse<boolean>> => {
    const response = await apiClient.get(`/companies/${id}/follow-status`);
    return response.data;
  },

  // GET /api/v1/companies/my-company
  getMyCompany: async (): Promise<ApiResponse<CompanyResponse>> => {
    const response = await apiClient.get('/companies/my-company');
    return response.data;
  },

  // POST /api/v1/companies/{id}/upload-logo
  uploadLogo: async (companyId: number, file: File): Promise<ApiResponse<FileUploadResponse>> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post(`/companies/${companyId}/upload-logo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Company Review APIs
  // GET /api/v1/companies/{companyId}/reviews
  getCompanyReviews: async (companyId: number, page: number = 1, size: number = 10): Promise<ApiResponse<PageResponse<CompanyReviewResponse>>> => {
    const response = await apiClient.get(`/companies/${companyId}/reviews`, {
      params: { page, size }
    });
    return response.data;
  },

  // POST /api/v1/companies/{companyId}/reviews
  addCompanyReview: async (companyId: number, data: { rateStar: number; reviewText: string }): Promise<ApiResponse<CompanyReviewResponse>> => {
    const response = await apiClient.post(`/companies/${companyId}/reviews`, data);
    return response.data;
  },

  // PUT /api/v1/companies/{companyId}/reviews
  updateCompanyReview: async (companyId: number, data: { rateStar: number; reviewText: string }): Promise<ApiResponse<CompanyReviewResponse>> => {
    const response = await apiClient.put(`/companies/${companyId}/reviews`, data);
    return response.data;
  },

  // DELETE /api/v1/companies/{companyId}/reviews/{userId}
  deleteCompanyReview: async (companyId: number, userId: string): Promise<ApiResponse<string>> => {
    const response = await apiClient.delete(`/companies/${companyId}/reviews/${userId}`);
    return response.data;
  },

  // GET /api/v1/companies/{companyId}/reviews/user
  getUserReviewForCompany: async (companyId: number): Promise<ApiResponse<CompanyReviewResponse>> => {
    const response = await apiClient.get(`/companies/${companyId}/reviews/user`);
    return response.data;
  }
}; 
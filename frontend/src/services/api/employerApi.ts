import apiClient from './config';
import { ApiResponse } from './authApi';
import { UserResponse } from './userApi';
import { CompanyResponse } from './companyApi';

// Types dựa trên backend DTOs
export interface EmployerRegistrationRequest {
  email: string;
  password: string;
  fullname: string;
}

export interface RegistrationResponse {
  keyRedisToken: string;
  email: string;
}

// Job Post types để lấy company info
export interface JobPostResponse {
  id: number;
  title: string;
  description: string;
  requirements: string;
  benefits: string;
  salary: string;
  location: string;
  deadline: string;
  status: string;
  experienceLevel: string;
  jobType: JobTypeResponse;
  jobLevel: JobLevelResponse;
  skills: SkillResponse[];
  company: CompanyResponse;
  createdAt: string;
  updatedAt: string;
}

export interface JobTypeResponse {
  id: number;
  name: string;
  description?: string;
}

export interface JobLevelResponse {
  id: number;
  name: string;
  description?: string;
}

export interface SkillResponse {
  id: number;
  name: string;
  description?: string;
}

export interface PageResponse<T> {
  data: T[];
  pageSize: number;
  totalPages: number;
  totalElements: number;
}

// Employer API service
export const employerApi = {
  // POST /api/v1/employers/register
  register: async (data: EmployerRegistrationRequest): Promise<ApiResponse<RegistrationResponse>> => {
    const response = await apiClient.post('/employers/register', data);
    return response.data;
  },

  // GET /api/v1/users/my-info (Employer cũng dùng endpoint này)
  getMyInfo: async (): Promise<ApiResponse<UserResponse>> => {
    const response = await apiClient.get('/users/my-info');
    return response.data;
  },

  // Lấy company info thông qua job posts (workaround vì không có /my-company endpoint)
  // GET /api/v1/job-posts/my-posts
  getMyJobPosts: async (page: number = 1, size: number = 1): Promise<ApiResponse<PageResponse<JobPostResponse>>> => {
    const response = await apiClient.get('/job-posts/my-posts', {
      params: { page, size }
    });
    return response.data;
  },

  // Helper method để lấy company info của employer hiện tại
  getMyCompany: async (): Promise<CompanyResponse | null> => {
    try {
      const jobPostsResponse = await employerApi.getMyJobPosts(1, 1);
      
      if (jobPostsResponse.result.data.length > 0) {
        return jobPostsResponse.result.data[0].company;
      }
      
      return null; // Employer chưa có company hoặc chưa post job nào
    } catch (error) {
      console.error('Error getting employer company:', error);
      return null;
    }
  },
}; 
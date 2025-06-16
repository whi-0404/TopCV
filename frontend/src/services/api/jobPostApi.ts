import apiClient from './config';
import { ApiResponse } from './authApi';
import { CompanyResponse, CompanyDashboardResponse } from './companyApi';

export type JobPostStatus = 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'SUSPENDED' | 'PENDING' | 'APPROVED' | 'REJECTED';

// Types dựa trên backend DTOs
export interface JobPostCreationRequest {
  title: string;                    // @NotBlank
  description: string;              // @NotBlank 
  requirements: string;             // @NotBlank
  benefits: string;                 // @NotBlank
  location: string;                 // @NotBlank
  workingTime: string;              // @NotBlank
  salary: string;                   // @NotBlank
  experienceRequired: string;       // @NotBlank
  deadline: string;                 // @NotNull @Future yyyy-mm-dd
  hiringQuota: number;              // @NotNull @Min(1)
  jobTypeId: number;                // @NotNull
  jobLevelId: number;               // @NotNull
  skillIds?: number[];              // Optional
}

export interface JobPostUpdateRequest {
  title?: string;
  description?: string;
  requirements?: string;
  benefits?: string;
  location?: string;
  workingTime?: string;
  salary?: string;
  experienceRequired?: string;
  deadline?: string; // yyyy-mm-dd
  hiringQuota?: number;
  jobTypeId?: number;
  jobLevelId?: number;
  skillIds?: number[];
}

export interface JobPostResponse {
  id: number;
  title: string;
  location: string;
  salary: string;
  experienceRequired: string;
  deadline: string;
  appliedCount: number;
  hiringQuota: number;
  status: JobPostStatus;
  createdAt: string;
  updatedAt: string;
  
  // Company info
  company: CompanyDashboardResponse;
  
  // Job classification
  jobType: JobTypeResponse;
  jobLevel: JobLevelResponse;
  skills: SkillResponse[];
  
  // Additional flags for user context
  isFavorite: boolean;
  canApply: boolean;
}

export interface JobPostDashboardResponse {
  id: number;
  title: string;
  salary?: string | null;
  location: string;
  deadline?: string | null;
  status?: string;
  experienceLevel?: string;
  type: JobTypeResponse;
  level: JobLevelResponse;
  companyName: string;
  logo?: string | null;
  appliedCount: number;
  createdAt?: string;
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

export interface JobPostSearchRequest {
  keyword?: string;
  location?: string;
  jobTypeIds?: number[];
  jobLevelIds?: number[];
  skillIds?: number[];
  companyId?: number;
  experienceLevel?: string;
  salaryRange?: string;
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

// Job Post API service
export const jobPostApi = {
  // GET /api/v1/job-posts/search
  searchJobPosts: async (params: JobPostSearchRequest & { page?: number; size?: number }): Promise<ApiResponse<PageResponse<JobPostDashboardResponse>>> => {
    const response = await apiClient.get('/job-posts/search', { params });
    return response.data;
  },

  // GET /api/v1/job-posts/trending
  getTrendingJobPosts: async (page: number = 1, size: number = 10): Promise<ApiResponse<PageResponse<JobPostDashboardResponse>>> => {
    const response = await apiClient.get('/job-posts/trending', {
      params: { page, size }
    });
    return response.data;
  },

  // GET /api/v1/job-posts/company/{companyId}
  getJobPostsByCompany: async (companyId: number, page: number = 1, size: number = 10): Promise<ApiResponse<PageResponse<JobPostDashboardResponse>>> => {
    const response = await apiClient.get(`/job-posts/company/${companyId}`, {
      params: { page, size }
    });
    return response.data;
  },

  // POST /api/v1/job-posts
  createJobPost: async (data: JobPostCreationRequest): Promise<ApiResponse<JobPostResponse>> => {
    const response = await apiClient.post('/job-posts', data);
    return response.data;
  },

  // PUT /api/v1/job-posts/{jobId}
  updateJobPost: async (jobId: number, data: JobPostUpdateRequest): Promise<ApiResponse<JobPostResponse>> => {
    const response = await apiClient.put(`/job-posts/${jobId}`, data);
    return response.data;
  },

  // DELETE /api/v1/job-posts/{jobId}
  deleteJobPost: async (jobId: number): Promise<ApiResponse<string>> => {
    const response = await apiClient.delete(`/job-posts/${jobId}`);
    return response.data;
  },

  // GET /api/v1/job-posts/my-posts
  getMyJobPosts: async (page: number = 1, size: number = 10): Promise<ApiResponse<PageResponse<JobPostResponse>>> => {
    const response = await apiClient.get('/job-posts/my-posts', {
      params: { page, size }
    });
    return response.data;
  },

  // GET /api/v1/job-posts/{jobId}
  getJobPostDetail: async (jobId: number): Promise<ApiResponse<JobPostResponse>> => {
    const response = await apiClient.get(`/job-posts/${jobId}`);
    return response.data;
  },

  // PATCH /api/v1/job-posts/{jobId}/close
  closeJobPost: async (jobId: number): Promise<ApiResponse<string>> => {
    const response = await apiClient.patch(`/job-posts/${jobId}/close`);
    return response.data;
  },

  // PATCH /api/v1/job-posts/{jobId}/reopen
  reopenJobPost: async (jobId: number): Promise<ApiResponse<string>> => {
    const response = await apiClient.patch(`/job-posts/${jobId}/reopen`);
    return response.data;
  },

  // PATCH /api/v1/job-posts/admin/{jobId}/approve
  approveJobPost: async (jobId: number): Promise<ApiResponse<string>> => {
    const response = await apiClient.patch(`/job-posts/admin/${jobId}/approve`);
    return response.data;
  },

  // PATCH /api/v1/job-posts/admin/{jobId}/reject
  rejectJobPost: async (jobId: number): Promise<ApiResponse<string>> => {
    const response = await apiClient.patch(`/job-posts/admin/${jobId}/reject`);
    return response.data;
  },

  // PATCH /api/v1/job-posts/admin/{jobId}/suspend
  suspendJobPost: async (jobId: number): Promise<ApiResponse<string>> => {
    const response = await apiClient.patch(`/job-posts/admin/${jobId}/suspend`);
    return response.data;
  },

  // POST /api/v1/job-posts/{jobId}/favorite
  favoriteJob: async (jobId: number): Promise<ApiResponse<string>> => {
    const response = await apiClient.post(`/job-posts/${jobId}/favorite`);
    return response.data;
  },

  // DELETE /api/v1/job-posts/{jobId}/favorite
  unfavoriteJob: async (jobId: number): Promise<ApiResponse<string>> => {
    const response = await apiClient.delete(`/job-posts/${jobId}/favorite`);
    return response.data;
  },

  // GET /api/v1/job-posts/{jobId}/isFavorite
  isFavoriteJob: async (jobId: number): Promise<ApiResponse<boolean>> => {
    const response = await apiClient.get(`/job-posts/${jobId}/isFavorite`);
    return response.data;
  },
}; 
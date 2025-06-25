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
  description?: string;
  requirements?: string;
  benefits?: string;
  location: string;
  workingTime?: string;
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
  deadline?: string | null; // LocalDate from backend will be serialized as string
  status?: JobPostStatus;
  experienceLevel?: string;
  type: JobTypeResponse;
  level: JobLevelResponse;
  companyName: string;
  logo?: string | null;
  appliedCount: number;
  createdAt?: string; // LocalDateTime from backend will be serialized as string
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
    try {
      // Check if we have complex filters that need URLSearchParams
      const hasComplexFilters = params.jobTypeIds?.length || params.jobLevelIds?.length || params.skillIds?.length;
      
      // If we have complex filters, use URLSearchParams approach
      if (hasComplexFilters) {
        const searchParams = new URLSearchParams();
        
        // Add simple parameters
        if (params.keyword) searchParams.append('keyword', params.keyword);
        if (params.location) searchParams.append('location', params.location);
        if (params.experienceLevel) searchParams.append('experienceLevel', params.experienceLevel);
        if (params.status) searchParams.append('status', params.status);
        if (params.companyId) searchParams.append('companyId', params.companyId.toString());
        
        // Always add sorting and pagination
        searchParams.append('sortBy', params.sortBy || 'createdAt');
        searchParams.append('sortDirection', params.sortDirection || 'desc');
        searchParams.append('page', (params.page || 1).toString());
        searchParams.append('size', (params.size || 10).toString());
        
        // Add array parameters - Spring Boot expects jobTypeIds=1&jobTypeIds=2 format
        if (params.jobTypeIds && params.jobTypeIds.length > 0) {
          params.jobTypeIds.forEach(id => searchParams.append('jobTypeIds', id.toString()));
        }
        if (params.jobLevelIds && params.jobLevelIds.length > 0) {
          params.jobLevelIds.forEach(id => searchParams.append('jobLevelIds', id.toString()));
        }
        if (params.skillIds && params.skillIds.length > 0) {
          params.skillIds.forEach(id => searchParams.append('skillIds', id.toString()));
        }
        
        const url = `/job-posts/search?${searchParams.toString()}`;
        const response = await apiClient.get(url);
        return response.data;
      } else {
        // For simple requests, use params object approach
        const response = await apiClient.get('/job-posts/search', {
          params: {
            keyword: params.keyword || undefined,
            location: params.location || undefined,
            status: params.status || undefined,
            experienceLevel: params.experienceLevel || undefined,
            companyId: params.companyId || undefined,
            page: params.page || 1,
            size: params.size || 10,
            sortBy: params.sortBy || 'createdAt',
            sortDirection: params.sortDirection || 'desc'
          }
        });
        return response.data;
      }
    } catch (error) {
      throw error;
    }
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
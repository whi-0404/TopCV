import apiClient from './config';
import { ApiResponse } from './authApi';

// Job Type Types
export interface JobTypeRequest {
  name: string;
  description?: string;
}

export interface JobTypeResponse {
  id: number;
  name: string;
  description?: string;
}

// Job Level Types  
export interface JobLevelRequest {
  name: string;
  description?: string;
}

export interface JobLevelResponse {
  id: number;
  name: string;
  description?: string;
}

// Skill Types
export interface SkillRequest {
  name: string;
  description?: string;
}

export interface SkillResponse {
  id: number;
  name: string;
  description?: string;
}

// Company Category Types
export interface CompanyCategoryRequest {
  name: string;
  description?: string;
}

export interface CompanyCategoryResponse {
  id: number;
  name: string;
  description?: string;
}

// Job Type API service
export const jobTypeApi = {
  // POST /api/v1/job-types
  createJobType: async (data: JobTypeRequest): Promise<ApiResponse<JobTypeResponse>> => {
    const response = await apiClient.post('/job-types', data);
    return response.data;
  },

  // GET /api/v1/job-types
  getAllJobTypes: async (): Promise<ApiResponse<JobTypeResponse[]>> => {
    const response = await apiClient.get('/job-types');
    return response.data;
  },

  // GET /api/v1/job-types/{id}
  getJobTypeById: async (id: number): Promise<ApiResponse<JobTypeResponse>> => {
    const response = await apiClient.get(`/job-types/${id}`);
    return response.data;
  },

  // PUT /api/v1/job-types/{id}
  updateJobType: async (id: number, data: JobTypeRequest): Promise<ApiResponse<JobTypeResponse>> => {
    const response = await apiClient.put(`/job-types/${id}`, data);
    return response.data;
  },

  // DELETE /api/v1/job-types/{id}
  deleteJobType: async (id: number): Promise<ApiResponse<string>> => {
    const response = await apiClient.delete(`/job-types/${id}`);
    return response.data;
  }
};

// Job Level API service
export const jobLevelApi = {
  // POST /api/v1/job-levels
  createJobLevel: async (data: JobLevelRequest): Promise<ApiResponse<JobLevelResponse>> => {
    const response = await apiClient.post('/job-levels', data);
    return response.data;
  },

  // GET /api/v1/job-levels
  getAllJobLevels: async (): Promise<ApiResponse<JobLevelResponse[]>> => {
    const response = await apiClient.get('/job-levels');
    return response.data;
  },

  // GET /api/v1/job-levels/{id}
  getJobLevelById: async (id: number): Promise<ApiResponse<JobLevelResponse>> => {
    const response = await apiClient.get(`/job-levels/${id}`);
    return response.data;
  },

  // PUT /api/v1/job-levels/{id}
  updateJobLevel: async (id: number, data: JobLevelRequest): Promise<ApiResponse<JobLevelResponse>> => {
    const response = await apiClient.put(`/job-levels/${id}`, data);
    return response.data;
  },

  // DELETE /api/v1/job-levels/{id}
  deleteJobLevel: async (id: number): Promise<ApiResponse<string>> => {
    const response = await apiClient.delete(`/job-levels/${id}`);
    return response.data;
  }
};

// Skills API service (giả sử có endpoint tương tự)
export const skillApi = {
  // GET /api/v1/skills
  getAllSkills: async (): Promise<ApiResponse<SkillResponse[]>> => {
    const response = await apiClient.get('/skills');
    return response.data;
  },

  // GET /api/v1/skills/{id}
  getSkillById: async (id: number): Promise<ApiResponse<SkillResponse>> => {
    const response = await apiClient.get(`/skills/${id}`);
    return response.data;
  },

  // POST /api/v1/skills
  createSkill: async (data: SkillRequest): Promise<ApiResponse<SkillResponse>> => {
    const response = await apiClient.post('/skills', data);
    return response.data;
  },

  // PUT /api/v1/skills/{id}
  updateSkill: async (id: number, data: SkillRequest): Promise<ApiResponse<SkillResponse>> => {
    const response = await apiClient.put(`/skills/${id}`, data);
    return response.data;
  },

  // DELETE /api/v1/skills/{id}
  deleteSkill: async (id: number): Promise<ApiResponse<string>> => {
    const response = await apiClient.delete(`/skills/${id}`);
    return response.data;
  }
};

// Company Category API service
export const companyCategoryApi = {
  // GET /api/v1/company-categories
  getAllCompanyCategories: async (): Promise<ApiResponse<CompanyCategoryResponse[]>> => {
    const response = await apiClient.get('/company-categories');
    return response.data;
  },

  // GET /api/v1/company-categories/{id}
  getCompanyCategoryById: async (id: number): Promise<ApiResponse<CompanyCategoryResponse>> => {
    const response = await apiClient.get(`/company-categories/${id}`);
    return response.data;
  },

  // POST /api/v1/company-categories
  createCompanyCategory: async (data: CompanyCategoryRequest): Promise<ApiResponse<CompanyCategoryResponse>> => {
    const response = await apiClient.post('/company-categories', data);
    return response.data;
  },

  // PUT /api/v1/company-categories/{id}
  updateCompanyCategory: async (id: number, data: CompanyCategoryRequest): Promise<ApiResponse<CompanyCategoryResponse>> => {
    const response = await apiClient.put(`/company-categories/${id}`, data);
    return response.data;
  },

  // DELETE /api/v1/company-categories/{id}
  deleteCompanyCategory: async (id: number): Promise<ApiResponse<string>> => {
    const response = await apiClient.delete(`/company-categories/${id}`);
    return response.data;
  }
}; 
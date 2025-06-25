import apiClient from './config';
import { ApiResponse } from './authApi';

// Types dựa trên backend DTOs
export interface ApplicationRequest {
  jobId: number;
  resumeId: number;
  coverLetter?: string;
}

export interface ApplicationStatusUpdateRequest {
  status: string;
  applicationIds?: number[];
}

export interface ApplicationResponse {
  id: number;
  createdAt: string; // LocalDateTime format
  status: ApplicationStatus;
  jobPost: JobPostDashboardResponse;
  user?: UserDashboardResponse; // For employer view
  coverLetter?: string;
  resume?: ResumeResponse; // CV information
  screeningResult?: CVScreeningInfo;
}

export interface ResumeResponse {
  resumeId: number;
  userId: string;
  filePath: string;
  originalFileName: string;
  createdAt: string;
  updatedAt: string;
  downloadUrl?: string;
}

export interface CVScreeningInfo {
  candidateDecision: string; // PASS, FAIL, REVIEW
  overallScore: number; // 0-5
  matchingPoints: string[];
  notMatchingPoints: string[];
  recommendation: string;
  screenedAt: string;
  aiAnalysis?: string;
  scoreLevel: string; // EXCELLENT, GOOD, AVERAGE, POOR
  decisionColor: string; // GREEN, YELLOW, RED
  isRecommended: boolean;
}

export interface JobPostDashboardResponse {
  id: number;
  title: string;
  salary?: string;
  location: string;
  deadline?: string;
  status?: string;
  experienceLevel?: string;
  type: JobTypeResponse;
  level: JobLevelResponse;
  companyName: string;
  logo?: string;
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

export interface UserDashboardResponse {
  id: string;
  userName?: string;
  email: string;
  fullname: string;
  phone?: string;
  address?: string;
  avt?: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
  dob?: string;
  role?: string;
}

export type ApplicationStatus = 
  | 'PENDING'     // Chờ Employer review
  | 'REVIEWING'   // Employer đã xem
  | 'SHORTLISTED' // Pass CV
  | 'INTERVIEWED' // PV xong
  | 'HIRED'       // Được tuyển
  | 'REJECTED'    // Chưa phù hợp
  | 'WITHDRAWN';  // Rút đơn

export interface PageResponse<T> {
  data: T[];
  pageSize: number;
  totalPages: number;
  totalElements: number;
}

// Application API service
export const applicationApi = {
  // POST /api/v1/applications/apply
  applyForJob: async (data: ApplicationRequest): Promise<ApiResponse<ApplicationResponse>> => {
    const response = await apiClient.post('/applications/apply', data);
    return response.data;
  },

  // POST /api/v1/applications/apply/{jobId}/{resumeId}
  applyForJobWithResume: async (jobId: number, resumeId: number): Promise<ApiResponse<ApplicationResponse>> => {
    const response = await apiClient.post(`/applications/apply/${jobId}/${resumeId}`);
    return response.data;
  },

  // DELETE /api/v1/applications/{applicationId}/withdraw
  withdrawApplication: async (applicationId: number): Promise<ApiResponse<string>> => {
    const response = await apiClient.delete(`/applications/${applicationId}/withdraw`);
    return response.data;
  },

  // GET /api/v1/applications/my
  getMyApplications: async (page: number = 1, size: number = 10): Promise<ApiResponse<PageResponse<ApplicationResponse>>> => {
    const response = await apiClient.get('/applications/my', {
      params: { page, size }
    });
    return response.data;
  },

  // GET /api/v1/applications/job/{jobId} - For employers
  getJobApplications: async (jobId: number, page: number = 1, size: number = 10): Promise<ApiResponse<PageResponse<ApplicationResponse>>> => {
    const response = await apiClient.get(`/applications/job/${jobId}`, {
      params: { page, size }
    });
    return response.data;
  },

  // GET /api/v1/applications/employer/all - For employers
  getAllApplicationsForEmployer: async (page: number = 1, size: number = 10): Promise<ApiResponse<PageResponse<ApplicationResponse>>> => {
    const response = await apiClient.get('/applications/employer/all', {
      params: { page, size }
    });
    return response.data;
  },

  // GET /api/v1/applications/{applicationId} - Get application details
  getApplicationById: async (applicationId: number): Promise<ApiResponse<ApplicationResponse>> => {
    const response = await apiClient.get(`/applications/${applicationId}`);
    return response.data;
  },

  // PUT /api/v1/applications/{applicationId}/status - For employers
  updateApplicationStatus: async (applicationId: number, data: ApplicationStatusUpdateRequest): Promise<ApiResponse<string>> => {
    const response = await apiClient.put(`/applications/${applicationId}/status`, data);
    return response.data;
  },

  // PUT /api/v1/applications/bulk-status - For employers
  bulkUpdateApplicationStatus: async (data: ApplicationStatusUpdateRequest): Promise<ApiResponse<string>> => {
    const response = await apiClient.put('/applications/bulk-status', data);
    return response.data;
  },

  // GET /api/v1/applications/search
  searchApplications: async (keyword: string, page: number = 1, size: number = 10): Promise<ApiResponse<PageResponse<ApplicationResponse>>> => {
    const response = await apiClient.get('/applications/search', {
      params: { keyword, page, size }
    });
    return response.data;
  },
};

// Helper functions
export const getStatusText = (status: ApplicationStatus): string => {
  const statusMap: Record<ApplicationStatus, string> = {
    PENDING: 'Chờ xét duyệt',
    REVIEWING: 'Đang xem xét',
    SHORTLISTED: 'Đã qua CV',
    INTERVIEWED: 'Đã phỏng vấn',
    HIRED: 'Được tuyển',
    REJECTED: 'Không phù hợp',
    WITHDRAWN: 'Đã rút đơn'
  };
  return statusMap[status] || status;
};

export const getStatusColor = (status: ApplicationStatus): string => {
  const colorMap: Record<ApplicationStatus, string> = {
    PENDING: 'text-yellow-600 bg-yellow-50',
    REVIEWING: 'text-blue-600 bg-blue-50',
    SHORTLISTED: 'text-green-600 bg-green-50',
    INTERVIEWED: 'text-purple-600 bg-purple-50',
    HIRED: 'text-emerald-600 bg-emerald-50',
    REJECTED: 'text-red-600 bg-red-50',
    WITHDRAWN: 'text-gray-600 bg-gray-50'
  };
  return colorMap[status] || 'text-gray-600 bg-gray-50';
};

export const canWithdrawApplication = (status: ApplicationStatus): boolean => {
  return status === 'PENDING' || status === 'REVIEWING';
}; 
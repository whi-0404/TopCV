// Export all API services
export { authApi } from './authApi';
export { userApi } from './userApi';
export { employerApi } from './employerApi';
export { companyApi } from './companyApi';
export { jobPostApi } from './jobPostApi';
export { jobTypeApi, jobLevelApi, skillApi } from './jobTypeLevelApi';
export { applicationApi, getStatusText, getStatusColor, canWithdrawApplication } from './applicationApi';
export { resumeApi, formatFileSize, isValidResumeFile, getFileIcon } from './resumeApi';

// Export types từ các API modules
export type { LoginRequest, LoginResponse, ApiResponse } from './authApi';
export type { 
  UserRegistrationRequest, 
  UserResponse, 
  UserUpdateRequest,
  VerifyOtpRequest,
  ChangePasswordRequest,
  PageResponse as UserPageResponse
} from './userApi';
export type { 
  EmployerRegistrationRequest, 
  JobPostResponse,
  JobTypeResponse,
  JobLevelResponse,
  SkillResponse,
  PageResponse as EmployerPageResponse
} from './employerApi';
export type { 
  CompanyCreationRequest,
  CompanyUpdateRequest,
  CompanyResponse,
  CompanyDashboardResponse,
  CompanyCategoryResponse,
  CompanyReviewStatsResponse,
  CompanySearchRequest,
  PageResponse as CompanyPageResponse
} from './companyApi';
export type {
  JobPostCreationRequest,
  JobPostUpdateRequest,
  JobPostDashboardResponse,
  JobPostSearchRequest,
  PageResponse as JobPostPageResponse
} from './jobPostApi';
export type {
  JobTypeRequest,
  JobLevelRequest,
  SkillRequest
} from './jobTypeLevelApi'; 
export type {
  ApplicationRequest,
  ApplicationResponse,
  ApplicationStatus,
  ApplicationStatusUpdateRequest,
  CVScreeningInfo,
  JobPostDashboardResponse as ApplicationJobPostResponse,
  UserDashboardResponse as ApplicationUserResponse,
  PageResponse as ApplicationPageResponse
} from './applicationApi';
export type {
  ResumeResponse,
  FileUploadResponse
} from './resumeApi'; 
export * from './aiRecommendationApi'; 
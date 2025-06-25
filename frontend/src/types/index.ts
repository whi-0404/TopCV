// Định nghĩa các types cho ứng dụng tìm kiếm việc làm IT

export interface User {
  id: string;
  userName?: string;
  email: string;
  fullname: string;
  phone?: string;
  address?: string;
  avt?: string;
  role: 'USER' | 'EMPLOYER' | 'ADMIN';
  isActive: boolean;
  isEmailVerified: boolean;
  dob?: string;
  createdAt: string;
  updatedAt: string;
}

// Backend DTOs Types
export interface ApiResponse<T> {
  code: number;
  message?: string;
  result: T;
}

export interface PageResponse<T> {
  data: T[];
  pageSize: number;
  totalPages: number;
  totalElements: number;
}

// Company Types - phù hợp với backend DTOs
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

// Job Post Types - phù hợp với backend DTOs
export interface JobPostResponse {
  id: number;
  title: string;
  location: string;
  salary: string;
  experienceRequired: string;
  deadline: string; // LocalDate format
  appliedCount: number;
  hiringQuota: number;
  status: JobPostStatus;
  createdAt: string; // LocalDateTime format
  updatedAt: string; // LocalDateTime format
  
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

export type JobPostStatus = 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'SUSPENDED' | 'PENDING' | 'APPROVED' | 'REJECTED';

// Legacy Types (for compatibility)
export interface Company {
  id: string;
  name: string;
  description: string;
  logo: string;
  website: string;
  employeeRange: string;
  address: string;
  categoryIds: number[];
  categories?: CategoryCompany[];
  employerId: string;
  employer?: User;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryCompany {
  id: number;
  name: string;
}

export interface JobPost {
  id: string;
  title: string;
  description: string;
  requirements: string;
  benefits: string;
  workingTime: string;
  salary: string;
  experienceRequired: string;
  deadline: string;
  hiringQuota: number;
  jobTypeId: string;
  jobLevelId: string;
  skillIds: string[];
  companyId: string;
  company?: Company;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JobType {
  id: string;
  name: string;
}

export interface JobLevel {
  id: string;
  name: string;
}

export interface Skill {
  id: string;
  name: string;
}

export interface JobApplication {
  id: string;
  userId: string;
  jobPostId: string;
  coverLetter: string;
  resumeUrl: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  appliedAt: string;
  user?: User;
  jobPost?: JobPost;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  summary: string;
  thumbnail: string;
  authorId: string;
  author?: User;
  categoryId: string;
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<string | null>;
  logout: () => Promise<void>;
  loading: boolean;
  // OTP functions
  sendOTP: (email: string, purpose: 'register' | 'forgot-password') => Promise<void>;
  verifyOTP: (email: string, otp: string, purpose: 'register' | 'forgot-password', token?: string) => Promise<boolean>;
  resetPassword: (email: string, newPassword: string, otp: string) => Promise<void>;
}

export interface RegisterData {
  email: string;
  password: string;
  fullname: string;
  role?: 'USER' | 'EMPLOYER';
}

export interface LoginData {
  email: string;
  password: string;
} 
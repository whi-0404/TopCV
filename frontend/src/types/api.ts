// API Response Types
export interface ApiResponse<T> {
  code?: number;
  message?: string;
  result?: T;
}

export interface PageResponse<T> {
  Data: T[];
  totalPages: number;
  pageSize: number;
  totalElements: number;
}

// Common Types
export interface BaseEntity {
  id: number;
  createdAt?: string;
  updatedAt?: string;
}

// User Types
export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  role: string;
  isEmailVerified: boolean;
  isActive: boolean;
}

// Company Types
export interface Company extends BaseEntity {
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  employeeRange?: string;
  address?: string;
  isActive: boolean;
  followerCount?: number;
  jobCount?: number;
}

// Job Types
export interface JobPost extends BaseEntity {
  title: string;
  description?: string;
  requirements?: string;
  benefits?: string;
  location?: string;
  workingTime?: string;
  salary?: string;
  experienceRequired?: string;
  deadline?: string;
  appliedCount?: number;
  hiringQuota?: number;
  status?: string;
  company: Company;
  jobType?: JobType;
  jobLevel?: JobLevel;
  skills?: Skill[];
  isFavorite?: boolean;
  canApply?: boolean;
}

export interface JobType extends BaseEntity {
  name: string;
}

export interface JobLevel extends BaseEntity {
  name: string;
}

export interface Skill extends BaseEntity {
  name: string;
}

// Search and Filter Types
export interface SearchParams {
  keyword?: string;
  location?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface JobSearchParams extends SearchParams {
  jobTypes?: string[];
  experienceLevel?: string;
  salaryRange?: string;
  companySize?: string;
}

export interface CompanySearchParams extends SearchParams {
  employeeRange?: string;
  categories?: string[];
}

// Error Types
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
} 
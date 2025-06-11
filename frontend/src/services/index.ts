// Service Index
// Central export file for all services

// === CORE SERVICES ===
export { default as authService } from './authService';
export { default as userService } from './userService';
export { default as jobService } from './jobService';
export { default as companyService } from './companyService';

// === JOB TYPES & INTERFACES ===
export type {
  JobType,
  JobLevel,
  Skill,
  JobPost,
  JobPostDashboard,
  JobSearchRequest,
  JobPostCreationRequest,
  JobPostUpdateRequest,
  JobTypeRequest,
  JobLevelRequest,
  SkillRequest
} from './jobService';

// === COMPANY TYPES & INTERFACES ===
export type {
  CompanyCategory,
  CompanyProfile,
  CompanyCreationRequest,
  CompanyUpdateRequest
} from './companyService';

// === SHARED TYPES ===
export type {
  ApiResponse,
  PageResponse
} from '../types/api';

// === API CONSTANTS ===
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/TopCV';

// === COMMON UTILITIES ===
export const apiUtils = {
  // Format file URL with proper base path
  formatFileUrl: (filePath?: string, type: 'company-logo' | 'user-avatar' | 'resume' = 'company-logo'): string => {
    if (!filePath) {
      switch (type) {
        case 'company-logo':
          return '/images/default-company-logo.png';
        case 'user-avatar':
          return '/images/default-avatar.png';
        case 'resume':
          return '';
        default:
          return '';
      }
    }
    
    if (filePath.startsWith('http')) return filePath;
    return `${API_BASE_URL}/uploads/${type}s/${filePath}`;
  },

  // Format currency
  formatCurrency: (amount?: number | string): string => {
    if (!amount) return 'Thỏa thuận';
    
    if (typeof amount === 'string') {
      return amount;
    }
    
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  },

  // Format date
  formatDate: (dateString?: string): string => {
    if (!dateString) return 'Chưa cập nhật';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Ngày không hợp lệ';
    }
  },

  // Format relative time
  formatRelativeTime: (dateString?: string): string => {
    if (!dateString) return 'Chưa cập nhật';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return '1 ngày trước';
      if (diffDays < 7) return `${diffDays} ngày trước`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
      return `${Math.floor(diffDays / 30)} tháng trước`;
    } catch {
      return 'Chưa cập nhật';
    }
  },

  // Generate query string from object
  buildQueryString: (params: Record<string, any>): string => {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(item => queryParams.append(key, item.toString()));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });
    
    return queryParams.toString();
  },

  // Parse error message from API response
  parseErrorMessage: (error: any): string => {
    if (typeof error === 'string') return error;
    
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    
    if (error?.message) {
      return error.message;
    }
    
    return 'Đã có lỗi xảy ra. Vui lòng thử lại.';
  },

  // Validate email format
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate phone number (Vietnamese format)
  isValidPhone: (phone: string): boolean => {
    const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  },

  // Format phone number
  formatPhone: (phone?: string): string => {
    if (!phone) return '';
    
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 10 && cleaned.startsWith('0')) {
      return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
    }
    
    return phone;
  },

  // Truncate text with ellipsis
  truncateText: (text?: string, maxLength: number = 100): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  },

  // Get status color class
  getStatusColor: (status: string, type: 'job' | 'company' | 'user' = 'job'): string => {
    const statusLower = status?.toLowerCase();
    
    switch (type) {
      case 'job':
        switch (statusLower) {
          case 'active':
          case 'approved':
            return 'bg-green-100 text-green-800';
          case 'pending':
            return 'bg-yellow-100 text-yellow-800';
          case 'closed':
            return 'bg-gray-100 text-gray-800';
          case 'rejected':
          case 'suspended':
            return 'bg-red-100 text-red-800';
          default:
            return 'bg-gray-100 text-gray-800';
        }
      
      case 'company':
        switch (statusLower) {
          case 'active':
          case 'verified':
            return 'bg-green-100 text-green-800';
          case 'pending':
            return 'bg-yellow-100 text-yellow-800';
          case 'inactive':
          case 'suspended':
            return 'bg-red-100 text-red-800';
          default:
            return 'bg-gray-100 text-gray-800';
        }
      
      case 'user':
        switch (statusLower) {
          case 'active':
          case 'verified':
            return 'bg-green-100 text-green-800';
          case 'pending':
            return 'bg-yellow-100 text-yellow-800';
          case 'inactive':
          case 'banned':
            return 'bg-red-100 text-red-800';
          default:
            return 'bg-gray-100 text-gray-800';
        }
      
      default:
        return 'bg-gray-100 text-gray-800';
    }
  },

  // Format status text
  formatStatus: (status: string, type: 'job' | 'company' | 'user' = 'job'): string => {
    const statusLower = status?.toLowerCase();
    
    switch (type) {
      case 'job':
        switch (statusLower) {
          case 'active':
            return 'Đang tuyển';
          case 'pending':
            return 'Chờ duyệt';
          case 'approved':
            return 'Đã duyệt';
          case 'closed':
            return 'Đã đóng';
          case 'rejected':
            return 'Bị từ chối';
          case 'suspended':
            return 'Bị tạm dừng';
          default:
            return 'Không xác định';
        }
      
      case 'company':
        switch (statusLower) {
          case 'active':
            return 'Hoạt động';
          case 'pending':
            return 'Chờ duyệt';
          case 'verified':
            return 'Đã xác minh';
          case 'inactive':
            return 'Không hoạt động';
          case 'suspended':
            return 'Bị tạm dừng';
          default:
            return 'Không xác định';
        }
      
      case 'user':
        switch (statusLower) {
          case 'active':
            return 'Hoạt động';
          case 'pending':
            return 'Chờ xác minh';
          case 'verified':
            return 'Đã xác minh';
          case 'inactive':
            return 'Không hoạt động';
          case 'banned':
            return 'Bị cấm';
          default:
            return 'Không xác định';
        }
      
      default:
        return status || 'Không xác định';
    }
  }
};

// === CONSTANTS ===
export const CONSTANTS = {
  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  
  // File upload
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  
  // Validation
  MIN_PASSWORD_LENGTH: 8,
  MAX_TEXT_LENGTH: 1000,
  MAX_DESCRIPTION_LENGTH: 5000,
  
  // UI
  TOAST_DURATION: 5000,
  LOADING_DELAY: 500,
  
  // Local Storage Keys
  STORAGE_KEYS: {
    ACCESS_TOKEN: 'access_token',
    USER_TYPE: 'user_type',
    THEME: 'theme',
    LANGUAGE: 'language'
  },
  
  // Job/Company filters
  EMPLOYEE_RANGES: [
    { value: '1-10', label: '1-10 nhân viên' },
    { value: '11-50', label: '11-50 nhân viên' },
    { value: '51-100', label: '51-100 nhân viên' },
    { value: '101-500', label: '101-500 nhân viên' },
    { value: '501-1000', label: '501-1000 nhân viên' },
    { value: '1000+', label: '1000+ nhân viên' }
  ],
  
  EXPERIENCE_LEVELS: [
    { value: 'entry', label: 'Mới tốt nghiệp' },
    { value: 'junior', label: '1-2 năm kinh nghiệm' },
    { value: 'mid', label: '3-5 năm kinh nghiệm' },
    { value: 'senior', label: '5+ năm kinh nghiệm' },
    { value: 'lead', label: 'Trưởng nhóm' },
    { value: 'manager', label: 'Quản lý' }
  ],
  
  SALARY_RANGES: [
    { value: '0-10', label: 'Dưới 10 triệu' },
    { value: '10-15', label: '10-15 triệu' },
    { value: '15-20', label: '15-20 triệu' },
    { value: '20-30', label: '20-30 triệu' },
    { value: '30-50', label: '30-50 triệu' },
    { value: '50+', label: 'Trên 50 triệu' }
  ]
};

// === ERROR HANDLING ===
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// === HOOKS UTILITIES (for React components) ===
export const hookUtils = {
  // Debounce function for search inputs
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },
  
  // Throttle function for scroll events
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}; 
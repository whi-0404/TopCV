/**
 * Company Service
 * Service để xử lý các API liên quan đến company profile và management
 * 
 * BACKEND ENDPOINTS (CompanyController):
 * ✅ POST /api/v1/companies - Tạo company mới
 * ✅ GET /api/v1/companies - Lấy danh sách companies (public, có pagination)
 * ✅ GET /api/v1/companies/{id} - Lấy company theo ID (public)
 * ✅ PUT /api/v1/companies/{id} - Cập nhật company (chỉ owner)
 * ✅ DELETE /api/v1/companies/{id} - Xóa company
 * ✅ POST /api/v1/companies/{id}/activate - Kích hoạt company (admin)
 * ✅ POST /api/v1/companies/{id}/deactivate - Vô hiệu hóa company (admin)
 * ✅ POST /api/v1/companies/{id}/follow - Follow company
 * ✅ DELETE /api/v1/companies/{id}/follow - Unfollow company
 * ✅ GET /api/v1/companies/{id}/follow-status - Kiểm tra follow status
 * 
 * NOTE: Backend KHÔNG có endpoint /employers/my-company
 * Employer cần sử dụng /companies để quản lý company của mình
 */

import { PageResponse, ApiResponse } from '../types/api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/TopCV';

// Company Types
export interface CompanyCategory {
  id: number;
  name: string;
}

export interface CompanyProfile {
  id: number;
  name: string;
  logo?: string;
  description?: string;
  jobCount?: number;
  categories?: CompanyCategory[];
  // Fields from backend CompanyResponse
  website?: string;
  employeeRange?: string;
  address?: string;
  followerCount?: number;
  reviewStats?: {
    averageRating: number;
    totalReviews: number;
  };
}

export interface CompanyCreationRequest {
  name: string;
  description?: string;
  website?: string;
  address?: string;
  employeeRange?: string;
  categoryIds?: number[];
}

export interface CompanyUpdateRequest {
  name: string;
  description?: string;
  website?: string;
  address?: string;
  employeeRange?: string;
  categoryIds?: number[];
}

// === NEW INTERFACES FOR COMPANY REVIEWS ===

export interface CompanyReview {
  userId: string;
  fullName: string;
  reviewText: string;
  rateStar: number;
  reviewDate: string;
}

export interface CompanyReviewRequest {
  companyId?: number;
  rateStar: number;
  reviewText: string;
}

export interface CompanyCategoryRequest {
  name: string;
}

// API Helper Functions
const apiCall = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch(`${API_BASE_URL}/api/v1${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error(`API Error ${response.status}:`, errorData);
    
    if (response.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_type');
      throw new Error('UNAUTHORIZED');
    }
    
    const errorMessage = errorData.message || `API call failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return response.json();
};

const publicApiCall = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const response = await fetch(`${API_BASE_URL}/api/v1${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error(`Public API Error ${response.status}:`, errorData);
    
    const errorMessage = errorData.message || `Public API call failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return response.json();
};

class CompanyService {
  // === HELPER METHODS ===
  
  // Generate logo URL
  getLogoUrl(logoPath?: string): string {
    if (!logoPath) {
      return '/images/default-company-logo.png';
    }
    
    if (logoPath.startsWith('http://') || logoPath.startsWith('https://')) {
      return logoPath;
    }
    
    return `${API_BASE_URL}/files/${logoPath}`;
  }

  // Format categories as string
  getCategoriesString(categories?: CompanyCategory[]): string {
    if (!categories || categories.length === 0) {
      return 'Chưa phân loại';
    }
    return categories.map(cat => cat.name).join(', ');
  }

  // Format employee range for display
  formatEmployeeRange(employeeRange?: string | number): string {
    if (!employeeRange) return 'Chưa cập nhật';
    
    if (typeof employeeRange === 'number') {
      if (employeeRange <= 10) return '1-10 nhân viên';
      if (employeeRange <= 50) return '11-50 nhân viên';
      if (employeeRange <= 100) return '51-100 nhân viên';
      if (employeeRange <= 500) return '101-500 nhân viên';
      if (employeeRange <= 1000) return '501-1000 nhân viên';
      return '1000+ nhân viên';
    }
    
    // Handle string format
    const range = employeeRange.toString();
    
    // If it's already formatted, return as is
    if (range.includes('nhân viên') || range.includes('employees')) {
      return range;
    }
    
    // Try to parse number ranges
    if (range.includes('-')) {
      const [min, max] = range.split('-').map(n => parseInt(n.trim()));
      if (!isNaN(min) && !isNaN(max)) {
        return `${min}-${max} nhân viên`;
      }
    }
    
    // Try to parse single number
    const num = parseInt(range);
    if (!isNaN(num)) {
      if (num <= 10) return '1-10 nhân viên';
      if (num <= 50) return '11-50 nhân viên';
      if (num <= 100) return '51-100 nhân viên';
      if (num <= 500) return '101-500 nhân viên';
      if (num <= 1000) return '501-1000 nhân viên';
      return '1000+ nhân viên';
    }
    
    return range;
  }

  // Format website URL
  formatWebsiteUrl(website?: string): string {
    if (!website) return '';
    if (website.startsWith('http://') || website.startsWith('https://')) {
      return website;
    }
    return `https://${website}`;
  }

  // Format follower count for display
  formatFollowerCount(count?: number): string {
    if (!count || count === 0) return '0';
    if (count < 1000) return count.toString();
    if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
    return `${(count / 1000000).toFixed(1)}M`;
  }

  // Get employee range options for forms
  getEmployeeRangeOptions(): Array<{ value: string; label: string }> {
    return [
      { value: '1-10', label: '1-10 nhân viên' },
      { value: '11-50', label: '11-50 nhân viên' },
      { value: '51-100', label: '51-100 nhân viên' },
      { value: '101-500', label: '101-500 nhân viên' },
      { value: '501-1000', label: '501-1000 nhân viên' },
      { value: '1000+', label: '1000+ nhân viên' }
    ];
  }

  // === COMPANY CATEGORIES ===
  
  async getCompanyCategories(): Promise<CompanyCategory[]> {
    try {
      // TODO: Backend cần implement endpoint này
      console.warn('Backend chưa có endpoint /company-categories');
      
      // Mock data tạm thời
      return [
        { id: 1, name: 'Công nghệ thông tin' },
        { id: 2, name: 'Tài chính - Ngân hàng' },
        { id: 3, name: 'Y tế - Sức khỏe' },
        { id: 4, name: 'Giáo dục - Đào tạo' },
        { id: 5, name: 'Bán lẻ - Thương mại' },
        { id: 6, name: 'Sản xuất - Chế tạo' },
        { id: 7, name: 'Du lịch - Khách sạn' },
        { id: 8, name: 'Bất động sản' },
        { id: 9, name: 'Marketing - Quảng cáo' },
        { id: 10, name: 'Khác' }
      ];
    } catch (error) {
      console.error('Error fetching company categories:', error);
      return [];
    }
  }

  // === PUBLIC COMPANY APIs ===

  // Get all companies (public with pagination)
  async getCompanies(page = 1, size = 10): Promise<PageResponse<CompanyProfile>> {
    try {
      console.log(`Getting companies page ${page}, size ${size}...`);
      
      // Call real backend API
      const response = await publicApiCall<any>(`/companies?page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      console.log('Companies response:', response);
      
      if (!response.result) {
        return {
          Data: [],
          totalPages: 0,
          pageSize: size,
          totalElements: 0
        };
      }
      
      // Backend trả về PageResponse<CompanyDashboardResponse>
      const companiesData = response.result.Data || response.result.data || [];
      
      // Transform backend data to frontend format
      const transformedCompanies: CompanyProfile[] = companiesData.map((company: any) => ({
        id: company.id,
        name: company.name || company.companyName,
        logo: company.logo,
        description: company.description,
        jobCount: company.jobCount || 0,
        categories: company.categories || [],
        website: company.website,
        employeeRange: company.employeeRange,
        address: company.address,
        followerCount: company.followerCount || 0,
        reviewStats: company.reviewStats || { averageRating: 0, totalReviews: 0 }
      }));
      
      return {
        Data: transformedCompanies,
        totalPages: response.result.totalPages || 0,
        pageSize: response.result.pageSize || size,
        totalElements: response.result.totalElements || 0
      };
      
    } catch (error: any) {
      console.error('Error getting companies:', error);
      
      // Return empty result instead of throwing to prevent UI crashes
      return {
        Data: [],
        totalPages: 0,
        pageSize: size,
        totalElements: 0
      };
    }
  }

  // Get company by ID (public)
  async getCompanyById(companyId: number): Promise<CompanyProfile> {
    const response = await publicApiCall<CompanyProfile>(`/companies/${companyId}`);
    return response.result!;
  }

  // === COMPANY MANAGEMENT (Authenticated) ===

  // Get my company profile (employer)
  async getMyCompany(): Promise<CompanyProfile | null> {
    try {
      console.log('Getting my company from /employers/my-company');
      
      const response = await apiCall<CompanyProfile>('/employers/my-company');
      
      console.log('getMyCompany response:', response);
      return response.result!;
      
    } catch (error: any) {
      console.error('Error getting company profile:', error);
      
      // If company doesn't exist, return null instead of throwing
      if (error.message?.includes('Company not exists') || 
          error.message?.includes('COMPANY_NOT_EXISTED')) {
        console.log('Company does not exist for current employer');
        return null;
      }
      
      // Handle other errors
      if (error.message?.includes('UNAUTHORIZED') || error.message?.includes('403')) {
        console.error('User does not have permission to access company profile');
      }
      
      throw error;
    }
  }

  // Update my company (employer)  
  async updateMyCompany(companyData: CompanyUpdateRequest): Promise<CompanyProfile> {
    try {
      console.log('Updating my company with data:', companyData);
      
      const response = await apiCall<CompanyProfile>('/employers/my-company', {
        method: 'PUT',
        body: JSON.stringify(companyData),
      });
      
      console.log('Update my company response:', response);
      return response.result!;
    } catch (error: any) {
      console.error('Error updating company:', error);
      
      // Xử lý các lỗi cụ thể
      if (error.message?.includes('COMPANY_NAME_EXISTED')) {
        throw new Error('Tên công ty đã tồn tại. Vui lòng chọn tên khác.');
      } else if (error.message?.includes('COMPANY_NOT_EXISTED')) {
        throw new Error('Không tìm thấy thông tin công ty. Vui lòng tạo mới công ty.');
      } else if (error.message?.includes('UNAUTHORIZED') || error.message?.includes('403')) {
        throw new Error('Bạn không có quyền cập nhật thông tin công ty này.');
      }
      
      throw error;
    }
  }

  // Create company (employer)
  async createCompany(companyData: CompanyCreationRequest): Promise<CompanyProfile> {
    try {
      const response = await apiCall<CompanyProfile>('/companies', {
        method: 'POST',
        body: JSON.stringify(companyData),
      });

      console.log('Create company response:', response);
      return response.result!;
    } catch (error: any) {
      console.error('Error creating company:', error);
      
      if (error.message?.includes('COMPANY_NAME_EXISTED')) {
        throw new Error('Tên công ty đã tồn tại. Vui lòng chọn tên khác.');
      }
      
      throw error;
    }
  }

  // === ADMIN COMPANY MANAGEMENT ===

  // Delete company (admin)
  async deleteCompany(companyId: number): Promise<void> {
    await apiCall<string>(`/companies/${companyId}`, {
      method: 'DELETE',
    });
  }

  // Activate company (admin)
  async activateCompany(companyId: number): Promise<void> {
    await apiCall<string>(`/companies/${companyId}/activate`, {
      method: 'POST',
    });
  }

  // Deactivate company (admin)
  async deactivateCompany(companyId: number): Promise<void> {
    await apiCall<string>(`/companies/${companyId}/deactivate`, {
      method: 'POST',
    });
  }

  // === COMPANY FOLLOWING ===

  // Follow company (user)
  async followCompany(companyId: number): Promise<void> {
    await apiCall<string>(`/companies/${companyId}/follow`, {
      method: 'POST',
    });
  }

  // Unfollow company (user)
  async unfollowCompany(companyId: number): Promise<void> {
    await apiCall<string>(`/companies/${companyId}/follow`, {
      method: 'DELETE',
    });
  }

  // Check follow status (user)
  async checkFollowStatus(companyId: number): Promise<boolean> {
    const response = await apiCall<boolean>(`/companies/${companyId}/follow-status`);
    return response.result || false;
  }

  // Get followed companies (user)
  // TODO: Backend cần implement endpoint này
  async getFollowedCompanies(page = 1, size = 10): Promise<PageResponse<CompanyProfile>> {
    console.warn('Backend chưa có endpoint /users/followed-companies');
    
    // Return empty result tạm thời
    return {
      Data: [],
      totalPages: 0,
      pageSize: size,
      totalElements: 0
    };
  }

  // === SEARCH COMPANIES ===

  // Search companies by keyword
  async searchCompanies(keyword: string, page = 1, size = 10): Promise<PageResponse<CompanyProfile>> {
    try {
      console.log(`Searching companies with keyword: ${keyword}`);
      
      // TODO: Backend cần implement endpoint search
      // Tạm thời sử dụng getCompanies và filter ở frontend
      const allCompanies = await this.getCompanies(page, size);
      
      if (!keyword.trim()) {
        return allCompanies;
      }
      
      const filteredCompanies = allCompanies.Data.filter(company =>
        company.name.toLowerCase().includes(keyword.toLowerCase()) ||
        company.description?.toLowerCase().includes(keyword.toLowerCase())
      );
      
      return {
        ...allCompanies,
        Data: filteredCompanies,
        totalElements: filteredCompanies.length
      };
      
    } catch (error) {
      console.error('Error searching companies:', error);
      return {
        Data: [],
        totalPages: 0,
        pageSize: size,
        totalElements: 0
      };
    }
  }

  // === COMPANY STATISTICS ===

  // Get company statistics for employer dashboard
  async getCompanyStats(companyId?: number): Promise<{
    totalJobs: number;
    activeJobs: number;
    totalApplications: number;
    totalFollowers: number;
  }> {
    try {
      if (!companyId) {
        console.warn('Không có company ID để lấy stats');
        return {
          totalJobs: 0,
          activeJobs: 0,
          totalApplications: 0,
          totalFollowers: 0
        };
      }
      
      const company = await this.getCompanyById(companyId);
      
      return {
        totalJobs: company.jobCount || 0,
        activeJobs: company.jobCount || 0, // Backend chưa phân biệt active vs total
        totalApplications: 0, // Cần backend endpoint
        totalFollowers: company.followerCount || 0
      };
    } catch (error) {
      console.error('Failed to fetch company stats:', error);
      return {
        totalJobs: 0,
        activeJobs: 0,
        totalApplications: 0,
        totalFollowers: 0
      };
    }
  }
}

// Export singleton instance
const companyService = new CompanyService();
export default companyService; 
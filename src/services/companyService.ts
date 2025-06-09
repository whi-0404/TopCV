// Company Service
// Service để xử lý các API liên quan đến company profile và management

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/TopCV/api/v1';

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
  website?: string;
  employeeRange?: string;
  address?: string;
  categories?: CompanyCategory[];
  jobCount?: number;
  followerCount?: number;
  reviewStats?: {
    averageRating: number;
    totalReviews: number;
  };
}

export interface CompanySearchRequest {
  keyword?: string;
  location?: string;
  employeeRange?: string;
  categoryIds?: number[];
  sortBy?: string;
  sortDirection?: string;
}

export interface CompanyCreationRequest {
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  employeeRange?: string;
  address?: string;
  categoryIds?: number[];
}

export interface CompanyUpdateRequest {
  name?: string;
  description?: string;
  logo?: string;
  website?: string;
  employeeRange?: string;
  address?: string;
  categoryIds?: number[];
}

export interface ApiResponse<T> {
  code?: number;
  message?: string;
  result?: T;
}

export interface PageResponse<T> {
  Data: T[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

// Helper function để gọi API với authentication và auto-refresh token
const apiCall = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  // Import authService dynamically để tránh circular import
  const { authService } = await import('./authService');
  
  // Function để thực hiện API call
  const makeRequest = async (token: string | null): Promise<Response> => {
    return fetch(`${API_BASE_URL}${url}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    });
  };

  try {
    // Get valid token (with auto-refresh if needed)
    const token = await authService.getValidToken();
    
    const response = await makeRequest(token);
    
    // If we get 401, try to refresh token and retry once
    if (response.status === 401) {
      console.log('Token expired, attempting refresh...');
      const newToken = await authService.refreshToken();
      
      if (newToken) {
        console.log('Token refreshed successfully, retrying request...');
        const retryResponse = await makeRequest(newToken);
        
        if (!retryResponse.ok) {
          throw new Error(`HTTP error! status: ${retryResponse.status}`);
        }
        
        const data = await retryResponse.json();
        return data;
      } else {
        // Refresh failed, redirect to appropriate login
        console.log('Token refresh failed, redirecting to login...');
        const userType = localStorage.getItem('user_type');
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_type');
        
        if (userType === 'employer') {
          window.location.href = '/auth/company/login';
        } else {
          window.location.href = '/auth/jobseeker/login';
        }
        throw new Error('Authentication failed. Please login again.');
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Company API call error:', error);
    throw error;
  }
};

// Helper function for public API calls (no auth required) with fallback
const publicApiCall = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    // If backend is not available or returns server errors, don't throw immediately
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.warn(`API call failed: ${response.status} - ${url}`, errorData);
      
      // For specific errors, we'll let the calling service handle fallbacks
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Public Company API call error:', error);
    throw error;
  }
};

// Company Service Class
class CompanyService {
  // === PUBLIC ENDPOINTS (No Auth Required) ===
  
  // Get all companies (public listing)
  async getCompanies(
    searchParams: CompanySearchRequest = {},
    page = 1,
    size = 10
  ): Promise<PageResponse<CompanyProfile>> {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination
      queryParams.append('page', page.toString());
      queryParams.append('size', size.toString());
      
      // Add search parameters
      if (searchParams.keyword) queryParams.append('keyword', searchParams.keyword);
      if (searchParams.location) queryParams.append('location', searchParams.location);
      if (searchParams.employeeRange) queryParams.append('employeeRange', searchParams.employeeRange);
      if (searchParams.sortBy) queryParams.append('sortBy', searchParams.sortBy);
      if (searchParams.sortDirection) queryParams.append('sortDirection', searchParams.sortDirection);
      
      // Add array parameters
      if (searchParams.categoryIds?.length) {
        searchParams.categoryIds.forEach(id => queryParams.append('categoryIds', id.toString()));
      }

      const response = await publicApiCall<PageResponse<CompanyProfile>>(`/companies/search?${queryParams.toString()}`, {
        method: 'GET',
      });

      return response.result || {
        Data: [],
        pageNo: page,
        pageSize: size,
        totalElements: 0,
        totalPages: 0,
        first: true,
        last: true
      };
    } catch (error) {
      console.warn('API unavailable, using mock data for companies');
      
      // Fallback to mock data when API is not available
      const mockCompanies: CompanyProfile[] = [
        {
          id: 1,
          name: 'Công ty TNHH Công nghệ ABC',
          logo: '/images/company1.png',
          description: 'Công ty chuyên về phát triển phần mềm và giải pháp công nghệ.',
          website: 'https://abc-tech.com',
          employeeRange: '51_200',
          address: 'Hà Nội, Việt Nam',
          categories: [{ id: 1, name: 'Công nghệ thông tin' }],
          jobCount: 15,
          followerCount: 1250,
          reviewStats: { averageRating: 4.2, totalReviews: 28 }
        },
        {
          id: 2,
          name: 'Tập đoàn XYZ',
          logo: '/images/company2.png',
          description: 'Tập đoàn đa ngành với nhiều lĩnh vực kinh doanh.',
          website: 'https://xyz-group.com',
          employeeRange: 'OVER_1000',
          address: 'TP.HCM, Việt Nam',
          categories: [{ id: 2, name: 'Tài chính' }],
          jobCount: 45,
          followerCount: 3200,
          reviewStats: { averageRating: 4.5, totalReviews: 156 }
        },
        {
          id: 3,
          name: 'Startup Innovation Hub',
          logo: '/images/company3.png',
          description: 'Startup công nghệ chuyên về AI và Machine Learning.',
          website: 'https://innovation-hub.com',
          employeeRange: 'UNDER_10',
          address: 'Đà Nẵng, Việt Nam',
          categories: [{ id: 1, name: 'Công nghệ thông tin' }],
          jobCount: 8,
          followerCount: 680,
          reviewStats: { averageRating: 4.8, totalReviews: 12 }
        }
      ];

      // Filter mock data based on search params
      let filteredCompanies = mockCompanies;
      
      if (searchParams.keyword) {
        const keyword = searchParams.keyword.toLowerCase();
        filteredCompanies = filteredCompanies.filter(company => 
          company.name.toLowerCase().includes(keyword) ||
          company.description?.toLowerCase().includes(keyword)
        );
      }

      // Pagination for mock data
      const startIndex = (page - 1) * size;
      const endIndex = startIndex + size;
      const paginatedData = filteredCompanies.slice(startIndex, endIndex);

      return {
        Data: paginatedData,
        pageNo: page,
        pageSize: size,
        totalElements: filteredCompanies.length,
        totalPages: Math.ceil(filteredCompanies.length / size),
        first: page === 1,
        last: page >= Math.ceil(filteredCompanies.length / size)
      };
    }
  }

  // Get company by ID (public)
  async getCompanyById(companyId: number): Promise<CompanyProfile> {
    try {
      const response = await publicApiCall<CompanyProfile>(`/companies/${companyId}`, {
        method: 'GET',
      });
      return response.result!;
    } catch (error) {
      console.warn('API unavailable, using mock data for company detail');
      
      // Fallback mock data
      return {
        id: companyId,
        name: 'Công ty TNHH Công nghệ ABC',
        logo: '/images/company1.png',
        description: 'Công ty chuyên về phát triển phần mềm và giải pháp công nghệ. Chúng tôi có đội ngũ chuyên gia giàu kinh nghiệm và luôn sẵn sàng đón nhận những thách thức mới.',
        website: 'https://abc-tech.com',
        employeeRange: '51_200',
        address: 'Tầng 15, Tòa nhà ABC Tower, 123 Đường Láng, Đống Đa, Hà Nội',
        categories: [{ id: 1, name: 'Công nghệ thông tin' }],
        jobCount: 15,
        followerCount: 1250,
        reviewStats: { averageRating: 4.2, totalReviews: 28 }
      };
    }
  }

  // Get company categories (public)
  async getCompanyCategories(): Promise<CompanyCategory[]> {
    try {
      const response = await publicApiCall<CompanyCategory[]>('/company-categories', {
        method: 'GET',
      });
      return response.result || [];
    } catch (error) {
      console.warn('API unavailable, using mock data for company categories');
      
      // Fallback to mock categories
      return [
        { id: 1, name: 'Công nghệ thông tin' },
        { id: 2, name: 'Tài chính/Ngân hàng' },
        { id: 3, name: 'Sản xuất' },
        { id: 4, name: 'Dịch vụ' },
        { id: 5, name: 'Giáo dục' },
        { id: 6, name: 'Y tế' },
        { id: 7, name: 'Bán lẻ' },
        { id: 8, name: 'Xây dựng' }
      ];
    }
  }

  // === AUTHENTICATED ENDPOINTS ===
  
  // Get my company profile (for authenticated company users)
  async getMyCompany(): Promise<CompanyProfile> {
    const response = await apiCall<CompanyProfile>('/companies/my-company', {
      method: 'GET',
    });

    return response.result!;
  }

  // Update my company profile
  async updateMyCompany(companyData: CompanyUpdateRequest): Promise<CompanyProfile> {
    const response = await apiCall<CompanyProfile>('/companies/my-company', {
      method: 'PUT',
      body: JSON.stringify(companyData),
    });

    return response.result!;
  }

  // Create company profile (during registration)
  async createCompany(companyData: CompanyCreationRequest): Promise<CompanyProfile> {
    const response = await apiCall<CompanyProfile>('/companies', {
      method: 'POST',
      body: JSON.stringify(companyData),
    });

    return response.result!;
  }

  // === UTILITY METHODS ===

  // Get logo URL
  getLogoUrl(logo?: string): string {
    if (!logo) return '/images/default-company-logo.png';
    if (logo.startsWith('http')) return logo;
    return `${API_BASE_URL}/files/${logo}`;
  }

  // Utility methods for formatting and display
  formatEmployeeRange(employeeRange?: string | number): string {
    if (!employeeRange) return 'Không xác định';
    
    // If it's already a formatted string, return it
    if (typeof employeeRange === 'string') {
      // Check if it's already a formatted range
      if (employeeRange.includes('nhân viên') || employeeRange.includes('UNDER_') || employeeRange.includes('OVER_')) {
        // Map backend enum values to display strings
        const rangeMap: { [key: string]: string } = {
          'UNDER_10': '1-10 nhân viên',
          '10_50': '10-50 nhân viên',
          '51_200': '51-200 nhân viên',
          '201_500': '201-500 nhân viên',
          '501_1000': '501-1000 nhân viên',
          'OVER_1000': '1000+ nhân viên'
        };
        
        return rangeMap[employeeRange] || employeeRange;
      }
      
      // Try to parse as number if it's a numeric string
      const num = parseInt(employeeRange);
      if (!isNaN(num)) {
        return this.formatEmployeeRange(num);
      }
      
      return employeeRange;
    }
    
    // Handle numeric values
    if (employeeRange < 10) return '1-10 nhân viên';
    if (employeeRange < 50) return '10-50 nhân viên';
    if (employeeRange < 200) return '51-200 nhân viên';
    if (employeeRange < 500) return '201-500 nhân viên';
    if (employeeRange < 1000) return '501-1000 nhân viên';
    return '1000+ nhân viên';
  }

  formatFollowerCount(count?: number): string {
    if (!count) return '0';
    
    if (count < 1000) return count.toString();
    if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
    return `${(count / 1000000).toFixed(1)}M`;
  }

  // Get categories string
  getCategoriesString(categories?: CompanyCategory[]): string {
    if (!categories || categories.length === 0) return 'Chưa phân loại';
    return categories.map(cat => cat.name).join(', ');
  }

  // Format website URL
  formatWebsiteUrl(website?: string): string {
    if (!website) return '';
    if (website.startsWith('http')) return website;
    return `https://${website}`;
  }

  // Get company stats for dashboard
  async getCompanyStats(): Promise<{
    totalJobs: number;
    activeJobs: number;
    totalApplications: number;
    totalFollowers: number;
  }> {
    try {
      const companyProfile = await this.getMyCompany();
      
      // For now, return basic stats from company profile
      // In a real implementation, these would come from separate endpoints
      return {
        totalJobs: companyProfile.jobCount || 0,
        activeJobs: Math.floor((companyProfile.jobCount || 0) * 0.7), // Assuming 70% are active
        totalApplications: 0, // Would need separate endpoint
        totalFollowers: companyProfile.followerCount || 0
      };
    } catch (error) {
      console.error('Failed to get company stats:', error);
      return {
        totalJobs: 0,
        activeJobs: 0,
        totalApplications: 0,
        totalFollowers: 0
      };
    }
  }

  // Helper methods for company size options
  getEmployeeRangeOptions(): Array<{ value: string; label: string }> {
    return [
      { value: 'UNDER_10', label: '1-10 nhân viên' },
      { value: '10_50', label: '10-50 nhân viên' },
      { value: '51_200', label: '51-200 nhân viên' },
      { value: '201_500', label: '201-500 nhân viên' },
      { value: '501_1000', label: '501-1000 nhân viên' },
      { value: 'OVER_1000', label: '1000+ nhân viên' }
    ];
  }

  // Calculate company rating (if available)
  getCompanyRating(reviewStats?: { averageRating: number; totalReviews: number }): number {
    return reviewStats?.averageRating || 0;
  }

  // Format company founded year
  formatFoundedYear(createdAt?: string): string {
    if (!createdAt) return 'Không xác định';
    
    try {
      const year = new Date(createdAt).getFullYear();
      return year.toString();
    } catch {
      return 'Không xác định';
    }
  }
}

// Export singleton instance
const companyService = new CompanyService();
export default companyService; 
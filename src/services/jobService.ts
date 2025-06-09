// Job Service
// Service để xử lý các API liên quan đến job posts

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/TopCV/api/v1';

// Job Types
export interface JobType {
  id: number;
  name: string;
}

export interface JobLevel {
  id: number;
  name: string;
}

export interface Skill {
  id: number;
  name: string;
}

export interface Company {
  id: number;
  name: string;
  logo?: string;
  description?: string;
  jobCount?: number;
  categories?: CompanyCategory[];
}

export interface CompanyCategory {
  id: number;
  name: string;
}

export interface JobPost {
  id: number;
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
  createdAt?: string;
  updatedAt?: string;
  company: Company;
  jobType?: JobType;
  jobLevel?: JobLevel;
  skills?: Skill[];
  isFavorite?: boolean;
  canApply?: boolean;
}

// Dashboard specific job interface
export interface JobPostDashboard {
  id: number;
  title: string;
  description?: string;
  location?: string;
  salary?: string;
  deadline?: string;
  appliedCount?: number;
  hiringQuota?: number;
  status?: string;
  createdAt?: string;
  company: Company;
  jobType?: JobType;
  skills?: Skill[];
}

export interface JobSearchRequest {
  keyword?: string;
  location?: string;
  jobTypeIds?: number[];
  jobLevelIds?: number[];
  skillIds?: number[];
  companyIds?: number[];
  salaryRange?: string;
  experienceLevel?: string;
  sortBy?: string;
  sortDirection?: string;
}

export interface JobPostCreationRequest {
  title: string;
  description?: string;
  requirements?: string;
  benefits?: string;
  location?: string;
  workingTime?: string;
  salary?: string;
  experienceRequired?: string;
  deadline: string;
  hiringQuota: number;
  jobTypeId: number;
  jobLevelId: number;
  skillIds?: number[];
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
  deadline?: string;
  hiringQuota?: number;
  jobTypeId?: number;
  jobLevelId?: number;
  skillIds?: number[];
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
        // Refresh failed, but for public endpoints, continue without auth
        console.log('Token refresh failed, trying without auth...');
        const publicResponse = await makeRequest(null);
        
        if (!publicResponse.ok) {
          throw new Error(`HTTP error! status: ${publicResponse.status}`);
        }
        
        const data = await publicResponse.json();
        return data;
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Job API call error:', error);
    throw error;
  }
};

// Helper function for public API calls (no auth required)
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

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Public API call error:', error);
    throw error;
  }
};

// Job Service Class
class JobService {
  // === PUBLIC ENDPOINTS (No Auth Required) ===
  
  // Get all job types
  async getJobTypes(): Promise<JobType[]> {
    try {
      const response = await publicApiCall<JobType[]>('/job-types', {
        method: 'GET',
      });
      return response.result || [];
    } catch (error) {
      console.warn('API unavailable, using mock data for job types');
      return [
        { id: 1, name: 'Full-time' },
        { id: 2, name: 'Part-time' },
        { id: 3, name: 'Contract' },
        { id: 4, name: 'Freelance' },
        { id: 5, name: 'Internship' }
      ];
    }
  }

  // Get all job levels
  async getJobLevels(): Promise<JobLevel[]> {
    try {
      const response = await publicApiCall<JobLevel[]>('/job-levels', {
        method: 'GET',
      });
      return response.result || [];
    } catch (error) {
      console.warn('API unavailable, using mock data for job levels');
      return [
        { id: 1, name: 'Intern' },
        { id: 2, name: 'Junior' },
        { id: 3, name: 'Mid-level' },
        { id: 4, name: 'Senior' },
        { id: 5, name: 'Lead' },
        { id: 6, name: 'Manager' }
      ];
    }
  }

  // Search and get jobs (public - visible to all users)
  async searchJobs(
    searchParams: JobSearchRequest = {},
    page = 1,
    size = 10
  ): Promise<PageResponse<JobPost>> {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination
      queryParams.append('page', page.toString());
      queryParams.append('size', size.toString());
      
      // Add search parameters
      if (searchParams.keyword) queryParams.append('keyword', searchParams.keyword);
      if (searchParams.location) queryParams.append('location', searchParams.location);
      if (searchParams.salaryRange) queryParams.append('salaryRange', searchParams.salaryRange);
      if (searchParams.experienceLevel) queryParams.append('experienceLevel', searchParams.experienceLevel);
      if (searchParams.sortBy) queryParams.append('sortBy', searchParams.sortBy);
      if (searchParams.sortDirection) queryParams.append('sortDirection', searchParams.sortDirection);
      
      // Add array parameters
      if (searchParams.jobTypeIds?.length) {
        searchParams.jobTypeIds.forEach(id => queryParams.append('jobTypeIds', id.toString()));
      }
      if (searchParams.jobLevelIds?.length) {
        searchParams.jobLevelIds.forEach(id => queryParams.append('jobLevelIds', id.toString()));
      }
      if (searchParams.skillIds?.length) {
        searchParams.skillIds.forEach(id => queryParams.append('skillIds', id.toString()));
      }
      if (searchParams.companyIds?.length) {
        searchParams.companyIds.forEach(id => queryParams.append('companyIds', id.toString()));
      }

      const response = await publicApiCall<PageResponse<JobPost>>(`/job-posts/search?${queryParams.toString()}`, {
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
      console.warn('API unavailable, using mock data for jobs');
      
      // Fallback to mock data
      const mockJobs: JobPost[] = [
        {
          id: 1,
          title: 'Senior Frontend Developer',
          description: 'Phát triển ứng dụng web với React.js và TypeScript',
          location: 'Hà Nội',
          salary: '20-30 triệu VND',
          deadline: '2024-02-15',
          appliedCount: 25,
          hiringQuota: 3,
          status: 'active',
          createdAt: '2024-01-15',
          company: {
            id: 1,
            name: 'Công ty TNHH Công nghệ ABC',
            logo: '/images/company1.png',
            jobCount: 15
          },
          jobType: { id: 1, name: 'Full-time' },
          jobLevel: { id: 2, name: 'Senior' },
          skills: [
            { id: 1, name: 'React.js' },
            { id: 2, name: 'TypeScript' },
            { id: 3, name: 'JavaScript' }
          ]
        },
        {
          id: 2,
          title: 'Backend Developer',
          description: 'Phát triển API và xử lý backend với Node.js',
          location: 'TP.HCM',
          salary: '15-25 triệu VND',
          deadline: '2024-02-20',
          appliedCount: 18,
          hiringQuota: 2,
          status: 'active',
          createdAt: '2024-01-10',
          company: {
            id: 2,
            name: 'Tập đoàn XYZ',
            logo: '/images/company2.png',
            jobCount: 45
          },
          jobType: { id: 1, name: 'Full-time' },
          jobLevel: { id: 1, name: 'Mid-level' },
          skills: [
            { id: 4, name: 'Node.js' },
            { id: 5, name: 'MongoDB' },
            { id: 6, name: 'Express.js' }
          ]
        }
      ];

      // Filter mock data
      let filteredJobs = mockJobs;
      
      if (searchParams.keyword) {
        const keyword = searchParams.keyword.toLowerCase();
        filteredJobs = filteredJobs.filter(job => 
          job.title.toLowerCase().includes(keyword) ||
          job.description?.toLowerCase().includes(keyword)
        );
      }

      if (searchParams.location) {
        filteredJobs = filteredJobs.filter(job => 
          job.location?.toLowerCase().includes(searchParams.location!.toLowerCase())
        );
      }

      // Pagination
      const startIndex = (page - 1) * size;
      const endIndex = startIndex + size;
      const paginatedData = filteredJobs.slice(startIndex, endIndex);

      return {
        Data: paginatedData,
        pageNo: page,
        pageSize: size,
        totalElements: filteredJobs.length,
        totalPages: Math.ceil(filteredJobs.length / size),
        first: page === 1,
        last: page >= Math.ceil(filteredJobs.length / size)
      };
    }
  }

  // Get job by ID (public)
  async getJobById(jobId: number): Promise<JobPost> {
    try {
      const response = await publicApiCall<JobPost>(`/job-posts/${jobId}`, {
        method: 'GET',
      });
      return response.result!;
    } catch (error) {
      console.warn('API unavailable, using mock data for job detail');
      
      // Fallback mock data
      return {
        id: jobId,
        title: 'Senior Frontend Developer',
        description: 'Chúng tôi đang tìm kiếm một Senior Frontend Developer có kinh nghiệm để gia nhập đội ngũ phát triển sản phẩm. Bạn sẽ làm việc với các công nghệ hiện đại như React.js, TypeScript và các framework CSS.',
        requirements: '• Ít nhất 3 năm kinh nghiệm với React.js\n• Thành thạo TypeScript và JavaScript\n• Kinh nghiệm với CSS preprocessors (SASS/LESS)\n• Hiểu biết về RESTful APIs',
        benefits: '• Lương cạnh tranh từ 20-30 triệu VND\n• Bảo hiểm sức khỏe toàn diện\n• Cơ hội đào tạo và phát triển\n• Môi trường làm việc hiện đại',
        location: 'Hà Nội',
        workingTime: 'Thứ 2 - Thứ 6, 8:30 - 17:30',
        salary: '20-30 triệu VND',
        experienceRequired: '3+ năm kinh nghiệm',
        deadline: '2024-02-15',
        appliedCount: 25,
        hiringQuota: 3,
        status: 'active',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15',
        company: {
          id: 1,
          name: 'Công ty TNHH Công nghệ ABC',
          logo: '/images/company1.png',
          description: 'Công ty chuyên về phát triển phần mềm và giải pháp công nghệ.',
          jobCount: 15
        },
        jobType: { id: 1, name: 'Full-time' },
        jobLevel: { id: 4, name: 'Senior' },
        skills: [
          { id: 1, name: 'React.js' },
          { id: 2, name: 'TypeScript' },
          { id: 3, name: 'JavaScript' },
          { id: 7, name: 'CSS' },
          { id: 8, name: 'HTML' }
        ],
        isFavorite: false,
        canApply: true
      };
    }
  }

  // Get jobs by company (public)
  async getJobsByCompany(
    companyId: number,
    page = 1,
    size = 10
  ): Promise<PageResponse<JobPost>> {
    try {
      const response = await publicApiCall<PageResponse<JobPost>>(`/job-posts/company/${companyId}?page=${page}&size=${size}`, {
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
      console.warn('API unavailable, using mock data for company jobs');
      
      // Mock jobs for the company
      const mockCompanyJobs: JobPost[] = [
        {
          id: 1,
          title: 'Senior Frontend Developer',
          description: 'Phát triển ứng dụng web với React.js',
          location: 'Hà Nội',
          salary: '20-30 triệu VND',
          deadline: '2024-02-15',
          appliedCount: 25,
          hiringQuota: 3,
          status: 'active',
          createdAt: '2024-01-15',
          company: {
            id: companyId,
            name: 'Công ty TNHH Công nghệ ABC',
            logo: '/images/company1.png'
          },
          jobType: { id: 1, name: 'Full-time' },
          jobLevel: { id: 4, name: 'Senior' },
          skills: [
            { id: 1, name: 'React.js' },
            { id: 2, name: 'TypeScript' }
          ]
        },
        {
          id: 2,
          title: 'Backend Developer',
          description: 'Phát triển API với Node.js',
          location: 'Hà Nội',
          salary: '18-25 triệu VND',
          deadline: '2024-02-20',
          appliedCount: 12,
          hiringQuota: 2,
          status: 'active',
          createdAt: '2024-01-12',
          company: {
            id: companyId,
            name: 'Công ty TNHH Công nghệ ABC',
            logo: '/images/company1.png'
          },
          jobType: { id: 1, name: 'Full-time' },
          jobLevel: { id: 3, name: 'Mid-level' },
          skills: [
            { id: 4, name: 'Node.js' },
            { id: 5, name: 'MongoDB' }
          ]
        }
      ];

      // Pagination
      const startIndex = (page - 1) * size;
      const endIndex = startIndex + size;
      const paginatedData = mockCompanyJobs.slice(startIndex, endIndex);

      return {
        Data: paginatedData,
        pageNo: page,
        pageSize: size,
        totalElements: mockCompanyJobs.length,
        totalPages: Math.ceil(mockCompanyJobs.length / size),
        first: page === 1,
        last: page >= Math.ceil(mockCompanyJobs.length / size)
      };
    }
  }

  // === AUTHENTICATED ENDPOINTS ===
  
  // Get my job posts (for company users)
  async getMyJobPosts(page = 1, size = 10): Promise<PageResponse<JobPost>> {
    const response = await apiCall<PageResponse<JobPost>>(`/job-posts/my-posts?page=${page}&size=${size}`, {
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
  }

  // Create job post (for company users)
  async createJobPost(jobData: JobPostCreationRequest): Promise<JobPost> {
    const response = await apiCall<JobPost>('/job-posts', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });

    return response.result!;
  }

  // Update job post
  async updateJobPost(jobId: number, jobData: JobPostUpdateRequest): Promise<JobPost> {
    const response = await apiCall<JobPost>(`/job-posts/${jobId}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    });

    return response.result!;
  }

  // Delete job post
  async deleteJobPost(jobId: number): Promise<void> {
    await apiCall<string>(`/job-posts/${jobId}`, {
      method: 'DELETE',
    });
  }

  // Close job post
  async closeJobPost(jobId: number): Promise<void> {
    await apiCall<string>(`/job-posts/${jobId}/close`, {
      method: 'PATCH',
    });
  }

  // Reopen job post
  async reopenJobPost(jobId: number): Promise<void> {
    await apiCall<string>(`/job-posts/${jobId}/reopen`, {
      method: 'PATCH',
    });
  }

  // Favorite/Unfavorite job (for user)
  async favoriteJob(jobId: number): Promise<void> {
    await apiCall<string>(`/job-posts/${jobId}/favorite`, {
      method: 'POST',
    });
  }

  async unfavoriteJob(jobId: number): Promise<void> {
    await apiCall<string>(`/job-posts/${jobId}/favorite`, {
      method: 'DELETE',
    });
  }

  // Check if job is favorite
  async isFavoriteJob(jobId: number): Promise<boolean> {
    const response = await apiCall<boolean>(`/job-posts/${jobId}/isFavorite`, {
      method: 'GET',
    });
    return response.result || false;
  }

  // Get user's favorite jobs
  async getFavoriteJobs(page = 1, size = 10): Promise<PageResponse<JobPost>> {
    const response = await apiCall<PageResponse<JobPost>>(`/users/job-posts-favorite?page=${page}&size=${size}`, {
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
  }

  // === UTILITY METHODS ===

  // Format date for display
  formatDate(dateString?: string): string {
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
  }

  // Format salary
  formatSalary(salary?: string): string {
    if (!salary) return 'Thỏa thuận';
    return salary;
  }

  // Get company logo URL
  getCompanyLogoUrl(logo?: string): string {
    if (!logo) return '/images/default-company-logo.png';
    if (logo.startsWith('http')) return logo;
    return `${API_BASE_URL}/files/${logo}`;
  }

  // Format experience level
  formatExperienceLevel(experience?: string): string {
    if (!experience) return 'Không yêu cầu';
    return experience;
  }

  // Method to get job status color class
  getJobStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'đang tuyển':
        return 'bg-green-100 text-green-800';
      case 'paused':
      case 'tạm dừng':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
      case 'đã đóng':
        return 'bg-red-100 text-red-800';
      case 'draft':
      case 'nháp':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  // Format job status
  formatJobStatus(status?: string): string {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'Đang tuyển';
      case 'closed':
        return 'Đã đóng';
      case 'draft':
        return 'Bản nháp';
      case 'suspended':
        return 'Tạm ngưng';
      default:
        return 'Không xác định';
    }
  }

  // Calculate applicant progress percentage
  formatApplicantProgress(appliedCount: number = 0, hiringQuota: number = 1): number {
    if (hiringQuota <= 0) return 0;
    return Math.min(Math.round((appliedCount / hiringQuota) * 100), 100);
  }
}

// Export singleton instance
const jobService = new JobService();
export default jobService; 
// Job Service
// Service để xử lý các API liên quan đến job posts

import api from './api';
import { PageResponse, ApiResponse } from '../types/api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/TopCV';

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
  createdAt: string;
  updatedAt?: string;
  
  // Relations - match with backend response
  company: Company;
  jobType?: JobType;
  jobLevel?: JobLevel;
  skills?: Skill[];
  
  // Additional frontend-only fields
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
  page?: number;
  size?: number;
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

// === NEW INTERFACES FOR ADDITIONAL ENDPOINTS ===

export interface JobTypeRequest {
  name: string;
}

export interface JobLevelRequest {
  name: string;
}

export interface SkillRequest {
  name: string;
}

export interface JobSearchParams {
  keyword?: string;
  location?: string;
  jobTypes?: string[];
  experienceLevel?: string;
  salaryRange?: string;
  companySize?: string;
  sortBy?: string;
  page?: number;
  size?: number;
}

// Helper function để gọi API với authentication và auto-refresh token
const apiCall = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  // Import authService dynamically để tránh circular import
  const { authService } = await import('./authService');
  
  // DEBUG: Log API call details
  console.log('🌐 API Call Starting:', {
    url: `${API_BASE_URL}${url}`,
    method: options.method || 'GET',
    headers: options.headers,
    body: options.body
  });
  
  // Function để thực hiện API call
  const makeRequest = async (token: string | null): Promise<Response> => {
    const fullUrl = `${API_BASE_URL}${url}`;
    const requestOptions = {
      credentials: 'include' as RequestCredentials,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };
    
    console.log('📡 Making request to:', fullUrl);
    console.log('📋 Request options:', requestOptions);
    
    return fetch(fullUrl, requestOptions);
  };

  try {
    // Get valid token (with auto-refresh if needed)
    const token = await authService.getValidToken();
    
    const response = await makeRequest(token);
    
    console.log('📥 Response received:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    // If we get 401, try to refresh token and retry once
    if (response.status === 401) {
      console.log('🔄 Token expired, attempting refresh...');
      const newToken = await authService.refreshToken();
      
      if (newToken) {
        console.log('✅ Token refreshed successfully, retrying request...');
        const retryResponse = await makeRequest(newToken);
        
        if (!retryResponse.ok) {
          console.error('❌ Retry request failed:', retryResponse.status, retryResponse.statusText);
          throw new Error(`HTTP error! status: ${retryResponse.status}`);
        }
        
        const data = await retryResponse.json();
        console.log('✅ Retry response data:', data);
        return data;
      } else {
        // Refresh failed, but for public endpoints, continue without auth
        console.log('⚠️ Token refresh failed, trying without auth...');
        const publicResponse = await makeRequest(null);
        
        if (!publicResponse.ok) {
          console.error('❌ Public request failed:', publicResponse.status, publicResponse.statusText);
          throw new Error(`HTTP error! status: ${publicResponse.status}`);
        }
        
        const data = await publicResponse.json();
        console.log('✅ Public response data:', data);
        return data;
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ API Error:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Success response data:', data);
    return data;
  } catch (error) {
    console.error('❌ Job API call error:', error);
    throw error;
  }
};

// Helper function for public API calls (no auth required)
const publicApiCall = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const fullUrl = `${API_BASE_URL}${url}`;
  
  try {
    console.log('🌍 Public API Call:', {
      url: fullUrl,
      method: options.method || 'GET',
      headers: options.headers
    });

    const response = await fetch(fullUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    console.log('📥 Public API Response:', {
      url: fullUrl,
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Public API Error Response:', errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }
      
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const responseText = await response.text();
    console.log('📄 Raw Response Text:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('✅ Parsed Response Data:', data);
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError);
      throw new Error('Invalid JSON response from server');
    }
    
    return data;
  } catch (error) {
    console.error('❌ Public Job API call error:', {
      url: fullUrl,
      error: error
    });
    throw error;
  }
};

// Job Service Class
class JobService {
  // === JOB TYPE MANAGEMENT ===
  
  // Get all job types (public)
  async getJobTypes(): Promise<JobType[]> {
    try {
      console.log('🔄 Fetching job types...');
      const response = await publicApiCall<JobType[]>('/api/v1/job-types');
      console.log('📊 Job types response:', response);
      
      if (response && response.result && Array.isArray(response.result)) {
        return response.result;
      }
      
      // Fallback nếu response không đúng format
      console.log('⚠️ Job types response không đúng format, sử dụng fallback data');
      return [
        { id: 1, name: 'Full-time' },
        { id: 2, name: 'Part-time' },
        { id: 3, name: 'Contract' },
        { id: 4, name: 'Freelance' },
        { id: 5, name: 'Internship' }
      ];
    } catch (error) {
      console.error('❌ Failed to fetch job types:', error);
      // Return fallback data if API fails
      console.log('🔄 Using fallback job types data...');
      return [
        { id: 1, name: 'Full-time' },
        { id: 2, name: 'Part-time' },
        { id: 3, name: 'Contract' },
        { id: 4, name: 'Freelance' },
        { id: 5, name: 'Internship' }
      ];
    }
  }

  // Create job type (admin)
  async createJobType(jobTypeData: JobTypeRequest): Promise<JobType> {
    const response = await apiCall<JobType>('/api/v1/job-types', {
      method: 'POST',
      body: JSON.stringify(jobTypeData),
    });
    return response.result!;
  }

  // Update job type (admin)
  async updateJobType(typeId: number, jobTypeData: JobTypeRequest): Promise<JobType> {
    const response = await apiCall<JobType>(`/api/v1/job-types/${typeId}`, {
      method: 'PUT',
      body: JSON.stringify(jobTypeData),
    });
    return response.result!;
  }

  // Delete job type (admin)
  async deleteJobType(typeId: number): Promise<void> {
    await apiCall<string>(`/api/v1/job-types/${typeId}`, {
      method: 'DELETE',
    });
  }

  // === JOB LEVEL MANAGEMENT ===

  // Get all job levels (public)
  async getJobLevels(): Promise<JobLevel[]> {
    try {
      console.log('🔄 Fetching job levels...');
      const response = await publicApiCall<JobLevel[]>('/api/v1/job-levels');
      console.log('📊 Job levels response:', response);
      
      if (response && response.result && Array.isArray(response.result)) {
        return response.result;
      }
      
      // Fallback nếu response không đúng format
      console.log('⚠️ Job levels response không đúng format, sử dụng fallback data');
      return [
        { id: 1, name: 'Entry Level' },
        { id: 2, name: 'Junior' },
        { id: 3, name: 'Mid Level' },
        { id: 4, name: 'Senior' },
        { id: 5, name: 'Lead' },
        { id: 6, name: 'Manager' },
        { id: 7, name: 'Director' }
      ];
    } catch (error) {
      console.error('❌ Failed to fetch job levels:', error);
      // Return fallback data if API fails
      console.log('🔄 Using fallback job levels data...');
      return [
        { id: 1, name: 'Entry Level' },
        { id: 2, name: 'Junior' },
        { id: 3, name: 'Mid Level' },
        { id: 4, name: 'Senior' },
        { id: 5, name: 'Lead' },
        { id: 6, name: 'Manager' },
        { id: 7, name: 'Director' }
      ];
    }
  }

  // Create job level (admin)
  async createJobLevel(jobLevelData: JobLevelRequest): Promise<JobLevel> {
    const response = await apiCall<JobLevel>('/api/v1/job-levels', {
      method: 'POST',
      body: JSON.stringify(jobLevelData),
    });
    return response.result!;
  }

  // Update job level (admin)
  async updateJobLevel(levelId: number, jobLevelData: JobLevelRequest): Promise<JobLevel> {
    const response = await apiCall<JobLevel>(`/api/v1/job-levels/${levelId}`, {
      method: 'PUT',
      body: JSON.stringify(jobLevelData),
    });
    return response.result!;
  }

  // Delete job level (admin)
  async deleteJobLevel(levelId: number): Promise<void> {
    await apiCall<string>(`/api/v1/job-levels/${levelId}`, {
      method: 'DELETE',
    });
  }

  // === SKILL MANAGEMENT ===

  // Get all skills (public)
  async getSkills(): Promise<Skill[]> {
    try {
      const response = await publicApiCall<Skill[]>('/api/v1/skills');
      return response.result || [];
    } catch (error) {
      console.error('Failed to fetch skills:', error);
      // Return fallback data if API fails
      return [
        { id: 1, name: 'JavaScript' },
        { id: 2, name: 'React' },
        { id: 3, name: 'Node.js' },
        { id: 4, name: 'Python' },
        { id: 5, name: 'Java' },
        { id: 6, name: 'PHP' },
        { id: 7, name: 'MySQL' },
        { id: 8, name: 'MongoDB' }
      ];
    }
  }

  // Create skill (admin)
  async createSkill(skillData: SkillRequest): Promise<Skill> {
    const response = await apiCall<Skill>('/api/v1/skills', {
      method: 'POST',
      body: JSON.stringify(skillData),
    });
    return response.result!;
  }

  // Update skill (admin)
  async updateSkill(skillId: number, skillData: SkillRequest): Promise<Skill> {
    const response = await apiCall<Skill>(`/api/v1/skills/${skillId}`, {
      method: 'PUT',
      body: JSON.stringify(skillData),
    });
    return response.result!;
  }

  // Delete skill (admin)
  async deleteSkill(skillId: number): Promise<void> {
    await apiCall<string>(`/api/v1/skills/${skillId}`, {
      method: 'DELETE',
    });
  }

  // === JOB SEARCH & DISCOVERY ===

  // Get dashboard jobs (public) - sử dụng API mới getDashboardJobPost
  async getDashboardJobs(page = 1, size = 10): Promise<PageResponse<JobPostDashboard>> {
    try {
      console.log(`🔄 Getting dashboard jobs page ${page}, size ${size}...`);
      
      const response = await publicApiCall<any>(`/api/v1/job-posts/dashboard?page=${page}&size=${size}`);
      
      console.log('📊 Get dashboard jobs API response:', response);
      
      // Kiểm tra response structure từ backend
      let jobsData: any[] = [];
      let pagination = {
          totalPages: 0,
          pageSize: size,
          totalElements: 0
        };

             if (response && response.result) {
         // Case 1: Backend trả về { result: PageResponse }
         if ((response.result as any).Data || (response.result as any).data) {
           jobsData = (response.result as any).Data || (response.result as any).data || [];
           pagination = {
             totalPages: (response.result as any).totalPages || 0,
             pageSize: (response.result as any).pageSize || size,
             totalElements: (response.result as any).totalElements || 0
           };
         }
         // Case 2: Backend trả về { result: JobPost[] } trực tiếp
         else if (Array.isArray(response.result)) {
           jobsData = response.result;
           pagination = {
             totalPages: 1,
             pageSize: size,
             totalElements: response.result.length
           };
         }
       }
       // Case 3: Backend trả về PageResponse trực tiếp
       else if (response && ((response as any).Data || (response as any).data)) {
         jobsData = (response as any).Data || (response as any).data || [];
         pagination = {
           totalPages: (response as any).totalPages || 0,
           pageSize: (response as any).pageSize || size,
           totalElements: (response as any).totalElements || 0
         };
       }
       // Case 4: Backend trả về array trực tiếp
       else if (Array.isArray(response)) {
         jobsData = response;
         pagination = {
           totalPages: 1,
           pageSize: size,
           totalElements: response.length
         };
       }

      console.log('📝 Processed jobs data:', jobsData);
      console.log('📄 Pagination info:', pagination);

      // Transform data to ensure consistency
      const transformedJobs: JobPostDashboard[] = jobsData.map((job: any) => ({
        id: job.id || job.job_id,
        title: job.title || 'Không có tiêu đề',
        description: job.description,
        location: job.location || 'Không xác định',
        salary: job.salary || 'Thỏa thuận',
        deadline: job.deadline,
        appliedCount: job.appliedCount || job.applied_count || 0,
        hiringQuota: job.hiringQuota || job.hiring_quota || 0,
        status: job.status || 'active',
        createdAt: job.createdAt || job.created_at || new Date().toISOString(),
        company: {
          id: job.company?.id || job.company_id || 0,
          name: job.company?.name || job.company_name || 'Công ty không xác định',
          logo: job.company?.logo,
          description: job.company?.description,
          jobCount: job.company?.jobCount || job.company?.job_count
        },
        jobType: job.jobType ? {
          id: job.jobType.id,
          name: job.jobType.name
        } : undefined,
        skills: job.skills || []
      }));

      return {
        Data: transformedJobs,
        totalPages: pagination.totalPages,
        pageSize: pagination.pageSize,
        totalElements: pagination.totalElements
      };
    } catch (error) {
      console.error('❌ Error getting dashboard jobs:', error);
      
      // Return mock data for testing if API fails
      console.log('🔄 Returning mock data for testing...');
      const mockJobs: JobPostDashboard[] = [
        {
          id: 1,
          title: 'Frontend Developer (React)',
          description: 'Chúng tôi đang tìm kiếm Frontend Developer có kinh nghiệm với React.js để tham gia đội ngũ phát triển sản phẩm.',
          location: 'TP.HCM',
          salary: '15-25 triệu VNĐ',
          deadline: '2024-12-31',
          appliedCount: 12,
          hiringQuota: 2,
          status: 'active',
          createdAt: new Date().toISOString(),
          company: {
            id: 1,
            name: 'Công ty TNHH Công nghệ ABC',
            logo: undefined,
            jobCount: 5
          },
          jobType: {
            id: 1,
            name: 'Full-time'
          },
          skills: [
            { id: 1, name: 'React' },
            { id: 2, name: 'JavaScript' },
            { id: 3, name: 'CSS' }
          ]
        },
        {
          id: 2,
          title: 'Backend Developer (Node.js)',
          description: 'Cần tuyển Backend Developer có kinh nghiệm với Node.js và MongoDB.',
          location: 'Hà Nội',
          salary: '20-30 triệu VNĐ',
          deadline: '2024-12-25',
          appliedCount: 8,
          hiringQuota: 1,
          status: 'active',
          createdAt: new Date().toISOString(),
          company: {
            id: 2,
            name: 'Startup XYZ',
            logo: undefined,
            jobCount: 3
          },
          jobType: {
            id: 1,
            name: 'Full-time'
          },
          skills: [
            { id: 4, name: 'Node.js' },
            { id: 5, name: 'MongoDB' },
            { id: 6, name: 'Express' }
          ]
        }
      ];

      return {
        Data: mockJobs,
        totalPages: 1,
        pageSize: size,
        totalElements: mockJobs.length
      };
    }
  }

  // Get all jobs (public) - method cũ để backup
  async getAllJobs(page = 1, size = 10): Promise<PageResponse<JobPost>> {
    try {
      console.log(`Getting all jobs page ${page}, size ${size}...`);
      
      const response = await publicApiCall<PageResponse<JobPost>>(`/api/v1/job-posts?page=${page}&size=${size}`);
      
      console.log('Get all jobs API response:', response);
      
      // Backend wrap trong ApiResponse: { result: PageResponse }
      if (!response.result || !response.result.Data) {
        return {
          Data: [],
          totalPages: 0,
          pageSize: size,
          totalElements: 0
        };
      }
      
      return response.result;
    } catch (error) {
      console.error('Error getting all jobs:', error);
      // Fallback khi API lỗi
      return {
        Data: [],
        totalPages: 0,
        pageSize: size,
        totalElements: 0
      };
    }
  }

  // Search jobs with filters (public)
  async searchJobs(searchParams: JobSearchRequest): Promise<PageResponse<JobPost>> {
    try {
      console.log('Searching jobs with params:', searchParams);
      
      // Chuẩn bị query params cho GET request
      const queryParams = new URLSearchParams();
      if (searchParams.keyword) queryParams.append('keyword', searchParams.keyword);
      if (searchParams.location) queryParams.append('location', searchParams.location);
      if (searchParams.jobTypeIds && searchParams.jobTypeIds.length > 0) {
        queryParams.append('jobTypeId', searchParams.jobTypeIds[0].toString());
      }
      if (searchParams.jobLevelIds && searchParams.jobLevelIds.length > 0) {
        queryParams.append('jobLevelId', searchParams.jobLevelIds[0].toString());
      }
      if (searchParams.skillIds && searchParams.skillIds.length > 0) {
        searchParams.skillIds.forEach(skillId => {
          queryParams.append('skillIds', skillId.toString());
        });
      }
      queryParams.append('page', (searchParams.page || 1).toString());
      queryParams.append('size', (searchParams.size || 10).toString());
      
      const url = `/api/v1/job-posts/search${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      console.log('Search URL:', url);
      
      const response = await publicApiCall<PageResponse<JobPost>>(url);
      
      console.log('Search jobs API response:', response);
      
      // Backend wrap trong ApiResponse: { result: PageResponse }
      if (!response.result || !response.result.Data) {
        return {
          Data: [],
          totalPages: 0,
          pageSize: searchParams.size || 10,
          totalElements: 0
        };
      }
      
      return response.result;
    } catch (error) {
      console.error('Error searching jobs:', error);
      // Fallback khi API lỗi
      return {
        Data: [],
        totalPages: 0,
        pageSize: searchParams.size || 10,
        totalElements: 0
      };
    }
  }

  // Get single job by ID (public)
  async getJobById(id: number): Promise<JobPost> {
    try {
      console.log(`Getting job details for ID: ${id}`);
      
      const response = await publicApiCall<JobPost>(`/api/v1/job-posts/${id}`);
      
      if (!response.result) {
        throw new Error('Không tìm thấy thông tin việc làm');
      }
      
      return response.result;
    } catch (error) {
      console.error('Error getting job by ID:', error);
      throw error;
    }
  }

  // Get jobs by company (public)
  async getJobsByCompany(companyId: number, page: number = 1, size: number = 10): Promise<PageResponse<JobPost>> {
    try {
      const response = await publicApiCall<PageResponse<JobPost>>(`/api/v1/job-posts/company/${companyId}?page=${page}&size=${size}`);
      
      if (!response.result) {
        return {
          Data: [],
          totalPages: 0,
          pageSize: size,
          totalElements: 0
        };
      }
      
      return response.result;
    } catch (error) {
      console.error('Error fetching company jobs:', error);
      return {
        Data: [],
        totalPages: 0,
        pageSize: size,
        totalElements: 0
      };
    }
  }

  // === COMPANY JOB MANAGEMENT ===

  // Get company's own job posts (authenticated)
  async getMyJobPosts(page = 1, size = 10): Promise<PageResponse<JobPost>> {
    try {
      console.log('Getting company job posts...');
      
      // Kiểm tra quyền truy cập
      const token = localStorage.getItem('access_token');
      const userType = localStorage.getItem('user_type');
      
      if (!token) {
        throw new Error('Bạn cần đăng nhập để xem tin tuyển dụng');
      }
      
      if (userType !== 'employer') {
        throw new Error('Chỉ tài khoản công ty mới có thể xem tin tuyển dụng của mình');
      }
      
      const response = await apiCall<any>(`/api/v1/job-posts/my-posts?page=${page}&size=${size}`, {
        method: 'GET',
      });
      
      console.log('My job posts response:', response);
      
      if (!response.result) {
        return {
          Data: [],
          totalPages: 0,
          pageSize: size,
          totalElements: 0
        };
      }
      
      // Backend response should be PageResponse<JobPostResponse>
      const jobsData = response.result.Data || response.result.data || [];
      
      // Transform JobPostResponse to JobPost format (they should match mostly)
      const transformedJobs = jobsData.map((job: any) => ({
        id: job.id,
        title: job.title,
        description: job.description,
        requirements: job.requirements,
        benefits: job.benefits,
        location: job.location,
        workingTime: job.workingTime,
        salary: job.salary,
        experienceRequired: job.experienceRequired,
        deadline: job.deadline,
        appliedCount: job.appliedCount || 0,
        hiringQuota: job.hiringQuota || 0,
        status: job.status, // This should be one of: PENDING, ACTIVE, CLOSED, EXPIRED, REJECTED, SUSPENDED
        createdAt: job.createdAt || new Date().toISOString(),
        updatedAt: job.updatedAt,
        company: job.company ? {
          id: job.company.id,
          name: job.company.name,
          logo: job.company.logo,
          description: job.company.description,
          jobCount: job.company.jobCount
        } : {
          id: 0,
          name: 'Unknown Company'
        },
        jobType: job.jobType ? { id: job.jobType.id, name: job.jobType.name } : undefined,
        jobLevel: job.jobLevel ? { id: job.jobLevel.id, name: job.jobLevel.name } : undefined,
        skills: job.skills || [],
        isFavorite: job.isFavorite,
        canApply: job.canApply
      }));
      
      return {
        Data: transformedJobs,
        totalPages: response.result.totalPages || 1,
        pageSize: response.result.pageSize || size,
        totalElements: response.result.totalElements || transformedJobs.length
      };
    } catch (error: any) {
      console.error('Error getting my job posts:', error);
      
      // Xử lý lỗi cụ thể
      if (error.message?.includes('COMPANY_NOT_EXISTED') || 
          error.message?.includes('Company not exists')) {
        throw new Error('Bạn chưa có hồ sơ công ty. Vui lòng tạo hồ sơ công ty trước.');
      }
      
      if (error.message?.includes('403') || 
          error.message?.includes('Forbidden') ||
          error.message?.includes('permission')) {
        throw new Error('Bạn không có quyền truy cập danh sách việc làm. Vui lòng đăng nhập lại bằng tài khoản công ty.');
      }
      
      throw error;
    }
  }

  // Create job post (company)
  async createJobPost(jobData: JobPostCreationRequest): Promise<JobPost> {
    try {
      console.log('Creating job post with data:', jobData);
      
      const response = await apiCall<JobPost>('/api/v1/job-posts', {
        method: 'POST',
        body: JSON.stringify(jobData),
      });
      
      console.log('Create job response:', response);
      
      if (!response.result) {
        throw new Error('Không thể tạo tin tuyển dụng');
      }
      
      return response.result;
    } catch (error: any) {
      console.error('Error creating job post:', error);
      
      // Xử lý các lỗi cụ thể
      if (error.message?.includes('COMPANY_NOT_EXISTED')) {
        throw new Error('Bạn cần tạo hồ sơ công ty trước khi đăng tin tuyển dụng');
      }
      
      throw error;
    }
  }

  // Update job post (company)
  async updateJobPost(jobId: number, jobData: JobPostUpdateRequest): Promise<JobPost> {
    try {
      console.log(`Updating job post ${jobId} with data:`, jobData);
      
      const response = await apiCall<JobPost>(`/api/v1/job-posts/${jobId}`, {
        method: 'PUT',
        body: JSON.stringify(jobData),
      });
      
      console.log('Update job response:', response);
      
      if (!response.result) {
        throw new Error('Không thể cập nhật tin tuyển dụng');
      }
      
      return response.result;
    } catch (error) {
      console.error('Error updating job post:', error);
      throw error;
    }
  }

  // Delete job post (company)
  async deleteJobPost(jobId: number): Promise<void> {
    try {
      await apiCall(`/api/v1/job-posts/${jobId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting job post:', error);
      throw error;
    }
  }

  // Close job post (company)
  async closeJobPost(jobId: number): Promise<void> {
    try {
      console.log(`Closing job post with ID: ${jobId}`);
      await apiCall(`/api/v1/job-posts/${jobId}/close`, {
        method: 'PATCH',
      });
      console.log('Job post closed successfully');
    } catch (error) {
      console.error('Error closing job post:', error);
      throw error;
    }
  }

  // Reopen job post (company)
  async reopenJobPost(jobId: number): Promise<void> {
    try {
      console.log(`Reopening job post with ID: ${jobId}`);
      await apiCall(`/api/v1/job-posts/${jobId}/reopen`, {
        method: 'PATCH',
      });
      console.log('Job post reopened successfully');
    } catch (error) {
      console.error('Error reopening job post:', error);
      throw error;
    }
  }

  // === ADMIN JOB MANAGEMENT ===

  // Approve job post (admin)
  async approveJobPost(jobId: number): Promise<void> {
    try {
      await apiCall(`/api/v1/job-posts/admin/${jobId}/approve`, {
        method: 'PATCH',
      });
    } catch (error) {
      console.error('Error approving job post:', error);
      throw error;
    }
  }

  // Reject job post (admin)
  async rejectJobPost(jobId: number): Promise<void> {
    try {
      await apiCall(`/api/v1/job-posts/admin/${jobId}/reject`, {
        method: 'PATCH',
      });
    } catch (error) {
      console.error('Error rejecting job post:', error);
      throw error;
    }
  }

  // Suspend job post (admin)
  async suspendJobPost(jobId: number): Promise<void> {
    try {
      await apiCall(`/api/v1/job-posts/admin/${jobId}/suspend`, {
        method: 'PATCH',
      });
    } catch (error) {
      console.error('Error suspending job post:', error);
      throw error;
    }
  }

  // === USER FAVORITES ===

  // Add job to favorites (user)
  async favoriteJob(jobId: number): Promise<void> {
    try {
      await apiCall(`/api/v1/job-posts/${jobId}/favorite`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error adding job to favorites:', error);
      throw error;
    }
  }

  // Remove job from favorites (user)
  async unfavoriteJob(jobId: number): Promise<void> {
    try {
      await apiCall(`/api/v1/job-posts/${jobId}/favorite`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error removing job from favorites:', error);
      throw error;
    }
  }

  // Check if job is in favorites (user)
  async isFavoriteJob(jobId: number): Promise<boolean> {
    try {
      const response = await apiCall<boolean>(`/api/v1/job-posts/${jobId}/isFavorite`, {
        method: 'GET',
      });
      return response.result || false;
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  }

  // Get user's favorite jobs (user)
  async getFavoriteJobs(page: number = 1, size: number = 10): Promise<PageResponse<JobPost>> {
    try {
      const response = await apiCall<PageResponse<JobPost>>(`/api/v1/users/job-posts-favorite?page=${page}&size=${size}`, {
        method: 'GET',
      });
      return response.result || {
        Data: [],
        totalPages: 0,
        pageSize: size,
        totalElements: 0
      };
    } catch (error) {
      console.error('Error fetching favorite jobs:', error);
      return {
        Data: [],
        totalPages: 0,
        pageSize: size,
        totalElements: 0
      };
    }
  }

  // === UTILITY METHODS ===

  // Format date string to readable format
  formatDate(dateString?: string): string {
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
  }

  // Format salary string
  formatSalary(salary?: string): string {
    if (!salary) return 'Thỏa thuận';
    return salary;
  }

  // Get company logo URL with fallback
  getCompanyLogoUrl(logo?: string): string {
    if (!logo) return '/images/default-company-logo.png';
    if (logo.startsWith('http')) return logo;
    return `${API_BASE_URL}/uploads/company-logos/${logo}`;
  }

  // Format experience level
  formatExperienceLevel(experience?: string): string {
    if (!experience) return 'Không yêu cầu kinh nghiệm';
    return experience;
  }

  // Get job status color for UI
  getJobStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
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
  }

  // Format job status for display
  formatJobStatus(status?: string): string {
    switch (status?.toLowerCase()) {
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
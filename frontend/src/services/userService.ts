// User Service
// Service để xử lý các API liên quan đến user profile và thông tin cá nhân

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/TopCV';

// Types for User API
export interface UserProfile {
  id: string;
  userName: string;
  email: string;
  fullname: string;
  phone?: string;
  address?: string;
  avt?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isEmailVerified: boolean;
  dob?: string;
  role: string;
}

export interface UserUpdateRequest {
  userName?: string;
  fullName?: string;
  phone?: string;
  address?: string;
  avt?: string;
  dob?: string;
}

// Additional types for extended profile data
export interface UserSkill {
  id?: number;
  name: string;
  level?: string;
}

export interface UserEducation {
  id?: number;
  degree: string;
  major: string;
  school: string;
  graduationYear: string;
  gpa?: string;
  startDate?: string;
  endDate?: string;
}

export interface UserExperience {
  id?: number;
  position: string;
  company: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  location?: string;
}

export interface UserLanguage {
  id?: number;
  language: string;
  level: string;
}

export interface UserCertification {
  id?: number;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface ApiResponse<T> {
  code?: number;
  message?: string;
  result?: T;
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
        // Refresh failed, redirect to login
        console.log('Token refresh failed, redirecting to login...');
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_type');
        window.location.href = '/auth/jobseeker/login';
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
    console.error('User API call error:', error);
    throw error;
  }
};

// User Service Class
class UserService {
  // Get current user profile
  async getMyProfile(): Promise<UserProfile> {
    const response = await apiCall<UserProfile>('/api/v1/users/my-info', {
      method: 'GET',
    });

    return response.result!;
  }

  // Update current user profile
  async updateMyProfile(userData: UserUpdateRequest): Promise<UserProfile> {
    const response = await apiCall<UserProfile>('/api/v1/users/my-info', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });

    return response.result!;
  }

  // Get user by ID (for viewing other users)
  async getUserById(userId: string): Promise<UserProfile> {
    const response = await apiCall<UserProfile>(`/api/v1/users/${userId}`, {
      method: 'GET',
    });

    return response.result!;
  }

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<string> {
    const response = await apiCall<string>('/api/v1/users/change-password', {
      method: 'POST',
      body: JSON.stringify({
        currentPassword,
        newPassword
      }),
    });

    return response.result!;
  }

  // Format date for display
  formatDate(dateString?: string): string {
    if (!dateString) return 'Chưa cập nhật';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Ngày không hợp lệ';
    }
  }

  // Format phone number
  formatPhone(phone?: string): string {
    if (!phone) return 'Chưa cập nhật';
    
    // Add basic phone formatting if needed
    return phone;
  }

  // Get avatar URL or default
  getAvatarUrl(avt?: string): string {
    if (avt) return avt;
    
    // Return default avatar
    return '/images/default-avatar.png';
  }

  // Skills API methods
  async getMySkills(): Promise<UserSkill[]> {
    // For now, return empty array as backend might not have skills endpoint yet
    // TODO: Implement when backend adds skills endpoint
    return [];
  }

  async addSkill(skill: Omit<UserSkill, 'id'>): Promise<UserSkill> {
    // TODO: Implement when backend adds skills endpoint
    throw new Error('Skills API not implemented yet');
  }

  async updateSkill(skillId: number, skill: Partial<UserSkill>): Promise<UserSkill> {
    // TODO: Implement when backend adds skills endpoint
    throw new Error('Skills API not implemented yet');
  }

  async deleteSkill(skillId: number): Promise<void> {
    // TODO: Implement when backend adds skills endpoint
    throw new Error('Skills API not implemented yet');
  }

  // Education API methods
  async getMyEducation(): Promise<UserEducation[]> {
    // TODO: Implement when backend adds education endpoint
    return [];
  }

  async addEducation(education: Omit<UserEducation, 'id'>): Promise<UserEducation> {
    // TODO: Implement when backend adds education endpoint
    throw new Error('Education API not implemented yet');
  }

  async updateEducation(educationId: number, education: Partial<UserEducation>): Promise<UserEducation> {
    // TODO: Implement when backend adds education endpoint
    throw new Error('Education API not implemented yet');
  }

  async deleteEducation(educationId: number): Promise<void> {
    // TODO: Implement when backend adds education endpoint
    throw new Error('Education API not implemented yet');
  }

  // Experience API methods
  async getMyExperience(): Promise<UserExperience[]> {
    // TODO: Implement when backend adds experience endpoint
    return [];
  }

  async addExperience(experience: Omit<UserExperience, 'id'>): Promise<UserExperience> {
    // TODO: Implement when backend adds experience endpoint
    throw new Error('Experience API not implemented yet');
  }

  async updateExperience(experienceId: number, experience: Partial<UserExperience>): Promise<UserExperience> {
    // TODO: Implement when backend adds experience endpoint
    throw new Error('Experience API not implemented yet');
  }

  async deleteExperience(experienceId: number): Promise<void> {
    // TODO: Implement when backend adds experience endpoint
    throw new Error('Experience API not implemented yet');
  }

  // Languages API methods
  async getMyLanguages(): Promise<UserLanguage[]> {
    // TODO: Implement when backend adds languages endpoint
    return [];
  }

  async addLanguage(language: Omit<UserLanguage, 'id'>): Promise<UserLanguage> {
    // TODO: Implement when backend adds languages endpoint
    throw new Error('Languages API not implemented yet');
  }

  async updateLanguage(languageId: number, language: Partial<UserLanguage>): Promise<UserLanguage> {
    // TODO: Implement when backend adds languages endpoint
    throw new Error('Languages API not implemented yet');
  }

  async deleteLanguage(languageId: number): Promise<void> {
    // TODO: Implement when backend adds languages endpoint
    throw new Error('Languages API not implemented yet');
  }

  // Certifications API methods
  async getMyCertifications(): Promise<UserCertification[]> {
    // TODO: Implement when backend adds certifications endpoint
    return [];
  }

  async addCertification(certification: Omit<UserCertification, 'id'>): Promise<UserCertification> {
    // TODO: Implement when backend adds certifications endpoint
    throw new Error('Certifications API not implemented yet');
  }

  async updateCertification(certificationId: number, certification: Partial<UserCertification>): Promise<UserCertification> {
    // TODO: Implement when backend adds certifications endpoint
    throw new Error('Certifications API not implemented yet');
  }

  async deleteCertification(certificationId: number): Promise<void> {
    // TODO: Implement when backend adds certifications endpoint
    throw new Error('Certifications API not implemented yet');
  }
}

// Export singleton instance
export const userService = new UserService();
export default userService; 
// Authentication Service
// Service này xử lý tất cả các API liên quan đến authentication cho cả User và Employer (Company)

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/TopCV';

// Helper function to decode JWT token
const decodeToken = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

// Helper function to get role from JWT token
const getRoleFromToken = (token: string): string | null => {
  const payload = decodeToken(token);
  if (payload && payload.scope) {
    // scope contains role name (e.g., "USER" or "EMPLOYER")
    return payload.scope.trim();
  }
  return null;
};

// Helper function to validate role matches expected type
const validateRole = (token: string, expectedUserType: 'user' | 'employer'): boolean => {
  const role = getRoleFromToken(token);
  if (!role) return false;
  
  if (expectedUserType === 'user') {
    return role === 'USER';
  } else if (expectedUserType === 'employer') {
    return role === 'EMPLOYER';
  }
  
  return false;
};

// Types for requests and responses
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
  fullname: string;
  phone?: string;
  address?: string;
  dob?: string;
  role?: string;
}

export interface CompanyRegisterRequest {
  companyName: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  website?: string;
  description?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface VerifyOtpRequest {
  keyRedisToken: string;
  otp: string;
}

export interface AuthResponse {
  token: string;
}

export interface ApiResponse<T> {
  code?: number;
  message?: string;
  result?: T;
}

export interface RegistrationResponse {
  id: string;
  email: string;
  keyRedisToken: string;
  message: string;
}

// Helper function để gọi API
const apiCall = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(`${API_BASE_URL}${url}`, {
      credentials: 'include', // Để gửi cookies (refresh token)
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

// Authentication Service Class
class AuthService {
  // User Authentication APIs
  async loginUser(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiCall<AuthResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.result?.token) {
      // Validate role matches expected user type
      if (!validateRole(response.result.token, 'user')) {
        throw new Error('Tài khoản này không phải là tài khoản Job Seeker. Vui lòng sử dụng form đăng nhập dành cho Company.');
      }
      
      localStorage.setItem('access_token', response.result.token);
      localStorage.setItem('user_type', 'user');
    }

    return response.result!;
  }

  async registerUser(userData: RegisterRequest): Promise<RegistrationResponse> {
    const response = await apiCall<RegistrationResponse>('/api/v1/users/register', {
      method: 'POST',
      body: JSON.stringify({
        ...userData,
        role: 'USER'
      }),
    });

    return response.result!;
  }

  // Employer/Company Authentication APIs  
  async loginCompany(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiCall<AuthResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.result?.token) {
      // Validate role matches expected user type
      if (!validateRole(response.result.token, 'employer')) {
        throw new Error('Tài khoản này không phải là tài khoản Company. Vui lòng sử dụng form đăng nhập dành cho Job Seeker.');
      }
      
      localStorage.setItem('access_token', response.result.token);
      localStorage.setItem('user_type', 'employer');
    }

    return response.result!;
  }

  async registerCompany(companyData: CompanyRegisterRequest): Promise<RegistrationResponse> {
    // Chuyển đổi dữ liệu company thành format của User với role EMPLOYER
    const userData: RegisterRequest = {
      userName: companyData.companyName.toLowerCase().replace(/\s+/g, '') + Date.now(),
      email: companyData.email,
      password: companyData.password,
      fullname: companyData.companyName,
      phone: companyData.phone,
      address: companyData.address,
      // Role sẽ được tự động set thành EMPLOYER bởi EmployerController
    };

    const response = await apiCall<RegistrationResponse>('/api/v1/employers/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    return response.result!;
  }

  // Common Authentication APIs
  async forgotPassword(email: string): Promise<string> {
    const response = await apiCall<string>('/api/v1/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    return response.result!;
  }

  async resetPassword(resetData: ResetPasswordRequest): Promise<string> {
    const response = await apiCall<string>('/api/v1/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(resetData),
    });

    return response.result!;
  }

  async verifyEmail(verifyData: VerifyOtpRequest): Promise<any> {
    const response = await apiCall<any>('/api/v1/users/verify-email', {
      method: 'POST',
      body: JSON.stringify(verifyData),
    });

    return response.result!;
  }

  async changePassword(changeData: ChangePasswordRequest): Promise<string> {
    const response = await apiCall<string>('/api/v1/users/change-password', {
      method: 'POST',
      body: JSON.stringify(changeData),
    });

    return response.result!;
  }

  // Refresh access token using refresh token
  async refreshToken(): Promise<string | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
        method: 'POST',
        credentials: 'include', // Include HTTP-only refresh token cookie
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.result?.token) {
        localStorage.setItem('access_token', data.result.token);
        return data.result.token;
      }
      
      throw new Error('No token in refresh response');
    } catch (error: any) {
      console.error('Token refresh failed:', error);
      // Clear invalid tokens
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_type');
      return null;
    }
  }

  // Check if token is expired (basic check)
  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true; // If we can't parse, consider expired
    }
  }

  // Get valid token with auto-refresh
  async getValidToken(): Promise<string | null> {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      return null;
    }

    // If token is not expired, return it
    if (!this.isTokenExpired(token)) {
      return token;
    }

    // Try to refresh the token
    return await this.refreshToken();
  }

  async logout(): Promise<void> {
    try {
      await apiCall<void>('/api/v1/auth/logout', {
        method: 'POST',
      });
    } finally {
      // Clear localStorage regardless of API success
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_type');
    }
  }

  // Utility methods
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getUserType(): 'user' | 'employer' | null {
    return localStorage.getItem('user_type') as 'user' | 'employer' | null;
  }

  getRoleFromStoredToken(): string | null {
    const token = this.getToken();
    if (!token) return null;
    return getRoleFromToken(token);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Auto-refresh token when needed
  async ensureValidToken(): Promise<boolean> {
    try {
      if (!this.isAuthenticated()) {
        return false;
      }

      // Try to refresh token
      await this.refreshToken();
      return true;
    } catch (error) {
      // If refresh fails, clear auth data
      this.logout();
      return false;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService; 
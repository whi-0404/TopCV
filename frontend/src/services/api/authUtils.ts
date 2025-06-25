import axios from 'axios';
import { authApi } from './authApi';

const API_BASE_URL = 'http://localhost:8080/TopCV/api/v1';

export interface RefreshTokenResponse {
  success: boolean;
  token?: string;
  error?: string;
}

/**
 * Utility function để refresh token
 * @returns Promise<RefreshTokenResponse>
 */
export const refreshAccessToken = async (): Promise<RefreshTokenResponse> => {
  try {
    console.log('Attempting to refresh access token...');
    
    const response = await axios.post(
      `${API_BASE_URL}/auth/refresh`,
      {},
      { 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data && response.data.result && response.data.result.token) {
      const newToken = response.data.result.token;
      console.log('Token refreshed successfully');
      
      // Cập nhật token mới vào localStorage
      localStorage.setItem('access_token', newToken);
      
      return {
        success: true,
        token: newToken
      };
    } else {
      console.error('Invalid refresh response format');
      return {
        success: false,
        error: 'Invalid refresh response format'
      };
    }
  } catch (error: any) {
    console.error('Refresh token failed:', error);
    
    // Clear storage nếu refresh thất bại
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    
    // Dispatch custom event để AuthContext có thể handle logout
    window.dispatchEvent(new CustomEvent('auth:logout'));
    
    return {
      success: false,
      error: error.response?.data?.message || 'Refresh token failed'
    };
  }
};

/**
 * Kiểm tra xem error có phải là token expired không
 * @param error - Error object từ axios
 * @returns boolean
 */
export const isTokenExpiredError = (error: any): boolean => {
  return error.response?.data?.code === 1103 || error.response?.status === 401;
};

/**
 * Xử lý logout và clear tất cả data
 */
export const handleLogout = async (): Promise<void> => {
  try {
    await authApi.logout();
    console.log('Logout API called successfully');
  } catch (error) {
    console.error('Logout API error:', error);
  } finally {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    window.dispatchEvent(new CustomEvent('auth:logout'));
  }
}; 
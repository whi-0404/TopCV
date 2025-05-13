import api from '../services/api';
import { API_CONFIG } from '../config';

/**
 * Hàm kiểm tra kết nối đến API
 */
export const testApiConnection = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // Thử gọi API không yêu cầu xác thực
    await api.get('/');
    return { success: true, message: 'Kết nối API thành công' };
  } catch (error: any) {
    // Nếu lỗi là 404, có thể API đang hoạt động nhưng endpoint không tồn tại
    if (error.response && error.response.status === 404) {
      return { success: true, message: 'API đang hoạt động, nhưng endpoint không tồn tại' };
    }
    
    // Nếu lỗi là 401 hoặc 403, có thể API đang hoạt động nhưng yêu cầu xác thực
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      return { success: true, message: 'API đang hoạt động, nhưng yêu cầu xác thực' };
    }
    
    // Các lỗi khác
    return { 
      success: false, 
      message: `Không thể kết nối đến API: ${error.message || 'Lỗi không xác định'}` 
    };
  }
};

/**
 * Hàm kiểm tra đăng nhập
 */
export const testLogin = async (email: string, password: string): Promise<{ success: boolean; message: string; data?: any }> => {
  try {
    const response = await api.post(API_CONFIG.AUTH.LOGIN, { email, password });
    return { 
      success: true, 
      message: 'Đăng nhập thành công', 
      data: response.data 
    };
  } catch (error: any) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Đăng nhập thất bại'
    };
  }
};

/**
 * Hàm kiểm tra đăng ký
 */
export const testRegister = async (registerData: any): Promise<{ success: boolean; message: string; data?: any }> => {
  try {
    const response = await api.post(API_CONFIG.AUTH.REGISTER, registerData);
    return { 
      success: true, 
      message: 'Đăng ký thành công', 
      data: response.data 
    };
  } catch (error: any) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Đăng ký thất bại'
    };
  }
};

/**
 * Hàm kiểm tra gửi OTP
 */
export const testSendOtp = async (email: string): Promise<{ success: boolean; message: string; data?: any }> => {
  try {
    const response = await api.post(`${API_CONFIG.AUTH.SEND_OTP}?email=${email}`);
    return { 
      success: true, 
      message: 'Gửi OTP thành công', 
      data: response.data 
    };
  } catch (error: any) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Gửi OTP thất bại'
    };
  }
};

/**
 * Hàm kiểm tra đổi mật khẩu
 */
export const testChangePassword = async (email: string, otp: string, newPassword: string): Promise<{ success: boolean; message: string; data?: any }> => {
  try {
    const response = await api.post(API_CONFIG.AUTH.CHANGE_PASSWORD, { email, otp, newPassword });
    return { 
      success: true, 
      message: 'Đổi mật khẩu thành công', 
      data: response.data 
    };
  } catch (error: any) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Đổi mật khẩu thất bại'
    };
  }
}; 
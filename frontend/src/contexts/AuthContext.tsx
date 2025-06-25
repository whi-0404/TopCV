import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, RegisterData } from '../types';
import { authApi } from '../services/api/authApi';
import { userApi } from '../services/api/userApi';
import { employerApi } from '../services/api/employerApi';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra token từ localStorage khi app khởi động
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('access_token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          
          // Thử gọi API để validate token
          try {
            const userInfoResponse = await userApi.getMyInfo();
            // Token valid, update user state
            const userInfo = userInfoResponse.result;
            const updatedUser: User = {
              id: userInfo.id,
              userName: userInfo.userName,
              email: userInfo.email,
              fullname: userInfo.fullname,
              phone: userInfo.phone,
              address: userInfo.address,
              avt: userInfo.avt,
              role: userInfo.role as 'USER' | 'EMPLOYER' | 'ADMIN',
              isActive: userInfo.isActive,
              isEmailVerified: userInfo.isEmailVerified,
              dob: userInfo.dob,
              createdAt: userInfo.createdAt,
              updatedAt: userInfo.updatedAt
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
          } catch (error) {
            // Token invalid hoặc expired, clear storage
            console.log('Token invalid, clearing storage');
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            setUser(null);
          }
        } catch (error) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    // Lắng nghe event logout từ API interceptor
    const handleAuthLogout = () => {
      setUser(null);
    };

    checkAuthStatus();
    
    // Add event listener
    window.addEventListener('auth:logout', handleAuthLogout);
    
    // Cleanup
    return () => {
      window.removeEventListener('auth:logout', handleAuthLogout);
    };
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      console.log('Login attempt:', { email, password: '***' });
      const response = await authApi.login({ email, password });
      console.log('Login response:', response);
      
      // Lưu token
      localStorage.setItem('access_token', response.result.token);
      
      // Lấy user info với token vừa có
      const userInfoResponse = await userApi.getMyInfo();
      console.log('User info response:', userInfoResponse);
      
      // Cập nhật user state
      const userInfo = userInfoResponse.result;
      const user: User = {
        id: userInfo.id,
        userName: userInfo.userName,
        email: userInfo.email,
        fullname: userInfo.fullname,
        phone: userInfo.phone,
        address: userInfo.address,
        avt: userInfo.avt,
        role: userInfo.role as 'USER' | 'EMPLOYER' | 'ADMIN',
        isActive: userInfo.isActive,
        isEmailVerified: userInfo.isEmailVerified,
        dob: userInfo.dob,
        createdAt: userInfo.createdAt,
        updatedAt: userInfo.updatedAt
      };
      
      // Lưu user info
      localStorage.setItem('user', JSON.stringify(user));
      console.log('User state updated:', user);
      setUser(user);
    } catch (error: any) {
      console.error('Login error details:', error);
      console.error('Error response:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<string | null> => {
    setLoading(true);
    try {
      let response;
      // Gọi API đăng ký tương ứng theo role
      if (userData.role === 'EMPLOYER') {
        response = await employerApi.register({
          email: userData.email,
          password: userData.password,
          fullname: userData.fullname
        });
      } else {
        response = await userApi.register({
          email: userData.email,
          password: userData.password,
          fullname: userData.fullname
        });
      }
      
      // Đăng ký thành công nhưng cần verify email
      // Trả về keyRedisToken để dùng cho verify email
      console.log('Registration successful, please verify email');
      return response.result.keyRedisToken || null;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const sendOTP = async (email: string, purpose: 'register' | 'forgot-password'): Promise<void> => {
    try {
      if (purpose === 'forgot-password') {
        await authApi.forgotPassword({ email });
      } else {
        // For registration OTP, it's automatically sent when registering
        console.log('OTP sent during registration');
      }
    } catch (error: any) {
      console.error('Send OTP error:', error);
      throw new Error(error.response?.data?.message || 'Không thể gửi OTP');
    }
  };

  const verifyOTP = async (email: string, otp: string, purpose: 'register' | 'forgot-password', token?: string): Promise<boolean> => {
    try {
      if (purpose === 'register') {
        if (!token) {
          throw new Error('Token is required for registration verification');
        }
        
        const response = await userApi.verifyEmail({ keyRedisToken: token, otp });
        
        // Sau khi verify thành công, không tự động đăng nhập
        // User cần đăng nhập lại để có token authentication
        console.log('Email verified successfully, please login again');
        return true;
      }
      // For forgot-password, we just return true to proceed to reset password
      return true;
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      return false;
    }
  };

  const resetPassword = async (email: string, newPassword: string, otp: string): Promise<void> => {
    try {
      await authApi.resetPassword({ email, otp, newPassword });
    } catch (error: any) {
      console.error('Reset password error:', error);
      throw new Error(error.response?.data?.message || 'Không thể đặt lại mật khẩu');
    }
  };

  const value: AuthContextType = {
    user,
    setUser,
    login,
    register,
    logout,
    loading,
    sendOTP,
    verifyOTP,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
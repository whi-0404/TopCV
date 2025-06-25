import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/layout/Layout';
import { 
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface LocationState {
  email?: string;
  otpVerified?: boolean;
}

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetPassword } = useAuth();
  
  const state = location.state as LocationState;
  const { email, otpVerified } = state || {};

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Redirect nếu chưa xác thực OTP
  useEffect(() => {
    if (!email || !otpVerified) {
      navigate('/auth/forgot-password');
    }
  }, [email, otpVerified, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.password || !formData.confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (formData.password.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setIsLoading(true);

    try {
      // Gọi API đặt lại mật khẩu (giả sử OTP đã được lưu từ trang trước)
      // Trong thực tế, OTP nên được lưu trong state hoặc session
      const otp = '123456'; // TODO: Lấy OTP từ verification step trước đó
      await resetPassword(email!, formData.password, otp);
      
      setIsSuccess(true);
      
      setTimeout(() => {
        navigate('/auth/login/user', {
          state: {
            message: 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập với mật khẩu mới.'
          }
        });
      }, 3000);
      
    } catch (err: any) {
      setError(err.message || 'Không thể đặt lại mật khẩu. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!email || !otpVerified) {
    return null;
  }

  if (isSuccess) {
    return (
      <Layout showHeader={false} showFooter={false}>
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <Link to="/" className="flex items-center justify-center mb-8">
                <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <span className="ml-3 text-2xl font-bold text-gray-900">
                  Top<span className="text-emerald-600">Job</span>
                </span>
              </Link>

              <div className="bg-green-100 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                    <CheckCircleIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-green-800">Thành công!</h3>
                    <p className="text-sm text-green-600">Mật khẩu đã được đặt lại</p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Đặt lại mật khẩu thành công
              </h2>
              <p className="text-gray-600 mb-6">
                Mật khẩu của bạn đã được đặt lại thành công.
              </p>
              
              <div className="text-sm text-gray-500">
                Đang chuyển hướng đến trang đăng nhập...
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showHeader={false} showFooter={false}>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link to="/" className="flex items-center justify-center mb-8">
              <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="ml-3 text-2xl font-bold text-gray-900">
                Top<span className="text-emerald-600">Job</span>
              </span>
            </Link>

            <div className="bg-blue-100 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <LockClosedIcon className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-blue-800">Đặt lại mật khẩu</h3>
                  <p className="text-sm text-blue-600">Tạo mật khẩu mới cho tài khoản</p>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900">
              Tạo mật khẩu mới
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Đặt mật khẩu mới cho tài khoản <span className="font-semibold text-emerald-600">{email}</span>
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center space-x-2">
                  <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu mới *
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Nhập mật khẩu mới"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Xác nhận mật khẩu mới *
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Nhập lại mật khẩu mới"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResetPasswordPage; 
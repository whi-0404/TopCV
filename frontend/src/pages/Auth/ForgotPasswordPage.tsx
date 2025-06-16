import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/layout/Layout';
import { 
  KeyIcon, 
  ArrowLeftIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { sendOTP } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation
    if (!email) {
      setError('Vui lòng nhập email');
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email không hợp lệ');
      setIsLoading(false);
      return;
    }

          try {
        // Gọi API gửi OTP cho forgot password
        await sendOTP(email, 'forgot-password');
      
      setIsSuccess(true);
      
      // Chờ 2 giây rồi chuyển đến trang OTP
      setTimeout(() => {
        navigate('/auth/otp-verification', {
          state: {
            email,
            from: 'forgot-password'
          }
        });
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || 'Không thể gửi mã xác thực. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

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
                    <h3 className="font-semibold text-green-800">Gửi thành công!</h3>
                    <p className="text-sm text-green-600">Mã xác thực đã được gửi</p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Kiểm tra email của bạn
              </h2>
              <p className="text-gray-600 mb-6">
                Chúng tôi đã gửi mã xác thực 6 chữ số đến
                <br />
                <span className="font-semibold text-emerald-600">{email}</span>
              </p>
              
              <div className="text-sm text-gray-500">
                Đang chuyển hướng đến trang xác thực...
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
          {/* Header */}
          <div className="text-center">
            <Link to="/" className="flex items-center justify-center mb-8">
              <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="ml-3 text-2xl font-bold text-gray-900">
                Top<span className="text-emerald-600">Job</span>
              </span>
            </Link>

            <div className="bg-orange-100 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                  <KeyIcon className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-orange-800">Quên mật khẩu</h3>
                  <p className="text-sm text-orange-600">Đặt lại mật khẩu tài khoản</p>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900">
              Quên mật khẩu?
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Không sao cả! Nhập email của bạn và chúng tôi sẽ gửi mã xác thực để đặt lại mật khẩu.
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center space-x-2">
                  <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email đăng nhập *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  placeholder="Nhập email tài khoản của bạn"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang gửi...</span>
                  </div>
                ) : (
                  'Gửi mã xác thực'
                )}
              </button>

              {/* Back to Login */}
              <div className="text-center">
                <Link
                  to="/auth/login/user"
                  className="inline-flex items-center space-x-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  <span>Quay lại đăng nhập</span>
                </Link>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500">
            <p>
              Chưa có tài khoản? {' '}
              <Link to="/auth/register/user" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPasswordPage; 
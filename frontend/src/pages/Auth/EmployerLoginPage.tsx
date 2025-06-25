import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/layout/Layout';
import { EyeIcon, EyeSlashIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

const EmployerLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Kiểm tra thông báo từ OTP verification
  useEffect(() => {
    const state = location.state as { message?: string; email?: string };
    if (state?.message) {
      setSuccessMessage(state.message);
      if (state.email) {
        setFormData(prev => ({ ...prev, email: state.email || '' }));
      }
      // Clear state để tránh hiển thị lại khi refresh
      navigate('/auth/employer/login', { replace: true });
    }
  }, [location.state, navigate]);

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

    try {
      await login(formData.email, formData.password);
      navigate('/'); // Redirect to home page
    } catch (err) {
      setError('Email hoặc mật khẩu không đúng');
    }
  };

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

            {/* Role Indicator */}
            <div className="bg-emerald-100 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                  <BuildingOfficeIcon className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-emerald-800">Nhà tuyển dụng</h3>
                  <p className="text-sm text-emerald-600">Đăng nhập để quản lý tuyển dụng</p>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900">
              Đăng nhập
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Chào mừng nhà tuyển dụng! Hãy đăng nhập để quản lý tin tuyển dụng.
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {successMessage && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-sm">
                  {successMessage}
                </div>
              )}
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  placeholder="Nhập email của bạn"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Nhập mật khẩu"
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

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Ghi nhớ đăng nhập
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/auth/forgot-password"
                    className="font-medium text-emerald-600 hover:text-emerald-500"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>

              <div className="text-center">
                <span className="text-sm text-gray-600">
                  Chưa có tài khoản?{' '}
                  <Link
                    to="/auth/employer/register"
                    className="font-medium text-emerald-600 hover:text-emerald-500"
                  >
                    Đăng ký ngay
                  </Link>
                </span>
              </div>

              <div className="text-center">
                <Link
                  to="/auth"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  ← Chọn loại tài khoản khác
                </Link>
              </div>
            </form>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default EmployerLoginPage; 
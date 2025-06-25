import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/layout/Layout';
import { EyeIcon, EyeSlashIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <Link to="/" className="flex items-center justify-center mb-8">
              <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="ml-3 text-2xl font-bold text-white">
                Top<span className="text-emerald-400">Job</span>
              </span>
            </Link>

            {/* Role Indicator */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                  <ShieldCheckIcon className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-red-400">Quản trị viên</h3>
                  <p className="text-sm text-gray-400">Khu vực quản lý hệ thống</p>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white">
              Admin Login
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Chỉ dành cho quản trị viên hệ thống. Vui lòng đăng nhập để tiếp tục.
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
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
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none placeholder-gray-400"
                  placeholder="Nhập email admin"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
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
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none placeholder-gray-400 pr-12"
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
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-600 bg-gray-700 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                    Ghi nhớ đăng nhập
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập Admin'}
              </button>

              <div className="text-center">
                <Link
                  to="/auth"
                  className="text-sm text-gray-400 hover:text-gray-200"
                >
                  ← Quay về trang chọn tài khoản
                </Link>
              </div>
            </form>
          </div>

          {/* Security Warning */}
          <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <ShieldCheckIcon className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-yellow-200 mb-1">Cảnh báo bảo mật</h3>
                <p className="text-xs text-yellow-300">
                  Khu vực này chỉ dành cho quản trị viên. Mọi hoạt động đều được ghi lại và giám sát.
                </p>
              </div>
            </div>
          </div>

          {/* Demo Account */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Tài khoản demo:</h3>
            <div className="text-xs text-gray-400">
              <p>Email: admin@topjob.com</p>
              <p>Password: 12345678</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminLoginPage; 
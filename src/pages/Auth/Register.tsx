import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Register = () => {
  const [userType, setUserType] = useState('jobseeker');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const name = formData.get('name') as string;
      const email = formData.get('email') as string;
      
      // Giả lập đăng ký thành công
      const userData = {
        id: Date.now(), // Sử dụng timestamp làm id đơn giản
        email: email,
        name: name,
        userType: userType,
        isLoggedIn: true
      };
      
      // Lưu thông tin user vào localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Chuyển về trang chủ
      navigate('/', { state: { visited: true } });
    } catch (error) {
      console.error('Register error:', error);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'rgb(255 255 255 / var(--tw-bg-opacity, 1))' }}>
      {/* Left side - Illustration */}
      <motion.div 
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-3/5 bg-white relative flex items-center justify-center p-16"
      >
        {/* Logo */}
        <Link to="/" className="absolute top-8 left-8 flex items-center gap-2">
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center"
          >
            <span className="text-white font-bold text-sm">T</span>
          </motion.div>
          <motion.span 
            whileHover={{ scale: 1.05 }}
            className="text-xl font-bold text-emerald-700"
          >
            Top<span className="text-emerald-500">Job</span>
          </motion.span>
        </Link>

        {/* Main Illustration */}
        <div className="relative w-full max-w-4xl">
          <img 
            src="/images/job-illustration.png" 
            alt="Job search illustration" 
            className="w-full h-auto"
          />
        </div>
      </motion.div>

      {/* Right side - Form */}
      <motion.div 
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-2/5 bg-white flex items-center justify-center py-12 px-8"
      >
        <div className="w-full max-w-md mx-auto">
          {/* User Type Selection */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-3 mb-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setUserType('jobseeker')}
              className={`px-5 py-2 rounded-lg font-medium transition-colors ${
                userType === 'jobseeker'
                  ? 'bg-emerald-200 text-emerald-700'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              Job Seeker
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setUserType('company')}
              className={`px-5 py-2 rounded-lg font-medium transition-colors ${
                userType === 'company'
                  ? 'bg-emerald-200 text-emerald-700'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              Company
            </motion.button>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-gray-900 mb-2"
          >
            Tạo tài khoản
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 mb-6"
          >
            Hoặc đăng ký với Google
          </motion.p>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg p-3 mb-6 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-gray-700">Đăng ký với Google</span>
          </motion.button>

          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
            onSubmit={handleSubmit}
          >
            <motion.div
              whileHover={{ scale: 1.01 }}
            >
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Nhập họ và tên"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.01 }}
            >
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Nhập vào địa chỉ email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.01 }}
            >
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Nhập mật khẩu"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.01 }}
            >
              <label htmlFor="repeatPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Nhập lại mật khẩu
              </label>
              <input
                type="password"
                id="repeatPassword"
                name="repeatPassword"
                placeholder="Nhập lại mật khẩu"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-emerald-600 text-white rounded-lg p-3 font-medium hover:bg-emerald-700 transition-colors"
            >
              Tiếp tục
            </motion.button>
          </motion.form>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-4 text-sm text-gray-600"
          >
            Bằng cách nhấp vào Tiếp tục, bạn đồng ý với{' '}
            <motion.span whileHover={{ scale: 1.05 }}>
              <Link to="/terms" className="text-emerald-600 hover:text-emerald-700">
                Điều khoản dịch vụ
              </Link>
            </motion.span>{' '}
            và{' '}
            <motion.span whileHover={{ scale: 1.05 }}>
              <Link to="/privacy" className="text-emerald-600 hover:text-emerald-700">
                Chính sách bảo mật
              </Link>
            </motion.span>
            .
          </motion.p>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-6 text-center text-gray-600"
          >
            Đã có tài khoản?{' '}
            <motion.span whileHover={{ scale: 1.05 }}>
              <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Đăng nhập
              </Link>
            </motion.span>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register; 
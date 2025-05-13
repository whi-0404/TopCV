import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthService from '../../services/auth.service';
import { useAuth } from '../../context/AuthContext';
import Alert from '../../components/ui/Alert';

const Login = () => {
  const [userType, setUserType] = useState('jobseeker');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/', { state: { from: '/login' } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập không thành công');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Vui lòng nhập email');
      return;
    }

    setIsLoading(true);
    try {
      await AuthService.sendOtp(email);
      setOtpSent(true);
      setError('');
      setSuccess('Mã OTP đã được gửi đến email của bạn');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể gửi OTP');
      setSuccess('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !otp || !newPassword) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setIsLoading(true);
    try {
      await AuthService.changePassword({ email, otp, newPassword });
      setForgotPassword(false);
      setError('');
      setSuccess('Mật khẩu đã được thay đổi thành công. Vui lòng đăng nhập.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể thay đổi mật khẩu');
      setSuccess('');
    } finally {
      setIsLoading(false);
    }
  };

  if (forgotPassword) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4">
        <Link to="/" className="mb-8 flex items-center gap-2">
          <motion.img 
            whileHover={{ scale: 1.1 }}
            src="/images/logo.svg" 
            alt="TopJob" 
            className="h-8 w-8" 
          />
          <motion.span 
            whileHover={{ scale: 1.05 }}
            className="text-xl font-bold text-emerald-700"
          >
            Top<span className="text-emerald-500">Job</span>
          </motion.span>
        </Link>

        <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Quên mật khẩu</h1>
          
          {error && <Alert type="error" message={error} onClose={() => setError('')} />}
          {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
          
          <form onSubmit={otpSent ? handleChangePassword : handleSendOtp}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={otpSent}
                required
              />
            </div>

            {otpSent && (
              <>
                <div className="mb-4">
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                    Mã OTP
                  </label>
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full bg-emerald-600 text-white rounded-lg p-3 font-medium hover:bg-emerald-700 disabled:bg-emerald-300"
              disabled={isLoading}
            >
              {isLoading ? 'Đang xử lý...' : otpSent ? 'Đổi mật khẩu' : 'Gửi mã OTP'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setForgotPassword(false)}
              className="text-emerald-600 hover:text-emerald-700"
            >
              Quay lại đăng nhập
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Left side - Illustration */}
      <motion.div 
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-1/2 relative flex items-center justify-center"
      >
        <Link to="/" className="absolute top-8 left-8 flex items-center gap-2">
          <motion.img 
            whileHover={{ scale: 1.1 }}
            src="/images/logo.svg" 
            alt="TopJob" 
            className="h-8 w-8" 
          />
          <motion.span 
            whileHover={{ scale: 1.05 }}
            className="text-xl font-bold text-emerald-700"
          >
            Top<span className="text-emerald-500">Job</span>
          </motion.span>
        </Link>
      </motion.div>

      {/* Right side - Form */}
      <motion.div 
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-1 flex items-center justify-center py-12 px-4"
      >
        <div className="w-full max-w-md mx-auto">
          {/* User Type Selection */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-4 mb-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setUserType('jobseeker')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                userType === 'jobseeker'
                  ? 'bg-[#EEF2FF] text-[#4F46E5]'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Job Seeker
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setUserType('company')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                userType === 'company'
                  ? 'bg-[#EEF2FF] text-[#4F46E5]'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Company
            </motion.button>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-[32px] font-bold text-[#1F2937] mb-8"
          >
            Welcome back
          </motion.h1>

          {error && <Alert type="error" message={error} onClose={() => setError('')} />}
          {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
            onSubmit={handleLogin}
          >
            <motion.div
              whileHover={{ scale: 1.01 }}
            >
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.01 }}
            >
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </motion.div>

            <div className="flex items-center justify-between">
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="flex items-center"
            >
              <input
                type="checkbox"
                id="remember"
                name="remember"
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </motion.div>
              
              <button 
                type="button"
                onClick={() => setForgotPassword(true)}
                className="text-sm text-emerald-600 hover:text-emerald-700"
              >
                Quên mật khẩu?
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#9FE2BF] text-emerald-700 rounded-lg p-3 font-medium hover:bg-emerald-200 disabled:bg-gray-200 disabled:text-gray-500"
            >
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </motion.button>
          </motion.form>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center text-gray-600"
          >
            Don't have an account?{' '}
            <motion.span whileHover={{ scale: 1.05 }}>
              <Link to="/register" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Sign up
              </Link>
            </motion.span>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login; 
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { validateEmail } from '../../utils/validators';
import authService from '../../services/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validation = validateEmail(email);

    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    try {
      // Call API to send forgot password OTP
      await authService.forgotPassword(email.trim());
      
      setIsSuccess(true);
      
      // Auto redirect after 3 seconds
      setTimeout(() => {
        navigate('/auth/otp-verification', { 
          state: { 
            email: email.trim(),
            type: 'password-reset'
          }
        });
      }, 3000);
    } catch (error: any) {
      console.error('Forgot password error:', error);
      
      let errorMessage = 'Gửi email khôi phục thất bại. Vui lòng thử lại.';
      
      if (error.message?.includes('USER_NOT_EXISTED')) {
        errorMessage = 'Email không tồn tại trong hệ thống.';
      } else if (error.message?.includes('USER_DEACTIVATED')) {
        errorMessage = 'Tài khoản đã bị vô hiệu hóa.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setErrors([errorMessage]);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
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
              alt="Password reset illustration" 
              className="w-full h-auto"
            />
          </div>
        </motion.div>

        {/* Right side - Success Message */}
        <motion.div 
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-2/5 bg-white flex items-center justify-center py-12 px-8"
        >
          <div className="w-full max-w-md mx-auto text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-bold text-gray-900 mb-4"
            >
              Email Sent Successfully!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-gray-600 mb-6"
            >
              We've sent a password reset link to
              <br />
              <span className="font-medium text-emerald-600">{email}</span>
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-sm text-gray-500 mb-8"
            >
              Redirecting to verification page in 3 seconds...
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/auth/otp-verification', { state: { email: email.trim(), type: 'password-reset' } })}
              className="w-full bg-emerald-600 text-white rounded-lg p-3 font-medium hover:bg-emerald-700 transition-colors"
            >
              Continue to Verification
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

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
            alt="Password reset illustration" 
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </motion.div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Forgot Password?
            </h1>
            
            <p className="text-gray-600">
              No worries! Enter your email address and we'll send you a link to reset your password.
            </p>
          </motion.div>

          {errors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
            >
              <div className="flex">
                <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.08 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <h4 className="text-red-800 font-medium mb-1">Please fix the following errors:</h4>
                  <ul className="text-red-700 text-sm space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <motion.div
              whileHover={{ scale: 1.01 }}
            >
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email address"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 text-white rounded-lg p-4 font-medium hover:bg-emerald-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending reset link...
                </div>
              ) : (
                'Send Reset Link'
              )}
            </motion.button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-600">
              Remember your password?{' '}
              <motion.span whileHover={{ scale: 1.05 }}>
                <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
                  Back to Sign In
                </Link>
              </motion.span>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword; 
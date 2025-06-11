import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { validateOTP } from '../../utils/validators';
import authService from '../../services/authService';

const OtpVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Get email and type from navigation state
  const email = location.state?.email || '';
  const verificationType = location.state?.type || 'email-verification'; // 'email-verification' or 'password-reset'
  const keyRedisToken = location.state?.keyRedisToken || '';

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1 || !/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (errors.length > 0) {
      setErrors([]);
    }

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validation = validateOTP(otp);

    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    try {
      const otpCode = otp.join('');

      if (verificationType === 'password-reset') {
        // Navigate to change password page with OTP and email
        navigate('/auth/change-password', {
          state: {
            email,
            otp: otpCode,
            type: 'reset'
          }
        });
      } else {
        // Email verification
        await authService.verifyEmail({
          keyRedisToken: keyRedisToken,
          otp: otpCode
        });

        // Navigate to login with success message
        navigate('/auth/login', { 
          state: { 
            message: 'Email đã được xác thực thành công! Vui lòng đăng nhập để tiếp tục.',
            type: 'success'
          }
        });
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      
      let errorMessage = 'Mã xác thực không hợp lệ. Vui lòng thử lại.';
      
      if (error.message?.includes('INVALID_OTP')) {
        errorMessage = 'Mã OTP không chính xác.';
      } else if (error.message?.includes('EXPIRED_OTP')) {
        errorMessage = 'Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.';
      } else if (error.message?.includes('TOO_MANY_ATTEMPTS')) {
        errorMessage = 'Quá nhiều lần thử. Vui lòng thử lại sau.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setErrors([errorMessage]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    try {
      if (verificationType === 'password-reset') {
        // Resend forgot password OTP
        await authService.forgotPassword(email);
      } else {
        // For email verification, we can't really resend without going back to registration
        // This would need to be handled differently based on your backend implementation
        setErrors(['Để gửi lại mã xác thực email, vui lòng đăng ký lại.']);
        return;
      }
      
      setCanResend(false);
      setResendTimer(60);
      setErrors([]);
      
      // Show success message
      alert('Mã xác thực đã được gửi lại thành công!');
    } catch (error: any) {
      console.error('Resend error:', error);
      
      let errorMessage = 'Gửi lại mã thất bại. Vui lòng thử lại.';
      if (error.message) {
        errorMessage = error.message;
      }
      
      setErrors([errorMessage]);
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
            alt="Email verification illustration" 
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </motion.div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Verify Your Email
            </h1>
            
            <p className="text-gray-600">
              {verificationType === 'password-reset' 
                ? 'Chúng tôi đã gửi mã xác thực để đặt lại mật khẩu đến'
                : 'Chúng tôi đã gửi mã xác thực 6 chữ số đến'
              }
            </p>
            <p className="text-emerald-600 font-medium">
              {email || 'your.email@example.com'}
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
                  <h4 className="text-red-800 font-medium mb-1">Verification failed:</h4>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                Enter verification code
              </label>
              <div className="flex gap-3 justify-center">
                {otp.map((digit, index) => (
                  <motion.input
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    whileHover={{ scale: 1.05 }}
                    whileFocus={{ scale: 1.08 }}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    maxLength={1}
                  />
                ))}
              </div>
            </div>

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
                  Verifying...
                </div>
              ) : (
                'Verify Email'
              )}
            </motion.button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center"
          >
            <p className="text-gray-600 mb-4">
              Didn't receive the code?
            </p>
            
            {canResend ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleResend}
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Resend code
              </motion.button>
            ) : (
              <p className="text-gray-500">
                Resend code in {resendTimer}s
              </p>
            )}
            
            <p className="mt-6 text-gray-600">
              Need help?{' '}
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

export default OtpVerification; 
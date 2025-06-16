import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/layout/Layout';
import OTPInput from '../../components/common/OTPInput';
import { 
  CheckCircleIcon, 
  ArrowLeftIcon, 
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface LocationState {
  email?: string;
  fullname?: string;
  password?: string;
  role?: 'USER' | 'EMPLOYER';
  from?: string;
  token?: string; // Token từ registration
}

const OTPVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOTP, loading } = useAuth();
  
  const state = location.state as LocationState;
  const { email, fullname, password, role, from, token } = state || {};

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 phút
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Redirect nếu không có thông tin cần thiết
  useEffect(() => {
    if (!email) {
      navigate('/auth/register/user');
    }
  }, [email, navigate]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleOTPComplete = async (otpValue: string) => {
    setOtp(otpValue);
    await handleVerifyOTP(otpValue);
  };

  const handleVerifyOTP = async (otpValue: string = otp) => {
    if (otpValue.length !== 6) {
      setError('Vui lòng nhập đầy đủ mã OTP');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      // Gọi API xác thực OTP với token
      const isValid = await verifyOTP(email!, otpValue, from as 'register' | 'forgot-password', token);
      
      if (isValid) {
        if (from === 'register') {
          // Sau khi verify thành công, điều hướng đến trang đăng nhập
          const loginPath = role === 'EMPLOYER' ? '/auth/employer/login' : '/auth/user/login';
          navigate(loginPath, {
            state: { 
              message: 'Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.',
              email: email 
            }
          });
        } else if (from === 'forgot-password') {
          // Điều hướng đến trang đặt lại mật khẩu
          navigate('/auth/reset-password', {
            state: { email, otpVerified: true }
          });
        }
      } else {
        setError('Mã OTP không chính xác. Vui lòng thử lại.');
      }
    } catch (err) {
      setError('Xác thực OTP thất bại. Vui lòng thử lại.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    setError('');
    
    try {
      // TODO: Gọi API gửi lại OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset countdown
      setCountdown(300);
      setCanResend(false);
      
      // Hiển thị thông báo thành công (có thể dùng toast)
      console.log('OTP đã được gửi lại');
    } catch (err) {
      setError('Không thể gửi lại mã OTP. Vui lòng thử lại.');
    } finally {
      setIsResending(false);
    }
  };

  const getTitle = () => {
    switch (from) {
      case 'register':
        return 'Xác thực tài khoản';
      case 'forgot-password':
        return 'Xác thực đặt lại mật khẩu';
      default:
        return 'Xác thực OTP';
    }
  };

  const getDescription = () => {
    switch (from) {
      case 'register':
        return `Chúng tôi đã gửi mã xác thực đến email ${email}. Vui lòng nhập mã để hoàn tất đăng ký.`;
      case 'forgot-password':
        return `Chúng tôi đã gửi mã xác thực đến email ${email}. Vui lòng nhập mã để tiếp tục đặt lại mật khẩu.`;
      default:
        return `Chúng tôi đã gửi mã xác thực đến email ${email}. Vui lòng nhập mã để xác thực.`;
    }
  };

  const getBackPath = () => {
    if (from === 'forgot-password') {
      return '/auth/forgot-password';
    }
    
    // For registration, return to appropriate registration page based on role
    if (role === 'EMPLOYER') {
      return '/auth/employer/register';
    }
    
    return '/auth/user/register';
  };

  const handleGoBack = () => {
    const backPath = getBackPath();
    
    if (from === 'register') {
      // Pass back the registration data to preserve form state
      navigate(backPath, {
        state: {
          email,
          fullname,
          password,
          role
        }
      });
    } else {
      // For forgot-password, just navigate back normally
      navigate(backPath);
    }
  };

  if (!email) {
    return null; // Sẽ được redirect bởi useEffect
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

            <div className="bg-emerald-100 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                  <CheckCircleIcon className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-emerald-800">{getTitle()}</h3>
                  <p className="text-sm text-emerald-600">Bước cuối để hoàn tất</p>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900">
              Nhập mã xác thực
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {getDescription()}
            </p>
          </div>

          {/* OTP Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center space-x-2">
                  <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* OTP Input */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 text-center">
                  Mã xác thực (6 chữ số)
                </label>
                <OTPInput
                  length={6}
                  onComplete={handleOTPComplete}
                  onOTPChange={setOtp}
                  disabled={isVerifying}
                  error={!!error}
                />
              </div>

              {/* Countdown và Resend */}
              <div className="text-center space-y-4">
                {!canResend ? (
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <ClockIcon className="h-4 w-4" />
                    <span>Gửi lại mã sau {formatTime(countdown)}</span>
                  </div>
                ) : (
                  <button
                    onClick={handleResendOTP}
                    disabled={isResending}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium disabled:opacity-50"
                  >
                    {isResending ? 'Đang gửi...' : 'Gửi lại mã xác thực'}
                  </button>
                )}
              </div>

              {/* Verify Button */}
              <button
                onClick={() => handleVerifyOTP()}
                disabled={otp.length !== 6 || isVerifying}
                className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isVerifying ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang xác thực...</span>
                  </div>
                ) : (
                  'Xác thực'
                )}
              </button>

              {/* Back Link */}
              <div className="text-center">
                <button
                  onClick={handleGoBack}
                  className="inline-flex items-center space-x-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  <span>Quay lại</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500">
            <p>
              Gặp vấn đề? {' '}
              <Link to="/contact" className="text-emerald-600 hover:text-emerald-700">
                Liên hệ hỗ trợ
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OTPVerificationPage; 
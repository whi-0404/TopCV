import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthService from '../../services/auth.service';
import { UserType } from '../../config';
import Alert from '../../components/ui/Alert';

const Register = () => {
  const [userType, setUserType] = useState('jobseeker');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const registerData = {
        email,
        password,
        userTypeId: userType === 'jobseeker' ? UserType.SEEKER : UserType.COMPANY,
        dateOfBirth: dateOfBirth || undefined,
        gender: gender || undefined,
        contactNumber: contactNumber || undefined,
        userImage: '',
        firstName: userType === 'jobseeker' ? firstName : undefined,
        lastName: userType === 'jobseeker' ? lastName : undefined,
        companyName: userType === 'company' ? companyName : undefined,
        companyEmail: userType === 'company' ? email : undefined,
      };

      await AuthService.register(registerData);
      setSuccess('Đăng ký thành công! Vui lòng đăng nhập.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng ký không thành công');
    } finally {
      setIsLoading(false);
    }
  };

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
            Create an account
          </motion.h1>

          {error && <Alert type="error" message={error} onClose={() => setError('')} />}
          {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
            onSubmit={handleRegister}
          >
            {userType === 'jobseeker' ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <motion.div whileHover={{ scale: 1.01 }}>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter first name"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.01 }}>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter last name"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </motion.div>
                </div>
              </>
            ) : (
              <motion.div whileHover={{ scale: 1.01 }}>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
              </label>
              <input
                type="text"
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter company name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
              />
            </motion.div>
            )}

            <motion.div whileHover={{ scale: 1.01 }}>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </motion.div>

            <motion.div whileHover={{ scale: 1.01 }}>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              <motion.div whileHover={{ scale: 1.01 }}>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </motion.div>
              <motion.div whileHover={{ scale: 1.01 }}>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </motion.div>
            </div>

            <motion.div whileHover={{ scale: 1.01 }}>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number
              </label>
              <input
                type="tel"
                id="contactNumber"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="Enter contact number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#9FE2BF] text-emerald-700 rounded-lg p-3 font-medium hover:bg-emerald-200 disabled:bg-gray-200 disabled:text-gray-500"
            >
              {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
            </motion.button>
          </motion.form>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-sm text-gray-600"
          >
            By clicking Continue, you agree to our{' '}
            <motion.span whileHover={{ scale: 1.05 }}>
              <Link to="/terms" className="text-emerald-600 hover:text-emerald-700">
                Terms of Service
              </Link>
            </motion.span>{' '}
            and{' '}
            <motion.span whileHover={{ scale: 1.05 }}>
              <Link to="/privacy" className="text-emerald-600 hover:text-emerald-700">
                Privacy Policy
              </Link>
            </motion.span>
            .
          </motion.p>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center text-gray-600"
          >
            Already have an account?{' '}
            <motion.span whileHover={{ scale: 1.05 }}>
              <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Sign in
              </Link>
            </motion.span>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register; 
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

interface RoleSelectionProps {
  type?: 'login' | 'register';
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ type = 'login' }) => {
  const title = type === 'login' ? 'Choose Login Type' : 'Choose Registration Type';
  const subtitle = type === 'login' 
    ? 'Select your account type to continue' 
    : 'Select your account type to get started';

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Job illustration */}
      <div className="hidden lg:flex lg:w-3/5 bg-white relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src="/images/job-illustration.png"
            alt="Job illustration"
            className="max-w-full max-h-full object-contain"
          />
        </div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-green-600/10"></div>
      </div>

      {/* Right side - Role selection */}
      <div className="w-full lg:w-2/5 flex flex-col justify-center px-8 sm:px-12 lg:px-16 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto w-full"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {title}
            </h1>
            <p className="text-gray-600">
              {subtitle}
            </p>
          </div>

          {/* Role Cards */}
          <div className="space-y-4">
            {/* Job Seeker Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group"
            >
              <Link
                to={type === 'login' ? '/auth/jobseeker/login' : '/auth/jobseeker/register'}
                className="block p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50/50 transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <UserIcon className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Job Seeker
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Looking for your dream job and career opportunities
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Company Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group"
            >
              <Link
                to={type === 'login' ? '/auth/company/login' : '/auth/company/register'}
                className="block p-6 border-2 border-gray-200 rounded-xl hover:border-teal-500 hover:bg-teal-50/50 transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center group-hover:bg-teal-200 transition-colors">
                      <BuildingOfficeIcon className="w-6 h-6 text-teal-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Company
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Post jobs and find the best talent for your company
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-teal-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Switch between login/register */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-center mb-12"
          >
            <p className="text-gray-600">
              {type === 'login' ? "Don't have an account? " : "Already have an account? "}
              <Link
                to={type === 'login' ? '/auth/register' : '/auth/login'}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                {type === 'login' ? 'Sign up' : 'Sign in'}
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default RoleSelection; 
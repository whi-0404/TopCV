import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Mock user data for testing based on current route
    if (location.pathname.includes('/user/')) {
      setUser({
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@email.com',
        userType: 'jobseeker'
      });
    } else if (location.pathname.includes('/company/')) {
      setUser({
        name: 'TechCorp Vietnam',
        email: 'hr@techcorp.vn',
        userType: 'company'
      });
    } else {
      // Check localStorage for actual authentication
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/images/download.jpg" alt="TopJob" className="h-8 w-auto" />
            <span className="text-xl font-bold" style={{ color: '#3C7363' }}>Top<span style={{ color: '#84D9B3' }}>Job</span></span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/jobs" 
              className={`relative text-gray-700 hover:text-emerald-600 transition-colors ${
                isActive('/jobs') ? 'text-emerald-600 font-medium' : ''
              }`}
            >
              Jobs
              {isActive('/jobs') && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald-600"
                  initial={false}
                />
              )}
            </Link>
            <Link 
              to="/companies" 
              className={`relative text-gray-700 hover:text-emerald-600 transition-colors ${
                isActive('/companies') ? 'text-emerald-600 font-medium' : ''
              }`}
            >
              IT Companies
              {isActive('/companies') && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald-600"
                  initial={false}
                />
              )}
            </Link>

            <Link 
              to="/blog" 
              className={`relative text-gray-700 hover:text-emerald-600 transition-colors ${
                isActive('/blog') ? 'text-emerald-600 font-medium' : ''
              }`}
            >
              IT Blog
              {isActive('/blog') && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald-600"
                  initial={false}
                />
              )}
            </Link>
            <Link 
              to="/contact" 
              className={`relative text-gray-700 hover:text-emerald-600 transition-colors ${
                isActive('/contact') ? 'text-emerald-600 font-medium' : ''
              }`}
            >
              Contact
              {isActive('/contact') && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald-600"
                  initial={false}
                />
              )}
            </Link>
          </nav>

          {/* Desktop Auth Buttons or User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                {/* Notification and Message Icons */}
                <div className="flex items-center gap-2">
                  {/* Notification Bell */}
                  <button className="relative group">
                    <div className="w-11 h-11 bg-emerald-50 rounded-full flex items-center justify-center hover:bg-emerald-100 transition-colors border border-emerald-100">
                      <svg className="w-5 h-5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                      </svg>
                      {/* Notification badge */}
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-medium">3</span>
                      </span>
                    </div>
                  </button>

                  {/* Message/Chat Icon */}
                  <button className="relative group">
                    <div className="w-11 h-11 bg-emerald-50 rounded-full flex items-center justify-center hover:bg-emerald-100 transition-colors border border-emerald-100">
                      <svg className="w-5 h-5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {/* Message badge */}
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-medium">2</span>
                      </span>
                    </div>
                  </button>
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-100"
                  >
                    <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.userType === 'jobseeker' ? 'Job Seeker' : 'Company'}</p>
                    </div>
                    <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      
                      <div className="py-2">
                        {user.userType === 'jobseeker' ? (
                          <>
                            <Link
                              to="/user/dashboard"
                              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v.586a1 1 0 01-.293.707L13.414 8.5a1 1 0 00-.707-.293H7z" />
                              </svg>
                              Dashboard
                            </Link>
                            <Link
                              to="/user/applications"
                              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              My Applications
                            </Link>
                            <Link
                              to="/user/favorites"
                              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                              Saved Jobs
                            </Link>
                            <Link
                              to="/user/messages"
                              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                              </svg>
                              Messages
                            </Link>
                            <Link
                              to="/user/profile"
                              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              Profile
                            </Link>
                            <Link
                              to="/user/settings"
                              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              Settings
                            </Link>
                          </>
                        ) : (
                          <>
                            <Link
                              to="/company/dashboard"
                              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v.586a1 1 0 01-.293.707L13.414 8.5a1 1 0 00-.707-.293H7z" />
                              </svg>
                              Dashboard
                            </Link>
                            <Link
                              to="/company/jobs"
                              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8z" />
                              </svg>
                              My Jobs
                            </Link>
                            <Link
                              to="/company/candidates"
                              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                              </svg>
                              Candidates
                            </Link>
                            <Link
                              to="/company/messages"
                              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                              </svg>
                              Messages
                            </Link>
                            <Link
                              to="/company/profile"
                              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              Company Profile
                            </Link>
                            <Link
                              to="/company/settings"
                              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              Settings
                            </Link>
                          </>
                        )}
                      </div>
                      
                      <div className="border-t border-gray-100 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isActive('/login') ? 'bg-emerald-100 text-emerald-700' : 'text-gray-700 hover:text-emerald-600'
                  }`}
                >
                  Sign in
                </Link>
                <Link 
                  to="/register" 
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isActive('/register') ? 'bg-emerald-600 text-white' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-4"
          >
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/jobs" 
                className={`text-gray-700 hover:text-emerald-600 transition-colors ${
                  isActive('/jobs') ? 'text-emerald-600 font-medium' : ''
                }`}
              >
                Jobs
              </Link>
              <Link 
                to="/companies" 
                className={`text-gray-700 hover:text-emerald-600 transition-colors ${
                  isActive('/companies') ? 'text-emerald-600 font-medium' : ''
                }`}
              >
                IT Companies
              </Link>
              <Link 
                to="/blog" 
                className={`text-gray-700 hover:text-emerald-600 transition-colors ${
                  isActive('/blog') ? 'text-emerald-600 font-medium' : ''
                }`}
              >
                IT Blog
              </Link>
              <Link 
                to="/contact" 
                className={`text-gray-700 hover:text-emerald-600 transition-colors ${
                  isActive('/contact') ? 'text-emerald-600 font-medium' : ''
                }`}
              >
                Contact
              </Link>
            </nav>
            {user ? (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3 px-4 py-2 mb-2">
                  <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.userType}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {user.userType === 'jobseeker' ? (
                    <>
                      <Link 
                        to="/user/dashboard" 
                        className="block px-4 py-2 text-gray-700 hover:text-emerald-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link 
                        to="/user/applications" 
                        className="block px-4 py-2 text-gray-700 hover:text-emerald-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Applications
                      </Link>
                      <Link 
                        to="/user/favorites" 
                        className="block px-4 py-2 text-gray-700 hover:text-emerald-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Saved Jobs
                      </Link>
                      <Link 
                        to="/user/messages" 
                        className="block px-4 py-2 text-gray-700 hover:text-emerald-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Messages
                      </Link>
                      <Link 
                        to="/user/settings" 
                        className="block px-4 py-2 text-gray-700 hover:text-emerald-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Settings
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link 
                        to="/company/dashboard" 
                        className="block px-4 py-2 text-gray-700 hover:text-emerald-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link 
                        to="/company/jobs" 
                        className="block px-4 py-2 text-gray-700 hover:text-emerald-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Jobs
                      </Link>
                      <Link 
                        to="/company/candidates" 
                        className="block px-4 py-2 text-gray-700 hover:text-emerald-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Candidates
                      </Link>
                      <Link 
                        to="/company/messages" 
                        className="block px-4 py-2 text-gray-700 hover:text-emerald-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Messages
                      </Link>
                      <Link 
                        to="/company/profile" 
                        className="block px-4 py-2 text-gray-700 hover:text-emerald-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Company Profile
                      </Link>
                      <Link 
                        to="/company/settings" 
                        className="block px-4 py-2 text-gray-700 hover:text-emerald-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Settings
                      </Link>
                    </>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:text-red-700"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                <Link 
                  to="/login" 
                  className={`block px-4 py-2 rounded-lg font-medium transition-colors ${
                    isActive('/login') ? 'bg-emerald-100 text-emerald-700' : 'text-gray-700 hover:text-emerald-600'
                  }`}
                >
                  Sign in
                </Link>
                <Link 
                  to="/register" 
                  className={`block px-4 py-2 rounded-lg font-medium transition-colors ${
                    isActive('/register') ? 'bg-emerald-600 text-white' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  Sign up
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header; 
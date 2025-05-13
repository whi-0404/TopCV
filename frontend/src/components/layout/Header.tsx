import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
// import defaultAvatar from '../../assets/images/default-avatar.png';

const Header: React.FC = () => {
  const { currentUser, isLoggedIn, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // URL của avatar mặc định
  const defaultAvatar = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowDropdown(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/images/download.jpg" alt="TopJob" className="h-8 w-auto" />
            <span className="text-xl font-bold" style={{ color: '#2F855A' }}>Top<span style={{ color: '#48BB78' }}>Job</span></span>
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
              to="/companies/search" 
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
              to="/resume" 
              className={`relative text-gray-700 hover:text-emerald-600 transition-colors ${
                isActive('/resume') ? 'text-emerald-600 font-medium' : ''
              }`}
            >
              Resume & CV
              {isActive('/resume') && (
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

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center focus:outline-none"
                >
                  <img 
                    src={currentUser?.userImage || defaultAvatar} 
                    alt="Profile" 
                    className="h-10 w-10 rounded-full object-cover border-2 border-emerald-500"
                  />
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg py-2 z-10 border border-gray-200">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center">
                        <img 
                          src={currentUser?.userImage || defaultAvatar} 
                          alt="Profile" 
                          className="h-12 w-12 rounded-full object-cover border-2 border-emerald-500"
                        />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-700">
                            {currentUser?.firstName} {currentUser?.lastName}
                          </p>
                          <p className="text-xs text-gray-500">
                            Tài khoản đã xác thực
                          </p>
                          <p className="text-xs text-gray-500">
                            ID {currentUser?.userId} | {currentUser?.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="py-1">
                      <Link 
                        to="/job-matches"
                        className="px-4 py-2 flex items-center text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        <span className="text-emerald-600">Việc làm phù hợp với bạn</span>
                      </Link>
                      <Link 
                        to="/job-alerts"
                        className="px-4 py-2 flex items-center text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        <span>Cài đặt gợi ý việc làm</span>
                      </Link>
                    </div>

                    <div className="py-1 border-t border-gray-100">
                      <Link 
                        to="/profile/cv"
                        className="px-4 py-2 flex items-center justify-between text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        <span>Quản lý CV & Cover letter</span>
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>

                    <div className="py-1 border-t border-gray-100">
                      <Link 
                        to="/profile/cv"
                        className="px-4 py-3 flex items-center text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        <span>CV của tôi</span>
                      </Link>
                    </div>

                    <div className="py-1 border-t border-gray-100">
                      <Link 
                        to="/profile/cover-letter"
                        className="px-4 py-3 flex items-center text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        <span>Cover Letter của tôi</span>
                      </Link>
                    </div>

                    <div className="py-1 border-t border-gray-100">
                      <Link 
                        to="/profile/applications"
                        className="px-4 py-3 flex items-center text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        <span>Nhà tuyển dụng xem hồ sơ</span>
                      </Link>
                    </div>

                    <div className="py-1 border-t border-gray-100">
                      <Link 
                        to="/profile/notifications"
                        className="px-4 py-2 flex items-center justify-between text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        <span>Cài đặt email & thông báo</span>
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>

                    <div className="py-1 border-t border-gray-100">
                      <Link 
                        to="/profile/security"
                        className="px-4 py-2 flex items-center justify-between text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        <span>Cá nhân & Bảo mật</span>
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>

                    <div className="py-1 border-t border-gray-100">
                      <Link 
                        to="/profile/upgrade"
                        className="px-4 py-2 flex items-center justify-between text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        <span>Nâng cấp tài khoản</span>
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>

                    <div className="py-1 border-t border-gray-100">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 flex items-center text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <svg className="mr-2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                )}
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
                to="/companies/search" 
                className={`text-gray-700 hover:text-emerald-600 transition-colors ${
                  isActive('/companies') ? 'text-emerald-600 font-medium' : ''
                }`}
              >
                IT Companies
              </Link>
              <Link 
                to="/resume" 
                className={`text-gray-700 hover:text-emerald-600 transition-colors ${
                  isActive('/resume') ? 'text-emerald-600 font-medium' : ''
                }`}
              >
                Resume & CV
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
            <div className="mt-4 space-y-2">
              {isLoggedIn ? (
                <>
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
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header; 
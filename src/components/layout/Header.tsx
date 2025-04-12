import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

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
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header; 
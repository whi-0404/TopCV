import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Predefined admin accounts for demo
  const adminAccounts = [
    { email: 'admin@topcv.com', password: 'admin123', name: 'System Admin' },
    { email: 'superadmin@topcv.com', password: 'super123', name: 'Super Admin' },
    { email: 'moderator@topcv.com', password: 'mod123', name: 'Moderator' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateAdminCredentials = (email: string, password: string) => {
    return adminAccounts.find(admin => 
      admin.email === email && admin.password === password
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError('');
    
    // Simulate API call with validation
    setTimeout(() => {
      const admin = validateAdminCredentials(formData.email, formData.password);
      
      if (admin) {
        // Create admin session
        const userData = {
          id: Date.now(),
          email: admin.email,
          name: admin.name,
          userType: 'admin',
          isLoggedIn: true,
          permissions: ['all'],
          loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('adminSession', 'true');
        
        setIsLoading(false);
        // Redirect to admin dashboard
        navigate('/admin/dashboard', { replace: true });
      } else {
        setIsLoading(false);
        setError('Invalid admin credentials. Access denied.');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheckIcon className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              TopJob Admin Portal
            </h1>
            <p className="text-gray-600 text-sm">
              Secure access for authorized administrators only
            </p>
          </div>

          {/* Admin Demo Accounts */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Demo Admin Accounts:</h3>
            <div className="space-y-1 text-xs text-blue-800">
              <div>📧 admin@topcv.com | 🔑 admin123</div>
              <div>📧 superadmin@topcv.com | 🔑 super123</div>
              <div>📧 moderator@topcv.com | 🔑 mod123</div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6"
            >
              <p className="text-sm text-red-800">{error}</p>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Admin Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm"
                placeholder="admin@topcv.com"
                disabled={isLoading}
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors pr-12 text-sm"
                  placeholder="Enter admin password"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <ShieldCheckIcon className="w-5 h-5 text-amber-600 mt-0.5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-amber-800">
                    <strong>Security Notice:</strong> This area is restricted to authorized administrators only. All login attempts are logged and monitored.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 active:bg-green-800'
              } text-white focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Authenticating...
                </div>
              ) : (
                <>
                  <ShieldCheckIcon className="w-5 h-5 mr-2 inline" />
                  Access Admin Portal
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-3">
                Need administrator access? Contact system administrator
              </p>
              <div className="space-y-1 text-xs text-gray-400">
                <p>📧 tech-support@topcv.com</p>
                <p>📞 +84 123 456 789 (ext. 100)</p>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <Link
                to="/"
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                ← Back to TopJob Homepage
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
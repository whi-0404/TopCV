import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UsersIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  EyeIcon,
  StarIcon,
  ChartBarIcon,
  BellIcon,
  CogIcon
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 1250,
    totalCompanies: 85,
    totalJobs: 342,
    totalApplications: 2140,
    totalJobViews: 15640,
    totalReviews: 186,
    activeNotifications: 12,
    monthlyGrowth: {
      users: 12.5,
      companies: 8.3,
      jobs: 15.7,
      applications: 22.1
    }
  });

  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);

  const recentNotifications = [
    { id: 1, title: 'System Maintenance', message: 'Scheduled maintenance tonight', time: '5 min ago', type: 'warning' },
    { id: 2, title: 'New Company Registration', message: 'Tech Innovations Ltd registered', time: '15 min ago', type: 'info' },
    { id: 3, title: 'Security Alert', message: 'Multiple failed login attempts', time: '1 hour ago', type: 'error' }
  ];

  // Admin authentication check
  useEffect(() => {
    const checkAdminAuth = () => {
      const user = localStorage.getItem('user');
      const adminSession = localStorage.getItem('adminSession');
      
      if (!user || !adminSession) {
        // Redirect to admin login if not authenticated
        navigate('/admin/login', { replace: true });
        return;
      }

      try {
        const userData = JSON.parse(user);
        if (userData.userType !== 'admin') {
          // Redirect if not admin user
          navigate('/admin/login', { replace: true });
          return;
        }
      } catch (error) {
        navigate('/admin/login', { replace: true });
        return;
      }
    };

    checkAdminAuth();
  }, [navigate]);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.notification-dropdown')) {
        setShowNotificationDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('adminSession');
    navigate('/admin/login', { replace: true });
  };

  const quickActions = [
    { name: 'Manage Users', icon: UsersIcon, href: '/admin/users', color: 'blue' },
    { name: 'Manage Companies', icon: BuildingOfficeIcon, href: '/admin/companies', color: 'teal' },
    { name: 'Manage Jobs', icon: BriefcaseIcon, href: '/admin/jobs', color: 'purple' },
    { name: 'View Applications', icon: DocumentTextIcon, href: '/admin/applications', color: 'orange' },
    { name: 'Analytics', icon: ChartBarIcon, href: '/admin/analytics', color: 'red' },
    { name: 'Notifications', icon: BellIcon, href: '/admin/notifications', color: 'indigo' },
    { name: 'System Settings', icon: CogIcon, href: '/admin/settings', color: 'gray' }
  ];

  const recentActivities = [
    { id: 1, type: 'user_register', message: 'New user registered: john.doe@email.com', time: '5 minutes ago' },
    { id: 2, type: 'company_register', message: 'TechCorp registered as new company', time: '12 minutes ago' },
    { id: 3, type: 'job_posted', message: 'New job posted: Senior React Developer', time: '25 minutes ago' },
    { id: 4, type: 'application_submitted', message: '15 new applications received', time: '1 hour ago' },
    { id: 5, type: 'review_posted', message: 'New company review posted for ABC Ltd.', time: '2 hours ago' }
  ];

  const StatCard = ({ title, value, icon: Icon, change, color }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value.toLocaleString()}</p>
          {change && (
            <p className={`text-sm mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '+' : ''}{change}% from last month
            </p>
          )}
        </div>
        <div className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">TopJob Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, Administrator</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button 
                  onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                  className="relative p-2 text-gray-400 hover:text-gray-500 transition-colors"
                  title="View Notifications"
                >
                  <BellIcon className="w-6 h-6" />
                  {stats.activeNotifications > 0 && (
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
                  )}
                </button>
                
                {/* Notification Dropdown */}
                {showNotificationDropdown && (
                  <div className="notification-dropdown absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900">Recent Notifications</h3>
                        <button 
                          onClick={() => navigate('/admin/notifications')}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          View All
                        </button>
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {recentNotifications.map((notification) => (
                        <div key={notification.id} className="p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                          <div className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notification.type === 'error' ? 'bg-red-400' :
                              notification.type === 'warning' ? 'bg-yellow-400' :
                              'bg-blue-400'
                            }`}></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                              <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 bg-gray-50 text-center">
                      <button 
                        onClick={() => navigate('/admin/notifications')}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Manage All Notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Sign Out
              </button>
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">A</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={UsersIcon}
            change={stats.monthlyGrowth.users}
            color="green"
          />
          <StatCard
            title="Total Companies"
            value={stats.totalCompanies}
            icon={BuildingOfficeIcon}
            change={stats.monthlyGrowth.companies}
            color="teal"
          />
          <StatCard
            title="Active Jobs"
            value={stats.totalJobs}
            icon={BriefcaseIcon}
            change={stats.monthlyGrowth.jobs}
            color="green"
          />
          <StatCard
            title="Applications"
            value={stats.totalApplications}
            icon={DocumentTextIcon}
            change={stats.monthlyGrowth.applications}
            color="green"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Job Views"
            value={stats.totalJobViews}
            icon={EyeIcon}
            color="indigo"
          />
          <StatCard
            title="Company Reviews"
            value={stats.totalReviews}
            icon={StarIcon}
            color="yellow"
          />
          <StatCard
            title="Notifications"
            value={stats.activeNotifications}
            icon={BellIcon}
            color="red"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <motion.a
                    key={action.name}
                    href={action.href}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className={`w-10 h-10 bg-${action.color}-100 rounded-lg flex items-center justify-center mr-3`}>
                      <action.icon className={`w-5 h-5 text-${action.color}-600`} />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      {action.name}
                    </span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
                <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50"
                  >
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Platform Analytics</h3>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option>Last 30 days</option>
                <option>Last 3 months</option>
                <option>Last year</option>
              </select>
            </div>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Charts will be implemented here</p>
                <p className="text-sm text-gray-400 mt-1">Integration with Chart.js or Recharts</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
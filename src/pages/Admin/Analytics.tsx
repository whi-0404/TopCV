import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  ArrowPathIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UsersIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  EyeIcon,
  CalendarDaysIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const Analytics: React.FC = () => {
  const navigate = useNavigate();
  
  // Analytics data
  const [analytics, setAnalytics] = useState({
    overview: {
      totalUsers: 1250,
      totalCompanies: 85,
      totalJobs: 342,
      totalApplications: 2140,
      totalViews: 15640,
      totalReviews: 186
    },
    growth: {
      users: { current: 1250, previous: 1115, percentage: 12.1 },
      companies: { current: 85, previous: 78, percentage: 9.0 },
      jobs: { current: 342, previous: 295, percentage: 15.9 },
      applications: { current: 2140, previous: 1753, percentage: 22.1 }
    },
    topCompanies: [
      { id: 1, name: 'TechCorp Vietnam', jobs: 15, applications: 234, rating: 4.5 },
      { id: 2, name: 'StartupHub', jobs: 8, applications: 156, rating: 4.2 },
      { id: 3, name: 'Digital Solutions Ltd', jobs: 12, applications: 98, rating: 3.8 },
      { id: 4, name: 'Innovation Labs', jobs: 6, applications: 87, rating: 4.7 },
      { id: 5, name: 'CodeCraft Studio', jobs: 9, applications: 76, rating: 4.1 }
    ],
    topJobs: [
      { id: 1, title: 'Senior React Developer', company: 'TechCorp Vietnam', applications: 45, views: 1250 },
      { id: 2, title: 'Full Stack Developer', company: 'StartupHub', applications: 38, views: 980 },
      { id: 3, title: 'DevOps Engineer', company: 'Digital Solutions Ltd', applications: 32, views: 875 },
      { id: 4, title: 'UI/UX Designer', company: 'Innovation Labs', applications: 28, views: 743 },
      { id: 5, title: 'Data Scientist', company: 'CodeCraft Studio', applications: 25, views: 698 }
    ],
    recentActivity: [
      { type: 'application', message: '15 new applications submitted today', count: 15, trend: 'up' },
      { type: 'job', message: '3 new jobs posted today', count: 3, trend: 'up' },
      { type: 'user', message: '8 new users registered today', count: 8, trend: 'up' },
      { type: 'company', message: '1 new company registered today', count: 1, trend: 'stable' },
      { type: 'review', message: '12 new company reviews this week', count: 12, trend: 'up' }
    ],
    timeframes: {
      daily: { applications: 45, views: 1234, registrations: 8 },
      weekly: { applications: 312, views: 8765, registrations: 56 },
      monthly: { applications: 1340, views: 35420, registrations: 245 }
    }
  });

  const [selectedTimeframe, setSelectedTimeframe] = useState('monthly');

  // Admin authentication check
  useEffect(() => {
    const checkAdminAuth = () => {
      const user = localStorage.getItem('user');
      const adminSession = localStorage.getItem('adminSession');
      
      if (!user || !adminSession) {
        navigate('/admin/login', { replace: true });
        return;
      }

      try {
        const userData = JSON.parse(user);
        if (userData.userType !== 'admin') {
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

  const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
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
            <div className="flex items-center mt-2">
              {change.percentage >= 0 ? (
                <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <ArrowTrendingDownIcon className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${change.percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change.percentage >= 0 ? '+' : ''}{change.percentage}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last period</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </motion.div>
  );

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <StarIcon
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <ChartBarIcon className="w-8 h-8 text-red-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-sm text-gray-500">Platform insights and statistics</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <ArrowPathIcon className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={analytics.overview.totalUsers}
            change={analytics.growth.users}
            icon={UsersIcon}
            color="blue"
          />
          <StatCard
            title="Total Companies"
            value={analytics.overview.totalCompanies}
            change={analytics.growth.companies}
            icon={BuildingOfficeIcon}
            color="teal"
          />
          <StatCard
            title="Active Jobs"
            value={analytics.overview.totalJobs}
            change={analytics.growth.jobs}
            icon={BriefcaseIcon}
            color="purple"
          />
          <StatCard
            title="Applications"
            value={analytics.overview.totalApplications}
            change={analytics.growth.applications}
            icon={EyeIcon}
            color="orange"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Total Page Views</h3>
              <EyeIcon className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{analytics.overview.totalViews.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">All time views across platform</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Company Reviews</h3>
              <StarIcon className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{analytics.overview.totalReviews}</p>
            <p className="text-sm text-gray-500 mt-1">Total reviews submitted</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Companies */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Top Companies</h3>
              <BuildingOfficeIcon className="w-6 h-6 text-gray-400" />
            </div>
            <div className="space-y-4">
              {analytics.topCompanies.map((company, index) => (
                <div key={company.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-sm font-medium text-teal-600">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{company.name}</p>
                      <div className="flex items-center mt-1">
                        <div className="flex mr-2">
                          {renderStars(company.rating)}
                        </div>
                        <span className="text-xs text-gray-500">{company.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{company.jobs} jobs</p>
                    <p className="text-xs text-gray-500">{company.applications} applications</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Jobs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Most Popular Jobs</h3>
              <BriefcaseIcon className="w-6 h-6 text-gray-400" />
            </div>
            <div className="space-y-4">
              {analytics.topJobs.map((job, index) => (
                <div key={job.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-sm font-medium text-purple-600">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{job.title}</p>
                      <p className="text-xs text-gray-500">{job.company}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{job.applications} apps</p>
                    <p className="text-xs text-gray-500">{job.views} views</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <CalendarDaysIcon className="w-6 h-6 text-gray-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.recentActivity.map((activity, index) => (
              <div key={index} className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-gray-900">{activity.count}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.trend === 'up' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {activity.trend === 'up' ? (
                      <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />
                    ) : (
                      <ArrowTrendingDownIcon className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{activity.message}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Charts Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Platform Trends</h3>
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option>Last 30 days</option>
              <option>Last 3 months</option>
              <option>Last year</option>
            </select>
          </div>
          <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <ChartBarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-600 mb-2">Charts Coming Soon</h4>
              <p className="text-sm text-gray-500 max-w-md">
                Interactive charts showing user growth, job posting trends, application rates, and company engagement metrics will be implemented here.
              </p>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-white rounded-lg border">
                  <p className="text-lg font-semibold text-blue-600">{analytics.timeframes[selectedTimeframe as keyof typeof analytics.timeframes].applications}</p>
                  <p className="text-xs text-gray-500">Applications</p>
                </div>
                <div className="p-3 bg-white rounded-lg border">
                  <p className="text-lg font-semibold text-green-600">{analytics.timeframes[selectedTimeframe as keyof typeof analytics.timeframes].views.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Page Views</p>
                </div>
                <div className="p-3 bg-white rounded-lg border">
                  <p className="text-lg font-semibold text-purple-600">{analytics.timeframes[selectedTimeframe as keyof typeof analytics.timeframes].registrations}</p>
                  <p className="text-xs text-gray-500">New Users</p>
                </div>
                <div className="p-3 bg-white rounded-lg border">
                  <p className="text-lg font-semibold text-orange-600">
                    {Math.round((analytics.timeframes[selectedTimeframe as keyof typeof analytics.timeframes].applications / analytics.timeframes[selectedTimeframe as keyof typeof analytics.timeframes].views) * 100)}%
                  </p>
                  <p className="text-xs text-gray-500">Conversion</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics; 
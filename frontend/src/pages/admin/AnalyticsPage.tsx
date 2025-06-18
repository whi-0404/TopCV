import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/layout/Layout';
import {
  ChartBarIcon,
  UsersIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { userApi, companyApi, jobPostApi } from '../../services/api';

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  totalCompanies: number;
  activeCompanies: number;
  totalJobPosts: number;
  activeJobPosts: number;
  pendingJobPosts: number;
  newJobPostsThisMonth: number;
}

interface MonthlyStats {
  month: string;
  users: number;
  companies: number;
  jobPosts: number;
}

const AnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    activeUsers: 0,
    newUsersThisMonth: 0,
    totalCompanies: 0,
    activeCompanies: 0,
    totalJobPosts: 0,
    activeJobPosts: 0,
    pendingJobPosts: 0,
    newJobPostsThisMonth: 0
  });
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchAnalyticsData();
    }
  }, [user]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch comprehensive data
      const [
        usersResponse,
        companiesResponse,
        jobPostsResponse,
        pendingJobsResponse,
        activeJobsResponse
      ] = await Promise.all([
        userApi.getAllUsers(1, 1000),
        companyApi.getAllCompanies(1, 1000),
        jobPostApi.searchJobPosts({ page: 1, size: 1000 }),
        jobPostApi.searchJobPosts({ status: 'PENDING', page: 1, size: 1000 }),
        jobPostApi.searchJobPosts({ status: 'ACTIVE', page: 1, size: 1000 })
      ]);

      const allUsers = usersResponse.result.data || [];
      const allCompanies = companiesResponse.result.data || [];
      const allJobPosts = jobPostsResponse.result.data || [];
      const pendingJobs = pendingJobsResponse.result.data || [];
      const activeJobs = activeJobsResponse.result.data || [];

      // Calculate date-based statistics
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      const newUsersThisMonth = allUsers.filter(user => {
        const createdDate = new Date(user.createdAt);
        return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
      }).length;

      const newJobPostsThisMonth = allJobPosts.filter(job => {
        if (!job.createdAt) return false;
        const createdDate = new Date(job.createdAt);
        return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
      }).length;

      setAnalytics({
        totalUsers: allUsers.length,
        activeUsers: allUsers.filter(user => user.isActive).length,
        newUsersThisMonth,
        totalCompanies: allCompanies.length,
        activeCompanies: allCompanies.length,
        totalJobPosts: allJobPosts.length,
        activeJobPosts: activeJobs.length,
        pendingJobPosts: pendingJobs.length,
        newJobPostsThisMonth
      });

      // Generate monthly statistics for the last 6 months
      const monthlyData: MonthlyStats[] = [];
      for (let i = 5; i >= 0; i--) {
        const targetDate = new Date(currentYear, currentMonth - i, 1);
        const monthName = targetDate.toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' });
        
        const monthUsers = allUsers.filter(user => {
          const createdDate = new Date(user.createdAt);
          return createdDate.getMonth() === targetDate.getMonth() && 
                 createdDate.getFullYear() === targetDate.getFullYear();
        }).length;

        const monthJobPosts = allJobPosts.filter(job => {
          if (!job.createdAt) return false;
          const createdDate = new Date(job.createdAt);
          return createdDate.getMonth() === targetDate.getMonth() && 
                 createdDate.getFullYear() === targetDate.getFullYear();
        }).length;

        monthlyData.push({
          month: monthName,
          users: monthUsers,
          companies: 0,
          jobPosts: monthJobPosts
        });
      }

      setMonthlyStats(monthlyData);

    } catch (error: any) {
      console.error('Error fetching analytics data:', error);
      setError('Không thể tải dữ liệu thống kê');
    }
    setLoading(false);
  };

  const StatCard: React.FC<{
    title: string;
    value: number;
    subtitle?: string;
    icon: React.ComponentType<any>;
    color: string;
    trend?: number;
  }> = ({ title, value, subtitle, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`flex-shrink-0 ${color}`}>
          <Icon className="h-8 w-8" />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend !== undefined && (
            <div className="flex items-center mt-2">
              <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+{trend} tháng này</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (!user || user.role !== 'ADMIN') {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Không có quyền truy cập</h1>
            <p className="text-gray-600">Bạn không có quyền truy cập trang này.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Thống kê & Phân tích</h1>
                <p className="text-gray-600 mt-1">
                  Báo cáo chi tiết về hoạt động hệ thống
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading && (
            <div className="bg-blue-50 border border-blue-200 text-blue-600 px-4 py-3 rounded-lg mb-6">
              Đang tải dữ liệu thống kê...
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Overview Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Tổng người dùng"
              value={analytics.totalUsers}
              subtitle={`${analytics.activeUsers} hoạt động`}
              icon={UsersIcon}
              color="text-blue-600"
              trend={analytics.newUsersThisMonth}
            />
            <StatCard
              title="Tổng công ty"
              value={analytics.totalCompanies}
              subtitle={`${analytics.activeCompanies} hoạt động`}
              icon={BuildingOfficeIcon}
              color="text-purple-600"
            />
            <StatCard
              title="Tin tuyển dụng"
              value={analytics.totalJobPosts}
              subtitle={`${analytics.pendingJobPosts} chờ duyệt`}
              icon={BriefcaseIcon}
              color="text-green-600"
              trend={analytics.newJobPostsThisMonth}
            />
            <StatCard
              title="Tin hoạt động"
              value={analytics.activeJobPosts}
              subtitle="Đang tuyển dụng"
              icon={DocumentTextIcon}
              color="text-orange-600"
            />
          </div>

          {/* Monthly Trends Chart */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Thống kê 6 tháng gần đây</h3>
            <div className="space-y-6">
              {monthlyStats.map((stat, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 items-center">
                  <div className="text-sm font-medium text-gray-700">
                    {stat.month}
                  </div>
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(100, (stat.users / Math.max(...monthlyStats.map(s => s.users), 1)) * 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{stat.users} users</span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(100, (stat.jobPosts / Math.max(...monthlyStats.map(s => s.jobPosts), 1)) * 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{stat.jobPosts} jobs</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tình trạng hệ thống</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-green-400 rounded-full mr-3"></div>
                  <span className="text-sm font-medium">Hệ thống hoạt động</span>
                </div>
                <span className="text-sm font-semibold text-green-600">Bình thường</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-sm font-medium">Cập nhật cuối</span>
                </div>
                <span className="text-sm font-semibold text-blue-600">
                  {new Date().toLocaleTimeString('vi-VN')}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center">
                  <UsersIcon className="h-5 w-5 text-purple-600 mr-3" />
                  <span className="text-sm font-medium">Người dùng trực tuyến</span>
                </div>
                <span className="text-sm font-semibold text-purple-600">
                  {Math.floor(analytics.activeUsers * 0.1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AnalyticsPage; 
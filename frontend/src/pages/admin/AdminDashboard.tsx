import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import {
  UsersIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  ChartBarIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  UserGroupIcon,
  CogIcon,
  AcademicCapIcon,
  TagIcon,
  Squares2X2Icon,
  FolderIcon
} from '@heroicons/react/24/outline';
import { userApi, companyApi, jobPostApi, applicationApi } from '../../services/api';
import type { UserResponse, CompanyDashboardResponse, JobPostDashboardResponse, ApplicationResponse } from '../../services/api';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalCompanies: number;
  activeCompanies: number;
  totalJobPosts: number;
  pendingJobPosts: number;
  activeJobPosts: number;
  totalApplications: number;
  pendingApplications: number;
}

interface RecentActivity {
  id: string;
  type: 'user' | 'company' | 'job' | 'application';
  action: string;
  user: string;
  time: string;
  status?: string;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalCompanies: 0,
    activeCompanies: 0,
    totalJobPosts: 0,
    pendingJobPosts: 0,
    activeJobPosts: 0,
    totalApplications: 0,
    pendingApplications: 0
  });
  const [recentUsers, setRecentUsers] = useState<UserResponse[]>([]);
  const [recentCompanies, setRecentCompanies] = useState<CompanyDashboardResponse[]>([]);
  const [pendingJobPosts, setPendingJobPosts] = useState<JobPostDashboardResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch comprehensive statistics
      const [
        usersResponse,
        companiesResponse,
        jobPostsResponse,
        pendingJobsResponse,
        activeJobsResponse
      ] = await Promise.all([
        userApi.getAllUsers(1, 100),
        companyApi.getAllCompanies(1, 100),
        jobPostApi.searchJobPosts({ page: 1, size: 100 }),
        jobPostApi.searchJobPosts({ status: 'PENDING', page: 1, size: 100 }),
        jobPostApi.searchJobPosts({ status: 'ACTIVE', page: 1, size: 100 })
      ]);

              // Calculate detailed statistics
        const allUsers = usersResponse.result.data || [];
        const allCompanies = companiesResponse.result.data || [];
        const allJobPosts = jobPostsResponse.result.data || [];
        const pendingJobs = pendingJobsResponse.result.data || [];
        const activeJobs = activeJobsResponse.result.data || [];

        setStats({
          totalUsers: allUsers.length,
          activeUsers: allUsers.filter(user => user.isActive).length,
          totalCompanies: allCompanies.length,
          activeCompanies: allCompanies.length, // CompanyDashboardResponse doesn't have status field
          totalJobPosts: allJobPosts.length,
          pendingJobPosts: pendingJobs.length,
          activeJobPosts: activeJobs.length,
          totalApplications: 0, // Will be updated when we fetch applications
          pendingApplications: 0
        });

      // Set recent data
      setRecentUsers(allUsers.slice(0, 5));
      setRecentCompanies(allCompanies.slice(0, 5));
      setPendingJobPosts(pendingJobs.slice(0, 5));

      // Try to fetch applications data if possible
      try {
        const applicationsResponse = await applicationApi.searchApplications('', 1, 100);
        const allApplications = applicationsResponse.result.data || [];
        setStats(prev => ({
          ...prev,
          totalApplications: allApplications.length,
          pendingApplications: allApplications.filter(app => app.status === 'PENDING').length
        }));
      } catch (appError) {
        console.log('Could not fetch applications data:', appError);
      }

    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      setError('Không thể tải dữ liệu dashboard');
    }
    setLoading(false);
  };

  const StatCard: React.FC<{
    title: string;
    value: number;
    subtitle?: string;
    icon: React.ComponentType<any>;
    color: string;
    onClick?: () => void;
  }> = ({ title, value, subtitle, icon: Icon, color, onClick }) => (
    <div 
      className={`bg-white rounded-lg shadow p-6 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
    >
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
        </div>
      </div>
    </div>
  );

  const QuickAction: React.FC<{
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    color: string;
    onClick: () => void;
  }> = ({ title, description, icon: Icon, color, onClick }) => (
    <button
      onClick={onClick}
      className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow text-left w-full"
    >
      <div className="flex items-start">
        <div className={`flex-shrink-0 ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
      </div>
    </button>
  );

  const PendingJobsTable: React.FC = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Tin tuyển dụng chờ duyệt</h3>
        <button 
          onClick={() => navigate('/admin/job-posts')}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Xem tất cả
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vị trí</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Công ty</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày tạo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pendingJobPosts.map((job) => (
              <tr key={job.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{job.title}</div>
                  <div className="text-sm text-gray-500">{job.location}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{job.companyName}</div>
                </td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                   {job.createdAt ? new Date(job.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                 </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <button className="text-green-600 hover:text-green-800">
                    <CheckCircleIcon className="h-5 w-5" />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <XCircleIcon className="h-5 w-5" />
                  </button>
                  <button className="text-blue-600 hover:text-blue-800">
                    <EyeIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pendingJobPosts.length === 0 && (
        <div className="text-center py-8">
          <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Không có tin tuyển dụng nào chờ duyệt</p>
        </div>
      )}
    </div>
  );

  const RecentUsersTable: React.FC = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Người dùng mới</h3>
        <button 
          onClick={() => navigate('/admin/users')}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Xem tất cả
        </button>
      </div>
      <div className="divide-y divide-gray-200">
        {recentUsers.map((userData) => (
          <div key={userData.id} className="px-6 py-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-900">{userData.fullname}</div>
              <div className="text-sm text-gray-500">{userData.email}</div>
              <div className="text-xs text-gray-400">
                {userData.role}
              </div>
            </div>
          </div>
        ))}
      </div>
      {recentUsers.length === 0 && (
        <div className="text-center py-8">
          <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Chưa có người dùng mới</p>
        </div>
      )}
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Quản lý hệ thống TopCV</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading && (
            <div className="bg-blue-50 border border-blue-200 text-blue-600 px-4 py-3 rounded-lg mb-6">
              Đang tải dữ liệu dashboard...
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Tổng người dùng"
              value={stats.totalUsers}
              subtitle={`${stats.activeUsers} hoạt động`}
              icon={UsersIcon}
              color="text-blue-600"
              onClick={() => navigate('/admin/users')}
            />
            <StatCard
              title="Tổng công ty"
              value={stats.totalCompanies}
              subtitle={`${stats.activeCompanies} hoạt động`}
              icon={BuildingOfficeIcon}
              color="text-purple-600"
              onClick={() => navigate('/admin/companies')}
            />
            <StatCard
              title="Tin tuyển dụng"
              value={stats.totalJobPosts}
              subtitle={`${stats.pendingJobPosts} chờ duyệt`}
              icon={BriefcaseIcon}
              color="text-green-600"
              onClick={() => navigate('/admin/job-posts')}
            />
            <StatCard
              title="Đơn ứng tuyển"
              value={stats.totalApplications}
              subtitle={`${stats.pendingApplications} chờ xử lý`}
              icon={DocumentTextIcon}
              color="text-orange-600"
              onClick={() => navigate('/admin/applications')}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Quick Actions */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Thao tác nhanh</h2>
              <div className="space-y-4">
                <QuickAction
                  title="Quản lý người dùng"
                  description="Xem, tìm kiếm và quản lý tất cả người dùng"
                  icon={UsersIcon}
                  color="text-blue-600"
                  onClick={() => navigate('/admin/users')}
                />
                <QuickAction
                  title="Duyệt công ty"
                  description="Xem và duyệt các công ty mới đăng ký"
                  icon={BuildingOfficeIcon}
                  color="text-purple-600"
                  onClick={() => navigate('/admin/companies')}
                />
                <QuickAction
                  title="Duyệt tin tuyển dụng"
                  description="Xem và duyệt các tin tuyển dụng chờ phê duyệt"
                  icon={BriefcaseIcon}
                  color="text-green-600"
                  onClick={() => navigate('/admin/job-posts')}
                />
                <QuickAction
                  title="Xem đơn ứng tuyển"
                  description="Theo dõi và quản lý tất cả đơn ứng tuyển"
                  icon={DocumentTextIcon}
                  color="text-orange-600"
                  onClick={() => navigate('/admin/applications')}
                />
                <QuickAction
                  title="Thống kê"
                  description="Xem báo cáo và thống kê chi tiết"
                  icon={ChartBarIcon}
                  color="text-indigo-600"
                  onClick={() => navigate('/admin/analytics')}
                />
                <QuickAction
                  title="Cài đặt hệ thống"
                  description="Cấu hình và cài đặt hệ thống"
                  icon={CogIcon}
                  color="text-gray-600"
                  onClick={() => navigate('/admin/settings')}
                />
                <QuickAction
                  title="Quản lý kỹ năng"
                  description="Thêm, sửa, xoá các kỹ năng ứng viên/công việc"
                  icon={TagIcon}
                  color="text-pink-600"
                  onClick={() => navigate('/admin/skills')}
                />
                <QuickAction
                  title="Quản lý loại công việc"
                  description="Thêm, sửa, xoá các loại công việc"
                  icon={Squares2X2Icon}
                  color="text-yellow-600"
                  onClick={() => navigate('/admin/job-types')}
                />
                <QuickAction
                  title="Quản lý cấp bậc công việc"
                  description="Thêm, sửa, xoá các cấp bậc công việc"
                  icon={AcademicCapIcon}
                  color="text-blue-500"
                  onClick={() => navigate('/admin/job-levels')}
                />
                <QuickAction
                  title="Quản lý danh mục công ty"
                  description="Thêm, sửa, xoá các danh mục công ty"
                  icon={FolderIcon}
                  color="text-green-700"
                  onClick={() => navigate('/admin/company-categories')}
                />
              </div>
            </div>

            {/* Recent Users */}
            <div>
              <RecentUsersTable />
            </div>

            {/* Pending Job Posts */}
            <div>
              <PendingJobsTable />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard; 
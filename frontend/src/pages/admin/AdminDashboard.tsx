import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
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
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { userApi, companyApi, jobPostApi } from '../../services/api';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCompanies: 0,
    totalJobPosts: 0,
    totalApplications: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Fetch basic statistics
      const [usersResponse, companiesResponse, jobPostsResponse] = await Promise.all([
        userApi.getAllUsers(1, 1),
        companyApi.getAllCompanies(1, 1),
        jobPostApi.searchJobPosts({ page: 1, size: 1 })
      ]);

      setStats({
        totalUsers: usersResponse.result.totalElements,
        totalCompanies: companiesResponse.result.totalElements,
        totalJobPosts: jobPostsResponse.result.totalElements,
        totalApplications: 0 // TODO: Add application API
      });
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      setError('Không thể tải thông tin thống kê');
    }
    setLoading(false);
  };

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ComponentType<any>;
    color: string;
    change?: string;
  }> = ({ title, value, icon: Icon, color, change }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`flex-shrink-0 ${color}`}>
          <Icon className="h-8 w-8" />
        </div>
        <div className="ml-4 flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
            </div>
            {change && (
              <span className="text-sm text-green-600 font-medium">
                {change}
              </span>
            )}
          </div>
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

  const RecentActivity: React.FC = () => {
    const activities = [
      {
        id: 1,
        action: 'Đăng ký tài khoản mới',
        user: 'user@example.com',
        time: '2 phút trước',
        type: 'user'
      },
      {
        id: 2,
        action: 'Tạo công ty mới',
        user: 'company@example.com',
        time: '15 phút trước',
        type: 'company'
      },
      {
        id: 3,
        action: 'Đăng tin tuyển dụng',
        user: 'hr@company.com',
        time: '1 giờ trước',
        type: 'job'
      },
      {
        id: 4,
        action: 'Ứng tuyển vị trí',
        user: 'candidate@example.com',
        time: '2 giờ trước',
        type: 'application'
      }
    ];

    const getActivityIcon = (type: string) => {
      switch (type) {
        case 'user': return <UsersIcon className="h-5 w-5 text-blue-600" />;
        case 'company': return <BuildingOfficeIcon className="h-5 w-5 text-purple-600" />;
        case 'job': return <BriefcaseIcon className="h-5 w-5 text-green-600" />;
        case 'application': return <DocumentTextIcon className="h-5 w-5 text-orange-600" />;
        default: return <ExclamationTriangleIcon className="h-5 w-5 text-gray-600" />;
      }
    };

    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Hoạt động gần đây</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {activities.map((activity) => (
            <div key={activity.id} className="px-6 py-4 flex items-center space-x-3">
              {getActivityIcon(activity.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.action}
                </p>
                <p className="text-sm text-gray-600">{activity.user}</p>
              </div>
              <div className="text-sm text-gray-500">
                {activity.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

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
              Đang tải dữ liệu...
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
              icon={UsersIcon}
              color="text-blue-600"
              change="+12%"
            />
            <StatCard
              title="Tổng công ty"
              value={stats.totalCompanies}
              icon={BuildingOfficeIcon}
              color="text-purple-600"
              change="+8%"
            />
            <StatCard
              title="Tin tuyển dụng"
              value={stats.totalJobPosts}
              icon={BriefcaseIcon}
              color="text-green-600"
              change="+15%"
            />
            <StatCard
              title="Đơn ứng tuyển"
              value={stats.totalApplications}
              icon={DocumentTextIcon}
              color="text-orange-600"
              change="+23%"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Thao tác nhanh</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <QuickAction
                  title="Quản lý người dùng"
                  description="Xem và quản lý tài khoản người dùng"
                  icon={UsersIcon}
                  color="text-blue-600"
                  onClick={() => window.location.href = '/admin/users'}
                />
                <QuickAction
                  title="Quản lý công ty"
                  description="Duyệt và quản lý thông tin công ty"
                  icon={BuildingOfficeIcon}
                  color="text-purple-600"
                  onClick={() => alert('Chức năng đang phát triển')}
                />
                <QuickAction
                  title="Quản lý tin tuyển dụng"
                  description="Duyệt và kiểm duyệt tin tuyển dụng"
                  icon={BriefcaseIcon}
                  color="text-green-600"
                  onClick={() => alert('Chức năng đang phát triển')}
                />
                <QuickAction
                  title="Báo cáo thống kê"
                  description="Xem báo cáo chi tiết về hệ thống"
                  icon={ChartBarIcon}
                  color="text-orange-600"
                  onClick={() => alert('Chức năng đang phát triển')}
                />
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <RecentActivity />
            </div>
          </div>

          {/* Pending Approvals */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Chờ duyệt</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Công ty mới</h3>
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Chờ duyệt
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-2">3</p>
                <p className="text-sm text-gray-600">Công ty chờ được duyệt</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Tin tuyển dụng</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Đang xử lý
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-2">8</p>
                <p className="text-sm text-gray-600">Tin tuyển dụng chờ duyệt</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Báo cáo</h3>
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Khẩn cấp
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-2">2</p>
                <p className="text-sm text-gray-600">Báo cáo cần xử lý</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard; 
import React, { useState, useEffect } from 'react';
import { 
  HomeIcon,
  UserIcon,
  BriefcaseIcon,
  HeartIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  applicationApi, 
  userApi,
  getStatusText,
  getStatusColor,
  type ApplicationResponse,
  type UserResponse
} from '../../services/api';

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // API Data States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState<UserResponse | null>(null);
  const [applications, setApplications] = useState<ApplicationResponse[]>([]);
  
  // Dashboard Statistics 
  const [stats, setStats] = useState({
    totalApplications: 0,
    interviewsScheduled: 0,
    pendingApplications: 0,
    rejectedApplications: 0,
    applicationStatusChart: {
      pending: 0,
      interviewed: 0,
      rejected: 0,
      hired: 0
    }
  });

  useEffect(() => {
    if (!user || user.role !== 'USER') {
      navigate('/auth/login');
      return;
    }
    
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchUserInfo(),
        fetchApplications()
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await userApi.getMyInfo();
      if (response.code === 1000 && response.result) {
        setUserInfo(response.result);
      }
    } catch (err) {
      console.error('Error fetching user info:', err);
    }
  };

  const fetchApplications = async () => {
    try {
      // Get user's applications
      const response = await applicationApi.getMyApplications(1, 50); // Get more for stats
      const userApplications = response.result.data || [];
      
      setApplications(userApplications);
      calculateStats(userApplications);
      
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const calculateStats = (applications: ApplicationResponse[]) => {
    const totalApplications = applications.length;
    
    // Calculate status-based stats
    const interviewsScheduled = applications.filter(app => 
      app.status === 'INTERVIEWED' || app.status === 'SHORTLISTED'
    ).length;
    
    const pendingApplications = applications.filter(app => 
      app.status === 'PENDING' || app.status === 'REVIEWING'
    ).length;
    
    const rejectedApplications = applications.filter(app => 
      app.status === 'REJECTED'
    ).length;
    
    const hiredApplications = applications.filter(app => 
      app.status === 'HIRED'
    ).length;
    
    // Calculate percentages for chart
    const rejectedPercentage = totalApplications > 0 ? Math.round((rejectedApplications / totalApplications) * 100) : 0;
    const interviewedPercentage = totalApplications > 0 ? Math.round((interviewsScheduled / totalApplications) * 100) : 0;
    
    setStats({
      totalApplications,
      interviewsScheduled,
      pendingApplications,
      rejectedApplications,
      applicationStatusChart: {
        pending: pendingApplications,
        interviewed: interviewsScheduled,
        rejected: rejectedApplications,
        hired: hiredApplications
      }
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Get recent applications (last 5)
  const recentApplications = applications.slice(0, 5);

  // Get upcoming interviews from applications with INTERVIEWED or SHORTLISTED status
  const upcomingInterviews = applications
    .filter(app => app.status === 'INTERVIEWED' || app.status === 'SHORTLISTED')
    .slice(0, 3)
    .map((app, index) => ({
      id: app.id.toString(),
      time: `${10 + index}:00 AM`, // Mock time for display
      candidate: userInfo?.fullname || 'Ứng viên',
      position: app.jobPost.title,
      company: app.jobPost.companyName,
      avatar: userInfo?.avt || `https://via.placeholder.com/40x40?text=${userInfo?.fullname?.charAt(0) || 'U'}`
    }));

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  };

  // Helper function to get logo background color
  const getLogoColor = (index: number) => {
    const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-red-500', 'bg-purple-500', 'bg-yellow-500'];
    return colors[index % colors.length];
  };

  const sidebarItems = [
    { icon: HomeIcon, label: 'Tổng quan', active: true, href: '/user/dashboard' },
    { icon: BriefcaseIcon, label: 'Công việc đã ứng tuyển', href: '/user/applications' },
    { icon: HeartIcon, label: 'Công việc yêu thích', href: '/user/favorites' },
    { icon: UserCircleIcon, label: 'Trang cá nhân', href: '/user/profile' },
    { icon: Cog6ToothIcon, label: 'Cài đặt', href: '/user/settings' },
    { icon: QuestionMarkCircleIcon, label: 'Trợ giúp', href: '/user/help' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-xl font-bold text-gray-900">TopJob</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    item.active
                      ? 'bg-emerald-50 text-emerald-700 border-r-2 border-emerald-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="flex-1">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile - Sticky at bottom */}
        <div className="sticky bottom-0 bg-white p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <img
              src={userInfo?.avt || `https://via.placeholder.com/40x40?text=${userInfo?.fullname?.charAt(0) || 'U'}`}
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userInfo?.fullname || 'Người dùng'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {userInfo?.email || 'email@example.com'}
              </p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tổng quan</h1>
            </div>
            <Link
              to="/"
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Quay lại trang chủ
            </Link>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Loading State */}
          {loading && (
            <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-600 px-4 py-3 rounded-lg">
              Đang tải dữ liệu dashboard...
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Welcome Message */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {userInfo?.fullname ? `${userInfo.fullname} ơi, chúc buổi sáng tràn đầy năng lượng nhé!` : 'Chúc buổi sáng tràn đầy năng lượng nhé!'}
            </h2>
            <p className="text-gray-600">
              Đây là cập nhật về các đơn ứng tuyển việc làm của bạn
            </p>
            <div className="mt-4 flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">Cập nhật: {new Date().toLocaleDateString('vi-VN')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <BriefcaseIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">{stats.totalApplications} đơn ứng tuyển</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Stats */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats Cards */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Total Applications */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-600">Tổng ứng tuyển</h3>
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <BriefcaseIcon className="h-6 w-6 text-gray-400" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{stats.totalApplications}</div>
                </div>

                {/* Applications Status Chart */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-4">Trạng thái ứng tuyển</h3>
                  <div className="flex items-center space-x-4">
                    <div className="relative w-20 h-20">
                      <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="3"
                        />
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#0891b2"
                          strokeWidth="3"
                          strokeDasharray={`${stats.totalApplications > 0 ? Math.round((stats.rejectedApplications / stats.totalApplications) * 100) : 0}, ${stats.totalApplications > 0 ? 100 - Math.round((stats.rejectedApplications / stats.totalApplications) * 100) : 100}`}
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">{stats.totalApplications > 0 ? Math.round((stats.rejectedApplications / stats.totalApplications) * 100) : 0}%</span>
                        <span className="text-xs text-gray-500">Không phù hợp</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-cyan-600 rounded-full"></div>
                        <span className="text-sm text-gray-600">{stats.totalApplications > 0 ? Math.round((stats.interviewsScheduled / stats.totalApplications) * 100) : 0}%</span>
                        <span className="text-xs text-gray-500">Đã phỏng vấn</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">{stats.totalApplications > 0 ? Math.round((stats.pendingApplications / stats.totalApplications) * 100) : 0}%</span>
                        <span className="text-xs text-gray-500">Chờ xét duyệt</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interviews Scheduled */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-600">Đã phỏng vấn</h3>
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <UserIcon className="h-6 w-6 text-gray-400" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{stats.interviewsScheduled}</div>
                </div>
              </div>

              {/* Recent Applications */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Công việc đã ứng tuyển gần đây</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {recentApplications.length > 0 ? (
                    recentApplications.map((application, index) => (
                      <div key={application.id} className="p-6 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 ${getLogoColor(index)} rounded-lg flex items-center justify-center`}>
                            <span className="text-white font-semibold">
                              {application.jobPost.companyName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{application.jobPost.title}</h4>
                            <p className="text-sm text-gray-600">
                              {application.jobPost.companyName} • {application.jobPost.location} • {application.jobPost.type.name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Ngày ứng tuyển</p>
                            <p className="text-sm font-medium text-gray-900">{formatDate(application.createdAt)}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                            {getStatusText(application.status)}
                          </span>
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <EllipsisHorizontalIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      <p>Chưa có đơn ứng tuyển nào</p>
                    </div>
                  )}
                </div>
                <div className="p-6 border-t border-gray-200 text-center">
                  <Link
                    to="/user/applications"
                    className="inline-flex items-center space-x-2 text-sm font-medium text-emerald-600 hover:text-emerald-700"
                  >
                    <span>Tất cả công việc đã ứng tuyển</span>
                    <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard; 
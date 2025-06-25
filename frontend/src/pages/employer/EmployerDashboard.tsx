import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  UsersIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  CalendarIcon,
  ChevronDownIcon,
  EyeIcon,
  UserPlusIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { 
  jobPostApi, 
  applicationApi, 
  companyApi,
  type ApplicationResponse,
  type CompanyResponse
} from '../../services/api';
import { type JobPostResponse } from '../../services/api/jobPostApi';

const EmployerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [selectedDateRange, setSelectedDateRange] = useState('Jul 19 - Jul 25');
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);

  // API Data States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [company, setCompany] = useState<CompanyResponse | null>(null);
  const [companyLoading, setCompanyLoading] = useState(true);
  
  // Dashboard Statistics
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    newApplications: 0,
    pendingApplications: 0,
    interviews: 0,
    views: 0
  });

  const [recentJobs, setRecentJobs] = useState<JobPostResponse[]>([]);
  const [recentApplications, setRecentApplications] = useState<ApplicationResponse[]>([]);

  useEffect(() => {
    if (!user || user.role !== 'EMPLOYER') {
      navigate('/auth/login');
      return;
    }
    
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchCompanyInfo(),
        fetchJobStats(),
        fetchApplicationStats(),
        fetchRecentJobs(),
        fetchRecentApplications()
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyInfo = async () => {
    try {
      setCompanyLoading(true);
      const response = await companyApi.getMyCompany();
      if (response.code === 1000 && response.result) {
        setCompany(response.result);
      }
    } catch (err) {
      console.error('Error fetching company info:', err);
    } finally {
      setCompanyLoading(false);
    }
  };

  const fetchJobStats = async () => {
    try {
      // Get all jobs posted by employer
      const jobsResponse = await jobPostApi.getMyJobPosts(1, 100); // Get more to calculate stats
      const jobs = jobsResponse.result.data || [];
      
      const activeJobs = jobs.filter(job => job.status === 'ACTIVE').length;
      
      setStats(prev => ({
        ...prev,
        totalJobs: jobs.length,
        activeJobs
      }));
      
    } catch (error) {
      console.error('Error fetching job stats:', error);
    }
  };

  const fetchApplicationStats = async () => {
    try {
      // Get applications for employer
      const applicationsResponse = await applicationApi.getAllApplicationsForEmployer(1, 100);
      const applications = applicationsResponse.result.data || [];
      
      // Calculate application statistics
      const newApplications = applications.filter(app => {
        const createdDate = new Date(app.createdAt);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - createdDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7; // Applications in last 7 days
      }).length;
      
      const pendingApplications = applications.filter(app => 
        app.status === 'PENDING' || app.status === 'REVIEWING'
      ).length;
      
      setStats(prev => ({
        ...prev,
        totalApplications: applications.length,
        newApplications,
        pendingApplications,
        interviews: applications.filter(app => app.status === 'INTERVIEWED').length
      }));
      
    } catch (error) {
      console.error('Error fetching application stats:', error);
    }
  };

  const fetchRecentJobs = async () => {
    try {
      const response = await jobPostApi.getMyJobPosts(1, 4); // Get 4 most recent jobs
      setRecentJobs(response.result.data || []);
    } catch (error) {
      console.error('Error fetching recent jobs:', error);
    }
  };

  const fetchRecentApplications = async () => {
    try {
      const response = await applicationApi.getAllApplicationsForEmployer(1, 5);
      setRecentApplications(response.result.data || []);
    } catch (error) {
      console.error('Error fetching recent applications:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const sidebarItems = [
    { icon: HomeIcon, label: 'Tổng quan', active: true, href: '/employer/dashboard' },
    { icon: BriefcaseIcon, label: 'Danh sách công việc', href: '/employer/jobs' },
    { icon: UsersIcon, label: 'Tất cả ứng viên', href: '/employer/candidates' },
    { icon: BuildingOfficeIcon, label: 'Hồ sơ công ty', href: '/employer/company' },
    { icon: Cog6ToothIcon, label: 'Cài đặt', href: '/employer/settings' },
    { icon: QuestionMarkCircleIcon, label: 'Trợ giúp', href: '/employer/help' }
  ];

  // Mock chart data (can be replaced with real analytics later)
  const chartData = [
    { day: 'Mon', views: 150, applications: Math.floor(stats.newApplications * 0.2) },
    { day: 'Tue', views: 200, applications: Math.floor(stats.newApplications * 0.15) },
    { day: 'Wed', views: 180, applications: Math.floor(stats.newApplications * 0.25) },
    { day: 'Thu', views: 220, applications: Math.floor(stats.newApplications * 0.2) },
    { day: 'Fri', views: 160, applications: Math.floor(stats.newApplications * 0.1) },
    { day: 'Sat', views: 90, applications: Math.floor(stats.newApplications * 0.05) },
    { day: 'Sun', views: 110, applications: Math.floor(stats.newApplications * 0.05) }
  ];

  // Calculate job type statistics from recent jobs
  const getJobTypeStats = () => {
    const typeStats = { fullTime: 0, partTime: 0, remote: 0, internship: 0, contract: 0 };
    
    recentJobs.forEach(job => {
      const typeName = job.jobType?.name?.toLowerCase() || '';
      if (typeName.includes('full')) typeStats.fullTime++;
      else if (typeName.includes('part')) typeStats.partTime++;
      else if (typeName.includes('remote')) typeStats.remote++;
      else if (typeName.includes('intern')) typeStats.internship++;
      else if (typeName.includes('contract')) typeStats.contract++;
    });
    
    return typeStats;
  };

  const jobStats = getJobTypeStats();

  // Check if user is employer
  if (!user || user.role !== 'EMPLOYER') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Không có quyền truy cập</h1>
          <p className="text-gray-600">Bạn không có quyền truy cập trang này.</p>
        </div>
      </div>
    );
  }

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
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              {user?.avt ? (
                <img src={user.avt} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <span className="text-emerald-600 font-medium text-sm">
                  {user?.fullname?.charAt(0)?.toUpperCase() || 'E'}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.fullname}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email}
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
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Company</span>
                {companyLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-orange-600"></div>
                    <span className="text-orange-600 font-medium">Đang tải...</span>
                  </div>
                ) : (
                  <span className="text-orange-600 font-medium">
                    {company?.name || 'Chưa có công ty'}
                  </span>
                )}
                <ChevronDownIcon className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/employer/jobs/create"
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center space-x-2"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Đăng tin tuyển dụng</span>
              </Link>
              <Link
                to="/"
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Quay lại trang chủ
              </Link>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tổng quan</h1>
              <p className="text-gray-600">Chào mừng trở lại, {user?.fullname}</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <CalendarIcon className="h-4 w-4" />
              <span>{selectedDateRange}</span>
            </div>
          </div>
        </header>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải dữ liệu dashboard...</p>
            </div>
          </div>
        ) : (
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Số ứng viên mới */}
                <div className="bg-emerald-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-3xl font-bold">{stats.newApplications}</h3>
                      <p className="text-emerald-100 mt-1">Ứng viên mới (7 ngày)</p>
                    </div>
                    <UserPlusIcon className="h-8 w-8 text-emerald-200" />
                  </div>
                </div>

                {/* Lịch phỏng vấn hôm nay */}
                <div className="bg-cyan-500 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-3xl font-bold">{stats.interviews}</h3>
                      <p className="text-cyan-100 mt-1">Lịch phỏng vấn</p>
                    </div>
                    <CalendarIcon className="h-8 w-8 text-cyan-200" />
                  </div>
                </div>

                {/* Đơn ứng tuyển chờ xử lý */}
                <div className="bg-blue-500 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-3xl font-bold">{stats.pendingApplications}</h3>
                      <p className="text-blue-100 mt-1">Đơn chờ xử lý</p>
                    </div>
                    <BriefcaseIcon className="h-8 w-8 text-blue-200" />
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Chart Section */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Thống kê ứng tuyển</h2>
                        <p className="text-sm text-gray-600">Thống kê 7 ngày gần nhất</p>
                      </div>
                      <div className="flex space-x-4">
                        <button className="px-3 py-1 text-sm text-emerald-600 bg-emerald-50 rounded">Tuần</button>
                        <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">Tháng</button>
                        <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">Năm</button>
                      </div>
                    </div>
                    
                    {/* Simple Chart */}
                    <div className="h-64 flex items-end justify-between space-x-2 mb-4">
                      {chartData.map((data, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center space-y-2">
                          <div className="flex flex-col items-center space-y-1">
                            <div 
                              className="w-full bg-yellow-400 rounded-t"
                              style={{ height: `${Math.max((data.views / 250) * 100, 10)}px` }}
                            ></div>
                            <div 
                              className="w-full bg-purple-500 rounded-b"
                              style={{ height: `${Math.max((data.applications / 10) * 120, 5)}px` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600">{data.day}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-center space-x-6 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                        <span>Lượt xem</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-purple-500 rounded"></div>
                        <span>Ứng tuyển</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Jobs */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold text-gray-900">Tin tuyển dụng gần đây</h2>
                      <Link 
                        to="/employer/jobs"
                        className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                      >
                        Xem tất cả
                      </Link>
                    </div>
                    
                    <div className="space-y-4">
                      {recentJobs.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <BriefcaseIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p>Chưa có tin tuyển dụng nào</p>
                          <Link 
                            to="/employer/jobs/create"
                            className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                          >
                            Đăng tin đầu tiên
                          </Link>
                        </div>
                      ) : (
                        recentJobs.map((job) => (
                          <div key={job.id} className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <BriefcaseIcon className="h-6 w-6 text-emerald-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-900 truncate">{job.title}</h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                                <span>{job.location}</span>
                                <span>•</span>
                                <span>{job.jobType?.name}</span>
                                <span>•</span>
                                <span>{job.appliedCount || 0} ứng viên</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                job.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                job.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {job.status === 'ACTIVE' ? 'Đang tuyển' :
                                 job.status === 'PENDING' ? 'Chờ duyệt' : job.status}
                              </span>
                              <Link 
                                to={`/employer/jobs/${job.id}`}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <EyeIcon className="h-4 w-4" />
                              </Link>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Job Stats */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê công việc</h3>
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-gray-900">{stats.totalJobs}</div>
                      <div className="text-gray-600">Tổng số tin đăng</div>
                    </div>
                    <div className="text-center mb-6">
                      <div className="text-2xl font-bold text-emerald-600">{stats.activeJobs}</div>
                      <div className="text-gray-600">Đang tuyển</div>
                    </div>
                  </div>

                  {/* Application Stats */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê ứng tuyển</h3>
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-gray-900">{stats.totalApplications}</div>
                      <div className="text-gray-600">Tổng ứng tuyển</div>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded"></div>
                          <span>Mới (7 ngày)</span>
                        </span>
                        <span className="font-medium">{stats.newApplications}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                          <span>Chờ xử lý</span>
                        </span>
                        <span className="font-medium">{stats.pendingApplications}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded"></div>
                          <span>Phỏng vấn</span>
                        </span>
                        <span className="font-medium">{stats.interviews}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
                    <div className="space-y-3">
                      <Link
                        to="/employer/jobs/create"
                        className="w-full flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Đăng tin mới
                      </Link>
                      <Link
                        to="/employer/candidates"
                        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <UsersIcon className="h-4 w-4 mr-2" />
                        Xem ứng viên
                      </Link>
                      <Link
                        to="/employer/jobs"
                        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <BriefcaseIcon className="h-4 w-4 mr-2" />
                        Quản lý tin đăng
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        )}
      </div>
      
      {/* Backdrop for dropdown */}
      {showCompanyDropdown && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setShowCompanyDropdown(false)}
        ></div>
      )}
    </div>
  );
};

export default EmployerDashboard; 
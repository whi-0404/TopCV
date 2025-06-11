import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import jobService, { JobPost } from '../../services/jobService';
import companyService from '../../services/companyService';
import { DebugAuth } from '../../components';

interface DashboardStats {
  newCandidates: number;
  todayInterviews: number;
  messagesReceived: number;
  totalJobs: number;
  activeJobs: number;
  recentJobs: JobPost[];
}

const CompanyDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    newCandidates: 0,
    todayInterviews: 0,
    messagesReceived: 0,
    totalJobs: 0,
    activeJobs: 0,
    recentJobs: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [hasCompany, setHasCompany] = useState<boolean>(false);

  const getDateRange = () => {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 6);
    
    return {
      start: startDate.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric' }),
      end: endDate.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric' })
    };
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Kiểm tra company tồn tại trước
        try {
          const company = await companyService.getMyCompany();
          
          if (!company) {
            // Nếu không có company, hiển thị thông báo và không gọi API job posts
            setStats({
              newCandidates: 0,
              todayInterviews: 0,
              messagesReceived: 0,
              totalJobs: 0,
              activeJobs: 0,
              recentJobs: []
            });
            setHasCompany(false);
            setError('Bạn chưa có hồ sơ công ty. Vui lòng tạo hồ sơ công ty trước khi đăng tin tuyển dụng.');
            return;
          }
          
          // Nếu có company, đánh dấu và tiếp tục lấy job posts
          setHasCompany(true);
          
          // Gọi API job posts trong try-catch riêng biệt
          await fetchJobPosts();
          
        } catch (companyErr: any) {
          console.error('Failed to check company existence:', companyErr);
          setHasCompany(false);
          setError('Bạn chưa có hồ sơ công ty. Vui lòng tạo hồ sơ công ty trước khi đăng tin tuyển dụng.');
        }
        
      } catch (err: any) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Không thể tải dữ liệu dashboard. Vui lòng thử lại.');
      } finally {
        setIsLoading(false);
      }
    };
    
    // Hàm riêng để gọi API job posts
    const fetchJobPosts = async () => {
      try {
        const jobsResponse = await jobService.getMyJobPosts(1, 10);
        const recentJobs = jobsResponse.Data || [];
        const activeJobs = recentJobs.filter(job => job.status === 'ACTIVE');
        
        // Calculate total applications from all jobs
        const totalApplications = recentJobs.reduce((sum, job) => sum + (job.appliedCount || 0), 0);
        
        setStats({
          newCandidates: totalApplications,
          todayInterviews: 0, // TODO: Calculate from interview schedules
          messagesReceived: 0, // TODO: Get from messages API
          totalJobs: jobsResponse.totalElements || 0,
          activeJobs: activeJobs.length,
          recentJobs: recentJobs.slice(0, 3)
        });
        
        setError('');
      } catch (jobErr: any) {
        console.warn('Cannot fetch job posts:', jobErr);
        
        // Set default stats when no jobs can be fetched
        setStats({
          newCandidates: 0,
          todayInterviews: 0,
          messagesReceived: 0,
          totalJobs: 0,
          activeJobs: 0,
          recentJobs: []
        });
        
        // Check if it's a permission error
        if (jobErr.message?.includes('You do not have permission')) {
          setError('Bạn không có quyền truy cập tin tuyển dụng. Vui lòng kiểm tra tài khoản employer.');
        }
      }
    };

    fetchDashboardData();
  }, []);

  const dateRange = getDateRange();

  // Stats configuration
  const statsCards = [
    {
      id: 1,
      name: 'Số ứng viên mới',
      value: stats.newCandidates.toString(),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      bgColor: 'bg-emerald-600',
    },
    {
      id: 2,
      name: 'Lịch phỏng vấn hôm nay',
      value: stats.todayInterviews.toString(),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      bgColor: 'bg-blue-600',
    },
    {
      id: 3,
      name: 'Tin tuyển dụng đang hoạt động',
      value: stats.activeJobs.toString(),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      bgColor: 'bg-orange-500',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600">Đang tải dashboard...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Xin chào, {user?.name || 'Công ty'}
          </h1>
          <div className="text-sm text-gray-500">
            Tổng quan từ {dateRange.start} - {dateRange.end}
          </div>
        </div>
        <div>
          {hasCompany ? (
            <Link 
              to="/company/jobs/new" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Đăng việc làm mới
            </Link>
          ) : (
            <Link 
              to="/company/create-company" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Tạo hồ sơ công ty
            </Link>
          )}
        </div>
      </div>

      {/* Debug Auth Component */}
      <div className="mb-6">
        <DebugAuth />
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-red-800">{error}</p>
              {!hasCompany && (
                <Link to="/company/create-company" className="mt-2 inline-block text-blue-600 hover:text-blue-800 font-medium">
                  Nhấp vào đây để tạo hồ sơ công ty
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statsCards.map((stat) => (
          <div key={stat.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex items-center">
                <div className={`${stat.bgColor} rounded-md p-3 mr-4`}>
                  {stat.icon}
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.name}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Jobs */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Tin tuyển dụng gần đây</h2>
            {hasCompany && (
              <Link to="/company/jobs" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Xem tất cả ({stats.totalJobs} tin)
              </Link>
            )}
          </div>
          
          {stats.recentJobs.length === 0 ? (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có tin tuyển dụng</h3>
              <p className="mt-1 text-sm text-gray-500">
                {hasCompany 
                  ? 'Bắt đầu bằng cách đăng tin tuyển dụng đầu tiên.' 
                  : 'Bạn cần tạo hồ sơ công ty trước khi đăng tin tuyển dụng.'}
              </p>
              <div className="mt-6">
                {hasCompany ? (
                  <Link
                    to="/company/jobs/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Đăng tin tuyển dụng
                  </Link>
                ) : (
                  <Link
                    to="/company/profile"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    Tạo hồ sơ công ty
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentJobs.map((job) => (
                <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${jobService.getJobStatusColor(job.status || '')}`}>
                          {jobService.formatJobStatus(job.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{job.location} • {job.jobType?.name || 'Không xác định'}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {job.skills?.slice(0, 3).map((skill) => (
                          <span
                            key={skill.id}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {skill.name}
                          </span>
                        ))}
                        {(job.skills?.length || 0) > 3 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            +{(job.skills?.length || 0) - 3} kỹ năng khác
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/company/jobs/${job.id}/edit`}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Chỉnh sửa
                      </Link>
                      <Link
                        to={`/company/jobs/${job.id}/applications`}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Xem ứng viên ({job.appliedCount || 0})
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Thao tác nhanh</h3>
          <div className="space-y-3">
            <Link
              to="/company/jobs/new"
              className="flex items-center p-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <svg className="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Đăng tin tuyển dụng mới
            </Link>
            <Link
              to="/company/candidates"
              className="flex items-center p-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <svg className="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Xem danh sách ứng viên
            </Link>
            <Link
              to="/company/messages"
              className="flex items-center p-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <svg className="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Kiểm tra tin nhắn mới
            </Link>
            <Link
              to="/company/profile"
              className="flex items-center p-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <svg className="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h1a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Cập nhật hồ sơ công ty
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Thống kê nhanh</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Tổng tin tuyển dụng</span>
              <span className="text-sm font-medium text-gray-900">{stats.totalJobs}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Tin đang hoạt động</span>
              <span className="text-sm font-medium text-green-600">{stats.activeJobs}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Tổng ứng viên</span>
              <span className="text-sm font-medium text-blue-600">{stats.newCandidates}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Phỏng vấn hôm nay</span>
              <span className="text-sm font-medium text-orange-600">{stats.todayInterviews}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard; 
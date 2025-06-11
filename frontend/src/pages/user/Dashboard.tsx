import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import jobService from '../../services/jobService';
import type { JobPostDashboard } from '../../services/jobService';

interface DashboardStats {
  totalApplications: number;
  totalInterviews: number;
  totalFavorites: number;
  recentApplications: JobPostDashboard[];
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalApplications: 0,
    totalInterviews: 0,
    totalFavorites: 0,
    recentApplications: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch favorite jobs for recent applications display
        const favoriteJobs = await jobService.getFavoriteJobs(1, 5);
        
        // TODO: Fetch applications data when API is available
        // const applications = await applicationService.getMyApplications(1, 10);
        
        setStats({
          totalApplications: 0, // TODO: Replace with real data
          totalInterviews: 0,   // TODO: Replace with real data
          totalFavorites: favoriteJobs.totalElements || 0,
          recentApplications: favoriteJobs.Data || []
        });
        
        setError('');
      } catch (err: any) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Không thể tải dữ liệu dashboard. Vui lòng thử lại.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getDateRange = () => {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 6);
    
    return {
      start: startDate.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric' }),
      end: endDate.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric' })
    };
  };

  const dateRange = getDateRange();

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
          <h1 className="text-2xl font-bold text-gray-900">
            Chào {user?.name || 'bạn'}, chúc buổi sáng tràn đầy năng lượng nhé!
          </h1>
          <p className="text-gray-600">
            Đây là cập nhật về các đơn ứng tuyển việc làm của bạn từ {dateRange.start} đến {dateRange.end}
          </p>
        </div>
        <button 
          onClick={() => navigate('/')} 
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
        >
          Quay lại trang chủ
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-gray-700 font-medium mb-2">Tổng ứng tuyển</h3>
            <div className="flex items-end">
              <span className="text-4xl font-bold text-gray-900">{stats.totalApplications}</span>
              <span className="text-gray-500 ml-2 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
            {stats.totalApplications === 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Bạn chưa ứng tuyển công việc nào. 
                <Link to="/jobs" className="text-blue-600 hover:text-blue-700 ml-1">
                  Tìm việc ngay
                </Link>
              </p>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-gray-700 font-medium mb-2">Đã phỏng vấn</h3>
            <div className="flex items-end">
              <span className="text-4xl font-bold text-gray-900">{stats.totalInterviews}</span>
              <span className="text-gray-500 ml-2 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-gray-700 font-medium mb-2">Công việc yêu thích</h3>
            <div className="flex items-end">
              <span className="text-4xl font-bold text-gray-900">{stats.totalFavorites}</span>
              <span className="text-gray-500 ml-2 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
            {stats.totalFavorites > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                <Link to="/user/favorites" className="text-blue-600 hover:text-blue-700">
                  Xem danh sách yêu thích
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Applications/Favorites */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {stats.recentApplications.length > 0 ? 'Công việc yêu thích gần đây' : 'Công việc đã ứng tuyển gần đây'}
          </h2>
          <Link 
            to={stats.recentApplications.length > 0 ? '/user/favorites' : '/user/applications'} 
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
          >
            {stats.recentApplications.length > 0 ? 'Tất cả công việc yêu thích' : 'Tất cả công việc đã ứng tuyển'}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
        
        <div className="space-y-4">
          {stats.recentApplications.length === 0 ? (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có hoạt động</h3>
              <p className="mt-1 text-sm text-gray-500">Bắt đầu bằng cách tìm kiếm và ứng tuyển công việc.</p>
              <div className="mt-6">
                <Link
                  to="/jobs"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Tìm kiếm công việc
                </Link>
              </div>
            </div>
          ) : (
            stats.recentApplications.slice(0, 3).map((job) => (
              <div key={job.id} className="flex items-center">
            <div className="h-12 w-12 rounded bg-gray-200 mr-4 flex items-center justify-center">
                  {job.company.logo ? (
                    <img 
                      src={job.company.logo} 
                      alt={job.company.name}
                      className="h-10 w-10 rounded object-cover"
                    />
                  ) : (
                    <span className="text-gray-500 font-semibold">
                      {job.company.name.charAt(0)}
                    </span>
                  )}
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                      <h3 className="font-medium">{job.title}</h3>
                      <p className="text-sm text-gray-600">{job.company.name} • {job.location}</p>
                </div>
                <div className="mt-2 md:mt-0">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Đã lưu yêu thích
                  </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Lương: {jobService.formatSalary(job.salary)} • Đăng ngày: {jobService.formatDate(job.createdAt)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
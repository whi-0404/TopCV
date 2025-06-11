import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import jobService from '../../services/jobService';
import type { JobPostDashboard } from '../../services/jobService';
import type { PageResponse } from '../../types/api';

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<JobPostDashboard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalElements: 0,
    pageSize: 10
  });

  // Fetch favorite jobs from API
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setIsLoading(true);
        const response: PageResponse<JobPostDashboard> = await jobService.getFavoriteJobs(pagination.currentPage);
        
        setFavorites(response.Data || []);
        setPagination(prev => ({
          ...prev,
          totalPages: response.totalPages,
          totalElements: response.totalElements,
          pageSize: response.pageSize
        }));
        setError('');
      } catch (err: any) {
        console.error('Failed to fetch favorite jobs:', err);
        setError('Không thể tải danh sách công việc yêu thích. Vui lòng thử lại.');
        setFavorites([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [pagination.currentPage]);

  const handleUnfavorite = async (jobId: number) => {
    try {
      await jobService.unfavoriteJob(jobId);
      // Remove from local state
      setFavorites(prev => prev.filter(job => job.id !== jobId));
      setPagination(prev => ({
        ...prev,
        totalElements: prev.totalElements - 1
      }));
    } catch (err: any) {
      console.error('Failed to unfavorite job:', err);
      setError('Không thể bỏ yêu thích công việc này. Vui lòng thử lại.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600">Đang tải danh sách yêu thích...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Công việc yêu thích</h1>
        <p className="text-gray-600">
          Danh sách các công việc bạn đã lưu để xem lại sau ({pagination.totalElements} công việc)
        </p>
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

      <div className="bg-white rounded-lg shadow-sm">
        {favorites.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có công việc yêu thích</h3>
            <p className="mt-1 text-sm text-gray-500">Bạn chưa lưu công việc nào.</p>
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
          <div className="divide-y divide-gray-200">
            {favorites.map((job) => (
              <div key={job.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="h-12 w-12 rounded bg-gray-200 flex items-center justify-center">
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
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600 cursor-pointer">
                            {job.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {job.company.name} • {job.location}
                          </p>
                          <p className="text-sm font-medium text-green-600 mt-1">
                            {jobService.formatSalary(job.salary)}
                          </p>
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
                          <p className="text-xs text-gray-500 mt-2">
                            Đăng ngày: {jobService.formatDate(job.createdAt)} • {job.appliedCount}/{job.hiringQuota} ứng viên
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button 
                      onClick={() => handleUnfavorite(job.id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
                      title="Bỏ yêu thích"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <Link
                      to={`/jobs/${job.id}`}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Hiển thị {((pagination.currentPage - 1) * pagination.pageSize) + 1} - {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalElements)} trong {pagination.totalElements} kết quả
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                  disabled={pagination.currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                <span className="px-3 py-2 text-sm font-medium text-gray-700">
                  Trang {pagination.currentPage} / {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites; 
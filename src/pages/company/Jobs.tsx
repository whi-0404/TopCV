import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import jobService, { JobPost, PageResponse } from '../../services/jobService';

const CompanyJobs: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalElements: 0,
    pageSize: 10
  });

  // Fetch company jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const response: PageResponse<JobPost> = await jobService.getMyJobPosts(pagination.currentPage);
        
        setJobs(response.Data || []);
        setPagination(prev => ({
          ...prev,
          totalPages: response.totalPages,
          totalElements: response.totalElements,
          pageSize: response.pageSize
        }));
        setError('');
      } catch (err: any) {
        console.error('Failed to fetch company jobs:', err);
        setError('Không thể tải danh sách tin tuyển dụng. Vui lòng thử lại.');
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [pagination.currentPage]);

  const handleCloseJob = async (jobId: number) => {
    try {
      await jobService.closeJobPost(jobId);
      // Update local state
      setJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, status: 'CLOSED' } : job
      ));
    } catch (err: any) {
      console.error('Failed to close job:', err);
      setError('Không thể đóng tin tuyển dụng này. Vui lòng thử lại.');
    }
  };

  const handleReopenJob = async (jobId: number) => {
    try {
      await jobService.reopenJobPost(jobId);
      // Update local state
      setJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, status: 'ACTIVE' } : job
      ));
    } catch (err: any) {
      console.error('Failed to reopen job:', err);
      setError('Không thể mở lại tin tuyển dụng này. Vui lòng thử lại.');
    }
  };

  const filteredJobs = filter === 'all' 
    ? jobs 
    : jobs.filter(job => job.status?.toLowerCase() === filter.toLowerCase());

  // Calculate counts for tabs
  const jobCounts = {
    all: jobs.length,
    active: jobs.filter(j => j.status === 'ACTIVE').length,
    suspended: jobs.filter(j => j.status === 'SUSPENDED').length,
    closed: jobs.filter(j => j.status === 'CLOSED').length
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600">Đang tải danh sách tin tuyển dụng...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Quản lý tin tuyển dụng</h1>
          <p className="text-gray-600">
            Quản lý và theo dõi các tin tuyển dụng của công ty ({pagination.totalElements} tin)
          </p>
        </div>
        <Link
          to="/company/jobs/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Đăng tin mới
        </Link>
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

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { key: 'all', label: 'Tất cả', count: jobCounts.all },
              { key: 'active', label: 'Đang tuyển', count: jobCounts.active },
              { key: 'suspended', label: 'Tạm dừng', count: jobCounts.suspended },
              { key: 'closed', label: 'Đã đóng', count: jobCounts.closed }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  filter === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Jobs List */}
      <div className="bg-white rounded-lg shadow-sm">
        {filteredJobs.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {filter === 'all' ? 'Chưa có tin tuyển dụng' : `Không có tin tuyển dụng ${filter}`}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'all' ? 'Bắt đầu bằng cách đăng tin tuyển dụng đầu tiên.' : 'Thay đổi bộ lọc để xem tin tuyển dụng khác.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredJobs.map((job) => (
              <div key={job.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${jobService.getJobStatusColor(job.status || '')}`}>
                        {jobService.formatJobStatus(job.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {job.location} • {job.jobType?.name || 'Không xác định'} • {jobService.formatSalary(job.salary)}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {job.skills?.slice(0, 4).map((skill) => (
                        <span
                          key={skill.id}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {skill.name}
                        </span>
                      ))}
                      {(job.skills?.length || 0) > 4 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-600">
                          +{(job.skills?.length || 0) - 4} kỹ năng khác
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Đăng ngày: {jobService.formatDate(job.createdAt)} • 
                      Hạn nộp: {jobService.formatDate(job.deadline)} • 
                      Yêu cầu kinh nghiệm: {job.experienceRequired}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{job.appliedCount}</div>
                      <div className="text-sm text-gray-500">ứng viên</div>
                      <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${jobService.formatApplicantProgress(job.appliedCount, job.hiringQuota)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Mục tiêu: {job.hiringQuota}
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Link
                        to={`/company/candidates?jobId=${job.id}`}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Xem ứng viên
                      </Link>
                      <Link
                        to={`/company/jobs/edit/${job.id}`}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Chỉnh sửa
                      </Link>
                      {job.status === 'ACTIVE' ? (
                        <button
                          onClick={() => handleCloseJob(job.id)}
                          className="inline-flex items-center px-3 py-1 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                        >
                          Đóng tin
                        </button>
                      ) : job.status === 'CLOSED' ? (
                        <button
                          onClick={() => handleReopenJob(job.id)}
                          className="inline-flex items-center px-3 py-1 border border-green-300 text-sm font-medium rounded-md text-green-700 bg-white hover:bg-green-50"
                        >
                          Mở lại
                        </button>
                      ) : null}
                    </div>
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

export default CompanyJobs; 
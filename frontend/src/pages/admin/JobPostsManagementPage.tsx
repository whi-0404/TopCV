import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import {
  BriefcaseIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ClockIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { jobPostApi, type JobPostDashboardResponse } from '../../services/api';

interface PageResponse<T> {
  data: T[];
  pageSize: number;
  totalPages: number;
  totalElements: number;
}

const JobPostsManagementPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobPosts, setJobPosts] = useState<JobPostDashboardResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const pageSize = 12;

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchPendingJobPosts();
    }
  }, [user, currentPage, searchKeyword]);

  // Auto-hide success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Lấy danh sách job posts có status PENDING
  const fetchPendingJobPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const searchParams = {
        keyword: searchKeyword.trim() || undefined,
        status: 'PENDING', // Chỉ lấy các job posts đang chờ duyệt
        page: currentPage,
        size: pageSize,
        sortBy: 'createdAt',
        sortDirection: 'desc' as 'desc'
      };

      console.log('🔍 Fetching pending job posts with params:', searchParams);
      const response = await jobPostApi.searchJobPosts(searchParams);
      console.log('📝 API Response:', response);
      
      setJobPosts(response.result.data || []);
      setTotalPages(response.result.totalPages);
      setTotalElements(response.result.totalElements);
      
      // Debug: Log first job post để xem cấu trúc dữ liệu
      if (response.result.data && response.result.data.length > 0) {
        console.log('🏢 First job post data:', response.result.data[0]);
      }
    } catch (error: any) {
      console.error('❌ Error fetching pending job posts:', error);
      setError('Không thể tải danh sách tin tuyển dụng chờ duyệt');
    }
    setLoading(false);
  };

  // Duyệt job post từ PENDING sang ACTIVE
  const handleApproveJobPost = async (jobId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn duyệt tin tuyển dụng này không?')) {
      return;
    }

    console.log('👤 Current user:', user);
    console.log('🔑 Access token:', localStorage.getItem('access_token'));
    console.log('🎯 Approving job ID:', jobId);

    setActionLoading(`approve-${jobId}`);
    setError('');
    setSuccessMessage('');
    
    try {
      await jobPostApi.approveJobPost(jobId);
      console.log('✅ Job approved successfully');
      
      setSuccessMessage(`Đã duyệt thành công tin tuyển dụng ID: ${jobId}`);
      await fetchPendingJobPosts(); // Refresh data
    } catch (error: any) {
      console.error('❌ Error approving job post:', error);
      console.error('📋 Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Detailed error messages
      if (error.response?.status === 403) {
        setError('Không có quyền thực hiện thao tác này. Vui lòng đăng nhập lại với tài khoản Admin.');
      } else if (error.response?.status === 404) {
        setError('Không tìm thấy tin tuyển dụng hoặc tin này không ở trạng thái PENDING.');
      } else if (error.response?.data?.message) {
        setError(`Lỗi: ${error.response.data.message}`);
      } else {
        setError('Không thể duyệt tin tuyển dụng. Vui lòng kiểm tra kết nối mạng.');
      }
    }
    setActionLoading(null);
  };

  // Từ chối job post
  const handleRejectJobPost = async (jobId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn từ chối tin tuyển dụng này không?')) {
      return;
    }
    
    setActionLoading(`reject-${jobId}`);
    setError('');
    setSuccessMessage('');
    
    try {
      await jobPostApi.rejectJobPost(jobId);
      setSuccessMessage(`Đã từ chối tin tuyển dụng ID: ${jobId}`);
      await fetchPendingJobPosts(); // Refresh data
    } catch (error: any) {
      console.error('❌ Error rejecting job post:', error);
      
      if (error.response?.status === 403) {
        setError('Không có quyền thực hiện thao tác này.');
      } else if (error.response?.status === 404) {
        setError('Không tìm thấy tin tuyển dụng hoặc tin này không ở trạng thái PENDING.');
      } else if (error.response?.data?.message) {
        setError(`Lỗi: ${error.response.data.message}`);
    } else {
        setError('Không thể từ chối tin tuyển dụng.');
      }
    }
    setActionLoading(null);
  };

  // Xem chi tiết job post
  const handleViewJobPost = (jobId: number) => {
    navigate(`/jobs/${jobId}`);
  };

  // Format ngày tháng
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Không xác định';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch {
      return 'Không xác định';
    }
  };

  // Pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (!user || user.role !== 'ADMIN') {
    console.log('🚫 Access denied - User:', user, 'Role:', user?.role);
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Không có quyền truy cập</h1>
            <p className="text-gray-600">Bạn cần đăng nhập với quyền Admin để truy cập trang này.</p>
            <div className="mt-4 text-sm text-gray-500">
              <p>Current user: {user?.email || 'Not logged in'}</p>
              <p>Current role: {user?.role || 'No role'}</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Duyệt Tin Tuyển Dụng
          </h1>
          <p className="text-gray-600">
            Quản lý và duyệt các tin tuyển dụng đang chờ phê duyệt
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-yellow-600">Chờ duyệt</p>
                <p className="text-2xl font-bold text-yellow-900">{totalElements}</p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center">
              <BriefcaseIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-600">Tổng tin tuyển dụng</p>
                <p className="text-2xl font-bold text-blue-900">{totalElements}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-green-600">Trang hiện tại</p>
                <p className="text-2xl font-bold text-green-900">{currentPage}/{totalPages}</p>
                </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
                  <input
                    type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tìm kiếm theo tên công việc..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                  />
                </div>
              </div>
              
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <XCircleIcon className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
              </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <CheckCircleIcon className="h-5 w-5 text-green-400" />
              <div className="ml-3">
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
            </div>
          )}

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Đang tải...</span>
          </div>
        ) : (
          <>
            {/* Job Posts Grid */}
            {jobPosts.length === 0 ? (
              <div className="text-center py-12">
                <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Không có tin tuyển dụng nào</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Hiện tại không có tin tuyển dụng nào đang chờ duyệt.
                </p>
            </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {jobPosts.map((job) => (
                  <div key={job.id} className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                    {/* Header với logo công ty */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-start space-x-3">
                        {job.logo ? (
                          <img
                            src={job.logo.startsWith('http') ? job.logo : `http://localhost:8080/TopCV${job.logo}`}
                            alt={job.companyName}
                            className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                            onError={(e) => {
                              console.log('❌ Logo load error for:', job.logo);
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallbackDiv = target.nextElementSibling as HTMLElement;
                              if (fallbackDiv) fallbackDiv.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className={`w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center ${job.logo ? 'hidden' : ''}`}>
                          <BuildingOfficeIcon className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {job.title}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">
                            {job.companyName}
                          </p>
                        </div>
                      </div>
                        </div>

                    {/* Job Details */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPinIcon className="h-4 w-4 mr-2" />
                        <span>{job.location}</span>
                          </div>
                      
                      {job.salary && (
                        <div className="flex items-center text-sm text-gray-600">
                          <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                          <span>{job.salary}</span>
                        </div>
                      )}

                      <div className="flex items-center text-sm text-gray-600">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        <span>Hạn nộp: {formatDate(job.deadline)}</span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <ClockIcon className="h-4 w-4 mr-2" />
                        <span>Tạo: {formatDate(job.createdAt)}</span>
                        </div>

                      {/* Job Type & Level */}
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {job.type?.name}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {job.level?.name}
                        </span>
                        </div>

                      {/* Status Badge */}
                      <div className="flex justify-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          Chờ duyệt
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="px-6 py-4 border-t border-gray-100 flex space-x-3">
                      {/* View Button */}
                        <button
                        onClick={() => handleViewJobPost(job.id)}
                        className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        Xem
                        </button>
                        
                      {/* Approve Button */}
                            <button
                              onClick={() => handleApproveJobPost(job.id)}
                              disabled={actionLoading === `approve-${job.id}`}
                        className="flex-1 flex items-center justify-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading === `approve-${job.id}` ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            Duyệt
                          </>
                        )}
                            </button>

                      {/* Reject Button */}
                            <button
                              onClick={() => handleRejectJobPost(job.id)}
                              disabled={actionLoading === `reject-${job.id}`}
                        className="flex-1 flex items-center justify-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading === `reject-${job.id}` ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <XCircleIcon className="h-4 w-4 mr-1" />
                            Từ chối
                          </>
                        )}
                        </button>
                      </div>
                  </div>
                ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                <div className="flex flex-1 justify-between sm:hidden">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                      Hiển thị{' '}
                      <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span>
                      {' '}-{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * pageSize, totalElements)}
                      </span>
                      {' '}trong{' '}
                      <span className="font-medium">{totalElements}</span>
                      {' '}kết quả
                  </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="sr-only">Trang trước</span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                        </svg>
                    </button>
                    
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const pageNum = Math.max(1, currentPage - 2) + i;
                      if (pageNum > totalPages) return null;
                      
                      return (
                        <button
                          key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                            currentPage === pageNum
                                ? 'z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                                : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="sr-only">Trang sau</span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                        </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default JobPostsManagementPage; 
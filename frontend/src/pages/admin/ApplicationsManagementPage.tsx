import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import {
  DocumentTextIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  UserIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { applicationApi, type ApplicationResponse, type PageResponse } from '../../services/api/applicationApi';

const ApplicationsManagementPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<ApplicationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const pageSize = 20;

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchApplications();
    }
  }, [user, currentPage, searchKeyword, statusFilter]);

  const fetchApplications = async () => {
    setLoading(true);
    setError('');
    try {
      let response;
      
      if (searchKeyword.trim()) {
        response = await applicationApi.searchApplications(searchKeyword.trim(), currentPage, pageSize);
      } else {
        // Use search with empty keyword to get all applications
        response = await applicationApi.searchApplications('', currentPage, pageSize);
      }

      let filteredApplications = response.result.data || [];

      // Apply status filter
      if (statusFilter !== 'ALL') {
        filteredApplications = filteredApplications.filter(app => app.status === statusFilter);
      }

      setApplications(filteredApplications);
      setTotalPages(response.result.totalPages);
      setTotalElements(response.result.totalElements);
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      setError('Không thể tải danh sách đơn ứng tuyển');
    }
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Chờ xem xét</span>;
      case 'REVIEWING':
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Đang xem xét</span>;
      case 'SHORTLISTED':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Đã chọn</span>;
      case 'INTERVIEWED':
        return <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">Đã phỏng vấn</span>;
      case 'HIRED':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Đã tuyển</span>;
      case 'REJECTED':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Bị từ chối</span>;
      case 'WITHDRAWN':
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Đã rút</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">{status}</span>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-600';
      case 'REVIEWING': return 'text-blue-600';
      case 'SHORTLISTED': return 'text-green-600';
      case 'INTERVIEWED': return 'text-purple-600';
      case 'HIRED': return 'text-green-600';
      case 'REJECTED': return 'text-red-600';
      case 'WITHDRAWN': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <ClockIcon className="h-4 w-4" />;
      case 'REVIEWING':
        return <EyeIcon className="h-4 w-4" />;
      case 'SHORTLISTED':
      case 'HIRED':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'REJECTED':
        return <XCircleIcon className="h-4 w-4" />;
      case 'WITHDRAWN':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      default:
        return <DocumentTextIcon className="h-4 w-4" />;
    }
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Quản lý đơn ứng tuyển</h1>
                <p className="text-gray-600 mt-1">
                  Tổng cộng {totalElements} đơn ứng tuyển
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tìm kiếm đơn ứng tuyển
                </label>
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="Tìm theo tên ứng viên, vị trí, công ty..."
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ALL">Tất cả trạng thái</option>
                  <option value="PENDING">Chờ xem xét</option>
                  <option value="REVIEWING">Đang xem xét</option>
                  <option value="SHORTLISTED">Đã chọn</option>
                  <option value="INTERVIEWED">Đã phỏng vấn</option>
                  <option value="HIRED">Đã tuyển</option>
                  <option value="REJECTED">Bị từ chối</option>
                  <option value="WITHDRAWN">Đã rút</option>
                </select>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {loading && (
            <div className="bg-blue-50 border border-blue-200 text-blue-600 px-4 py-3 rounded-lg mb-6">
              Đang tải danh sách đơn ứng tuyển...
            </div>
          )}

          {/* Applications Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Ứng viên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Vị trí ứng tuyển
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Công ty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Ngày ứng tuyển
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {application.user?.fullname || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {application.user?.email || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-green-100 rounded flex items-center justify-center">
                          <BriefcaseIcon className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {application.jobPost?.title || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {application.jobPost?.location || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-purple-100 rounded flex items-center justify-center">
                          <BuildingOfficeIcon className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {application.jobPost?.companyName || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`mr-2 ${getStatusColor(application.status)}`}>
                          {getStatusIcon(application.status)}
                        </div>
                        {getStatusBadge(application.status)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {formatDate(application.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/admin/applications/${application.id}`)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="Xem chi tiết"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        
                        {application.resume && (
                          <button
                            onClick={() => {
                              if (application.resume?.filePath) {
                                window.open(application.resume.filePath, '_blank');
                              }
                            }}
                            className="text-green-600 hover:text-green-800 p-1"
                            title="Tải CV"
                          >
                            <ArrowDownTrayIcon className="h-4 w-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => navigate(`/jobs/${application.jobPost?.id}`)}
                          className="text-purple-600 hover:text-purple-800 p-1"
                          title="Xem tin tuyển dụng"
                        >
                          <BriefcaseIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!loading && applications.length === 0 && (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy đơn ứng tuyển</h3>
              <p className="text-gray-600">
                {searchKeyword || statusFilter !== 'ALL'
                  ? 'Không có đơn ứng tuyển nào phù hợp với bộ lọc hiện tại.'
                  : 'Chưa có đơn ứng tuyển nào trong hệ thống.'}
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow mt-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Hiển thị <span className="font-medium">{((currentPage - 1) * pageSize) + 1}</span> đến{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * pageSize, totalElements)}
                    </span>{' '}
                    trong tổng số <span className="font-medium">{totalElements}</span> kết quả
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Trước
                    </button>
                    
                    {/* Page numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = Math.max(1, currentPage - 2) + i;
                      if (pageNum > totalPages) return null;
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === pageNum
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Sau
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ApplicationsManagementPage; 
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  EllipsisVerticalIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserCircleIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  TrashIcon,
  XMarkIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { 
  jobPostApi, 
  type JobPostResponse as JobPostApiResponse, 
  type PageResponse as JobPostPageResponse 
} from '../../services/api/jobPostApi';
import {
  HomeIcon,
  UsersIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  FunnelIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const JobsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [jobs, setJobs] = useState<JobPostApiResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; jobId: number | null; jobTitle: string }>({
    isOpen: false,
    jobId: null,
    jobTitle: ''
  });

  const sidebarItems = [
    { icon: HomeIcon, label: 'Tổng quan', href: '/employer/dashboard' },
    { icon: BriefcaseIcon, label: 'Danh sách công việc', active: true, href: '/employer/jobs' },
    { icon: UsersIcon, label: 'Tất cả ứng viên', href: '/employer/candidates' },
    { icon: BuildingOfficeIcon, label: 'Hồ sơ công ty', href: '/employer/company' },
    { icon: Cog6ToothIcon, label: 'Cài đặt', href: '/employer/settings' },
    { icon: QuestionMarkCircleIcon, label: 'Trợ giúp', href: '/employer/help' }
  ];

  useEffect(() => {
    fetchJobs();
  }, [currentPage, pageSize]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      // Không đóng dropdown nếu click vào dropdown menu hoặc button dropdown
      if (target.closest('.dropdown-menu') || target.closest('.dropdown-button')) {
        return;
      }
      if (openDropdown !== null) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await jobPostApi.getMyJobPosts(currentPage, pageSize);
      console.log('My Job Posts Response:', response);
      
      setJobs(response.result.data || []);
      setTotalPages(response.result.totalPages || 1);
    } catch (error: any) {
      console.error('Error fetching jobs:', error);
      setError('Không thể tải danh sách công việc');
      setJobs([]);
    }
    
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getStatusText = (status: string): string => {
    const statusMap: Record<string, string> = {
      'ACTIVE': 'Đã đăng',
      'PENDING': 'Chờ duyệt',
      'CLOSED': 'Đã đóng',
      'SUSPENDED': 'Tạm dừng',
      'REJECTED': 'Bị từ chối',
      'DRAFT': 'Bản nháp'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CLOSED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'SUSPENDED':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (typeName: string) => {
    switch (typeName?.toLowerCase()) {
      case 'full-time':
      case 'fulltime':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'part-time':
      case 'parttime':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'freelance':
      case 'contract':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'internship':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatSalary = (salary?: string): string => {
    if (!salary || salary.trim() === '') return 'Thỏa thuận';
    return salary;
  };

  // Thêm các function để handle job actions
  const handleDeleteJob = async (jobId: number, jobTitle: string) => {
    console.log('handleDeleteJob called:', { jobId, jobTitle });
    setDeleteModal({ isOpen: true, jobId, jobTitle });
  };

  const confirmDeleteJob = async () => {
    console.log('confirmDeleteJob called:', deleteModal);
    if (!deleteModal.jobId) return;

    try {
      console.log('Calling deleteJobPost API for jobId:', deleteModal.jobId);
      await jobPostApi.deleteJobPost(deleteModal.jobId);
      alert('Xóa công việc thành công!');
      fetchJobs(); // Refresh danh sách
      setDeleteModal({ isOpen: false, jobId: null, jobTitle: '' });
    } catch (error: any) {
      console.error('Error deleting job:', error);
      const errorMessage = error.response?.data?.message || 'Không thể xóa công việc';
      alert(`Lỗi: ${errorMessage}`);
    }
  };

  const handleCloseJob = async (jobId: number, jobTitle: string) => {
    console.log('handleCloseJob called:', { jobId, jobTitle });
    if (!window.confirm(`Bạn có chắc chắn muốn đóng công việc "${jobTitle}"?`)) {
      return;
    }

    try {
      console.log('Calling closeJobPost API for jobId:', jobId);
      await jobPostApi.closeJobPost(jobId);
      alert('Đóng công việc thành công!');
      fetchJobs(); // Refresh danh sách
    } catch (error: any) {
      console.error('Error closing job:', error);
      const errorMessage = error.response?.data?.message || 'Không thể đóng công việc';
      alert(`Lỗi: ${errorMessage}`);
    }
  };

  const handleReopenJob = async (jobId: number, jobTitle: string) => {
    console.log('handleReopenJob called:', { jobId, jobTitle });
    if (!window.confirm(`Bạn có chắc chắn muốn mở lại công việc "${jobTitle}"?`)) {
      return;
    }

    try {
      console.log('Calling reopenJobPost API for jobId:', jobId);
      await jobPostApi.reopenJobPost(jobId);
      alert('Mở lại công việc thành công!');
      fetchJobs(); // Refresh danh sách
    } catch (error: any) {
      console.error('Error reopening job:', error);
      const errorMessage = error.response?.data?.message || 'Không thể mở lại công việc';
      alert(`Lỗi: ${errorMessage}`);
    }
  };

  // Helper function để check xem có thể thực hiện action không
  const canEditJob = (job: JobPostApiResponse): boolean => {
    const result = job.status === 'PENDING' || job.status === 'ACTIVE';
    console.log('canEditJob:', { jobId: job.id, status: job.status, result });
    return result;
  };

  const canDeleteJob = (job: JobPostApiResponse): boolean => {
    const result = (job.appliedCount || 0) === 0 || job.status === 'PENDING';
    console.log('canDeleteJob:', { jobId: job.id, appliedCount: job.appliedCount, status: job.status, result });
    return result;
  };

  const canCloseJob = (job: JobPostApiResponse): boolean => {
    const result = job.status === 'ACTIVE';
    console.log('canCloseJob:', { jobId: job.id, status: job.status, result });
    return result;
  };

  const canReopenJob = (job: JobPostApiResponse): boolean => {
    const result = job.status === 'CLOSED';
    console.log('canReopenJob:', { jobId: job.id, status: job.status, result });
    return result;
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || job.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

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
                <span className="text-orange-600 font-medium">
                  {jobs.length > 0 ? jobs[0].company?.name || 'Chưa có công ty' : 'Đang tải...'}
                </span>
                <ChevronDownIcon className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/employer/jobs/create"
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center space-x-2"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Đăng việc làm</span>
              </Link>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Danh sách công việc</h1>
            </div>
            <div className="flex items-center space-x-2">
              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm công việc..."
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>
              {/* Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="ACTIVE">Đã đăng</option>
                <option value="PENDING">Chờ duyệt</option>
                <option value="CLOSED">Đã đóng</option>
                <option value="SUSPENDED">Tạm dừng</option>
                <option value="REJECTED">Bị từ chối</option>
                <option value="DRAFT">Bản nháp</option>
              </select>
            </div>
          </div>
        </header>

        {/* Jobs Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mb-4"></div>
                <p className="text-gray-600">Đang tải danh sách công việc...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchJobs}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Thử lại
                </button>
              </div>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="text-center">
                <BriefcaseIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {jobs.length === 0 ? 'Chưa có công việc nào' : 'Không tìm thấy công việc phù hợp'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {jobs.length === 0 
                    ? 'Bạn chưa đăng công việc nào. Hãy tạo công việc đầu tiên!'
                    : 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.'
                  }
                </p>
                {jobs.length === 0 && (
                  <Link
                    to="/employer/jobs/create"
                    className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Đăng việc làm
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <>
          {/* Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <div className="grid grid-cols-8 gap-4 text-sm font-medium text-gray-700">
                <div className="col-span-2">Vị trí</div>
                <div>Tình trạng</div>
                <div>Ngày đăng</div>
                <div>Hạn chót</div>
                <div>Loại công việc</div>
                    <div>Lương</div>
                    <div>Ứng viên</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {filteredJobs.map((job) => (
                <div key={job.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="grid grid-cols-8 gap-4 items-center">
                    {/* Position */}
                    <div className="col-span-2">
                      <h3 className="font-medium text-gray-900">{job.title}</h3>
                          <p className="text-sm text-gray-500">{job.location}</p>
                    </div>

                    {/* Status */}
                    <div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(job.status)}`}>
                            {getStatusText(job.status)}
                      </span>
                    </div>

                    {/* Posted Date */}
                    <div className="text-sm text-gray-600">
                          {formatDate(job.createdAt)}
                    </div>

                    {/* Deadline */}
                    <div className="text-sm text-gray-600">
                          {formatDate(job.deadline)}
                    </div>

                    {/* Job Type */}
                    <div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(job.jobType?.name)}`}>
                            {job.jobType?.name || 'N/A'}
                      </span>
                    </div>

                        {/* Salary */}
                    <div className="text-sm text-gray-600">
                          {formatSalary(job.salary)}
                    </div>

                    {/* Applications */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                            {job.appliedCount || 0} / {job.hiringQuota || 0}
                      </span>
                          <div className="flex items-center space-x-1 relative">
                            <Link
                              to={`/employer/jobs/${job.id}`}
                              className="p-1 text-gray-400 hover:text-emerald-600 transition-colors"
                              title="Xem chi tiết"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </Link>
                            {canEditJob(job) && (
                              <Link
                                to={`/employer/jobs/${job.id}/edit`}
                                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                title="Chỉnh sửa"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </Link>
                            )}
                            <div className="relative">
                              <button
                                onClick={() => setOpenDropdown(openDropdown === job.id ? null : job.id)}
                                className="dropdown-button p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                title="Thêm tùy chọn"
                              >
                                <EllipsisVerticalIcon className="h-4 w-4" />
                              </button>
                              
                              {/* Dropdown Menu */}
                              {openDropdown === job.id && (
                                <div className="dropdown-menu absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                  {(() => {
                                    console.log('Rendering dropdown for job:', {
                                      jobId: job.id,
                                      status: job.status,
                                      appliedCount: job.appliedCount,
                                      canClose: canCloseJob(job),
                                      canReopen: canReopenJob(job),
                                      canDelete: canDeleteJob(job)
                                    });
                                    return null;
                                  })()}
                                  {canCloseJob(job) && (
                                    <button
                                      onClick={() => {
                                        console.log('Close button clicked for job:', job.id);
                                        handleCloseJob(job.id, job.title);
                                        setOpenDropdown(null);
                                      }}
                                      className="w-full px-4 py-2 text-left text-sm text-orange-600 hover:bg-orange-50 flex items-center space-x-2"
                                    >
                                      <XMarkIcon className="h-4 w-4" />
                                      <span>Đóng tin tuyển dụng</span>
                                    </button>
                                  )}
                                  {canReopenJob(job) && (
                                    <button
                                      onClick={() => {
                                        console.log('Reopen button clicked for job:', job.id);
                                        handleReopenJob(job.id, job.title);
                                        setOpenDropdown(null);
                                      }}
                                      className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 flex items-center space-x-2"
                                    >
                                      <ArrowPathIcon className="h-4 w-4" />
                                      <span>Mở lại tin tuyển dụng</span>
                                    </button>
                                  )}
                                  {canDeleteJob(job) && (
                                    <button
                                      onClick={() => {
                                        console.log('Delete button clicked for job:', job.id);
                                        handleDeleteJob(job.id, job.title);
                                        setOpenDropdown(null);
                                      }}
                                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                    >
                                      <TrashIcon className="h-4 w-4" />
                                      <span>Xóa tin tuyển dụng</span>
                      </button>
                                  )}
                                  {!canEditJob(job) && !canDeleteJob(job) && !canCloseJob(job) && !canReopenJob(job) && (
                                    <div className="px-4 py-2 text-sm text-gray-500">
                                      Không có hành động khả dụng
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Hiển thị</span>
                  <select 
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-600">công việc / trang</span>
            </div>
            
            <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                &lt;
              </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-emerald-600 text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button 
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    &gt;
              </button>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Xác nhận xóa</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa công việc <strong>"{deleteModal.jobTitle}"</strong>? 
              Hành động này không thể hoàn tác.
            </p>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setDeleteModal({ isOpen: false, jobId: null, jobTitle: '' })}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmDeleteJob}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Xóa
              </button>
            </div>
          </div>
      </div>
      )}
    </div>
  );
};

export default JobsPage; 
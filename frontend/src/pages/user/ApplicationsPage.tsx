import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  HomeIcon,
  UserIcon,
  BriefcaseIcon,
  HeartIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  EyeIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { 
  applicationApi, 
  type ApplicationResponse,
  type ApplicationPageResponse,
  getStatusText,
  getStatusColor,
  canWithdrawApplication
} from '../../services/api';

const ApplicationsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<ApplicationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [withdrawingId, setWithdrawingId] = useState<number | null>(null);

  const pageSize = 10;

  const sidebarItems = [
    { icon: HomeIcon, label: 'Tổng quan', active: false, href: '/user/dashboard' },
    { icon: BriefcaseIcon, label: 'Công việc đã ứng tuyển', active: true, href: '/user/applications' },
    { icon: HeartIcon, label: 'Công việc yêu thích', href: '/user/favorites' },
    { icon: UserCircleIcon, label: 'Trang cá nhân', href: '/user/profile' },
    { icon: Cog6ToothIcon, label: 'Cài đặt', href: '/user/settings' },
    { icon: QuestionMarkCircleIcon, label: 'Trợ giúp', href: '/user/help' }
  ];

  useEffect(() => {
    fetchApplications();
  }, [currentPage, searchKeyword, statusFilter]);

  const fetchApplications = async () => {
    setLoading(true);
    setError('');
    
    try {
      let response;
      
      if (searchKeyword.trim()) {
        // Search applications
        response = await applicationApi.searchApplications(searchKeyword, currentPage, pageSize);
      } else {
        // Get all my applications
        response = await applicationApi.getMyApplications(currentPage, pageSize);
      }
      
      console.log('Applications API Response:', response);
      
      // Safely extract data from response
      const responseData = response?.result?.data || [];
      
      // Filter by status if specified
      let filteredApplications = responseData;
      if (statusFilter !== 'all') {
        filteredApplications = responseData.filter((app: ApplicationResponse) => app.status === statusFilter);
      }
      
      setApplications(filteredApplications);
      setTotalPages(response?.result?.totalPages || 1);
      setTotalElements(response?.result?.totalElements || 0);
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      setError('Không thể tải danh sách đơn ứng tuyển');
      setApplications([]); // Reset to empty array on error
      setTotalPages(1);
      setTotalElements(0);
    }
    
    setLoading(false);
  };

  const handleWithdrawApplication = async (applicationId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn rút đơn ứng tuyển này?')) return;
    
    setWithdrawingId(applicationId);
    
    try {
      await applicationApi.withdrawApplication(applicationId);
      
      // Refresh list
      await fetchApplications();
      
      alert('Đã rút đơn ứng tuyển và xóa khỏi hệ thống thành công');
    } catch (error: any) {
      console.error('Error withdrawing application:', error);
      alert('Không thể rút đơn ứng tuyển. Vui lòng thử lại.');
    }
    
    setWithdrawingId(null);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchApplications();
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatSalary = (salary?: string): string => {
    if (!salary || salary.trim() === '') return 'Thỏa thuận';
    return salary;
  };

  if (!user || user.role !== 'USER') {
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
                <UserIcon className="h-6 w-6 text-emerald-600" />
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
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Công việc đã ứng tuyển</h1>
          <p className="text-gray-600">Theo dõi trạng thái các đơn ứng tuyển của bạn</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Tìm kiếm theo tên công việc, công ty..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="PENDING">Chờ xét duyệt</option>
                <option value="REVIEWING">Đang xem xét</option>
                <option value="SHORTLISTED">Đã qua CV</option>
                <option value="INTERVIEWED">Đã phỏng vấn</option>
                <option value="HIRED">Được tuyển</option>
                <option value="REJECTED">Không phù hợp</option>
              </select>
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
               >
                Tìm kiếm
            </button>
            </div>
          </div>
            </div>

        {/* Applications List */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mb-4"></div>
              <p className="text-gray-600">Đang tải danh sách đơn ứng tuyển...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
                <button
                onClick={fetchApplications}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                Thử lại
                </button>
        </div>
          </div>
        ) : !applications || applications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <BriefcaseIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đơn ứng tuyển nào</h3>
              <p className="text-gray-600 mb-6">
                {searchKeyword || statusFilter !== 'all' 
                  ? 'Không tìm thấy đơn ứng tuyển phù hợp với tiêu chí tìm kiếm'
                  : 'Bạn chưa ứng tuyển công việc nào. Hãy khám phá các cơ hội việc làm hấp dẫn!'
                }
              </p>
              <Link
                to="/jobs"
                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Tìm việc làm
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {applications && applications.map((application) => (
              <div key={application.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {/* Job Info */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          {application.jobPost.logo ? (
                            <img 
                              src={`http://localhost:8080/TopCV/uploads/${application.jobPost.logo}`}
                              alt={application.jobPost.companyName}
                              className="w-10 h-10 object-cover rounded-lg"
                              onError={(e) => {
                                console.error('Application logo failed to load:', application.jobPost.logo);
                                e.currentTarget.style.display = 'none';
                                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                if (fallback) {
                                  fallback.style.display = 'flex';
                                }
                              }}
                            />
                          ) : null}
                          <BuildingOfficeIcon 
                            className="h-6 w-6 text-gray-600" 
                            style={{ display: application.jobPost.logo ? 'none' : 'flex' }}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {application.jobPost.title}
                          </h3>
                          <p className="text-emerald-600 font-medium mb-2">
                            {application.jobPost.companyName}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <MapPinIcon className="h-4 w-4" />
                              <span>{application.jobPost.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <CurrencyDollarIcon className="h-4 w-4" />
                              <span>{formatSalary(application.jobPost.salary)}</span>
                            </div>
                            {application.jobPost.deadline && (
                              <div className="flex items-center space-x-1">
                                <CalendarIcon className="h-4 w-4" />
                                <span>Hạn: {formatDate(application.jobPost.deadline)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                          {getStatusText(application.status)}
                        </span>
                        <p className="text-xs text-gray-500">
                          Ứng tuyển: {formatDate(application.createdAt)}
                        </p>
          </div>
        </div>

                    {/* Cover Letter Preview */}
                    {application.coverLetter && 
                     !application.coverLetter.includes("Applied via AI Screening System") && 
                     !application.coverLetter.includes("AI Screening System") &&
                     application.coverLetter.trim() !== "" && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700 line-clamp-2">
                          <span className="font-medium">Thư xin việc:</span> {application.coverLetter}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-3">
                        <Link
                          to={`/jobs/${application.jobPost.id}`}
                          className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <EyeIcon className="h-4 w-4" />
                          <span>Xem chi tiết</span>
                        </Link>
                        {canWithdrawApplication(application.status) && (
                          <button
                            onClick={() => handleWithdrawApplication(application.id)}
                            disabled={withdrawingId === application.id}
                            className="flex items-center space-x-2 px-3 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 hover:bg-red-50 transition-colors disabled:opacity-50"
                          >
                            <TrashIcon className="h-4 w-4" />
                            <span>{withdrawingId === application.id ? 'Đang rút...' : 'Rút đơn'}</span>
                          </button>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        #{application.id}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Hiển thị <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> đến{' '}
                    <span className="font-medium">{Math.min(currentPage * pageSize, totalElements)}</span> trong{' '}
                    <span className="font-medium">{totalElements}</span> đơn ứng tuyển
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Trước
                    </button>
                    <span className="px-3 py-1 text-sm font-medium text-gray-700">
                      Trang {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Sau
                    </button>
                  </div>
                </div>
        </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationsPage;
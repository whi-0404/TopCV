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
  ChevronDownIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  AdjustmentsHorizontalIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { applicationApi, ApplicationResponse, ApplicationStatus, getStatusText, getStatusColor } from '../../services/api/applicationApi';
import { companyApi, CompanyResponse } from '../../services/api/companyApi';
import Layout from '../../components/layout/Layout';

const CandidatesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterAIDecision, setFilterAIDecision] = useState<string>('all');
  const [applications, setApplications] = useState<ApplicationResponse[]>([]);
  const [company, setCompany] = useState<CompanyResponse | null>(null);
  const [companyLoading, setCompanyLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    fetchApplications();
    fetchCompanyInfo();
  }, [currentPage, pageSize]);

  const fetchApplications = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await applicationApi.getAllApplicationsForEmployer(currentPage, pageSize);
      console.log('Applications Response:', response);
      
      setApplications(response.result.data || []);
      setTotalPages(response.result.totalPages || 1);
      setTotalElements(response.result.totalElements || 0);
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      setError('Không thể tải danh sách ứng viên');
      setApplications([]);
    }
    
    setLoading(false);
  };

  const fetchCompanyInfo = async () => {
    setCompanyLoading(true);
    try {
      const response = await companyApi.getMyCompany();
      console.log('Company Response:', response);
      setCompany(response.result);
    } catch (error: any) {
      console.error('Error fetching company info:', error);
      // Không set error vì có thể employer chưa tạo company
    }
    setCompanyLoading(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
    navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleStatusUpdate = async (applicationId: number, newStatus: ApplicationStatus) => {
    try {
      await applicationApi.updateApplicationStatus(applicationId, { status: newStatus });
      alert('Cập nhật trạng thái thành công!');
      fetchApplications(); // Refresh data
    } catch (error: any) {
      console.error('Error updating status:', error);
      const errorMessage = error.response?.data?.message || 'Không thể cập nhật trạng thái';
      alert(`Lỗi: ${errorMessage}`);
    }
  };

  const handleViewDetail = (applicationId: number) => {
    navigate(`/employer/candidates/${applicationId}`);
  };

  const sidebarItems = [
    { icon: HomeIcon, label: 'Tổng quan', href: '/employer/dashboard' },
    { icon: BriefcaseIcon, label: 'Danh sách công việc', href: '/employer/jobs' },
    { icon: UsersIcon, label: 'Tất cả ứng viên', active: true, href: '/employer/candidates' },
    { icon: BuildingOfficeIcon, label: 'Hồ sơ công ty', href: '/employer/company' },
    { icon: Cog6ToothIcon, label: 'Cài đặt', href: '/employer/settings' },
    { icon: QuestionMarkCircleIcon, label: 'Trợ giúp', href: '/employer/help' }
  ];

  const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case 'PENDING':
        return <ClockIcon className="h-4 w-4" />;
      case 'REVIEWING':
        return <EyeIcon className="h-4 w-4" />;
      case 'SHORTLISTED':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'INTERVIEWED':
        return <ChatBubbleLeftRightIcon className="h-4 w-4" />;
      case 'HIRED':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'REJECTED':
        return <XCircleIcon className="h-4 w-4" />;
      case 'WITHDRAWN':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getScoreColor = (score?: number): string => {
    if (!score) return 'text-gray-500';
    if (score >= 4) return 'text-green-600';
    if (score >= 3) return 'text-yellow-600';
    if (score >= 2) return 'text-orange-600';
    return 'text-red-600';
  };

  // AI Statistics
  const getAIStats = () => {
    const withAI = applications.filter(app => app.screeningResult);
    const passCount = withAI.filter(app => app.screeningResult?.candidateDecision === 'PASS').length;
    const failCount = withAI.filter(app => app.screeningResult?.candidateDecision === 'FAIL').length;
    const reviewCount = withAI.filter(app => app.screeningResult?.candidateDecision === 'REVIEW').length;
    const avgScore = withAI.length > 0 
      ? withAI.reduce((sum, app) => sum + (app.screeningResult?.overallScore || 0), 0) / withAI.length 
      : 0;

    return { withAI: withAI.length, passCount, failCount, reviewCount, avgScore };
  };

  const filteredApplications = applications.filter(application => {
    const matchesSearch = 
      application.user?.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      application.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      application.jobPost?.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || application.status === filterStatus;
    const matchesAIFilter = filterAIDecision === 'all' || 
      application.screeningResult?.candidateDecision === filterAIDecision ||
      (filterAIDecision === 'no-ai' && !application.screeningResult);
    return matchesSearch && matchesFilter && matchesAIFilter;
  });

  // Check if user is employer
  if (!user || user.role !== 'EMPLOYER') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Không có quyền truy cập</h1>
          <p className="text-gray-600 mb-4">Bạn cần đăng nhập với tài khoản nhà tuyển dụng để truy cập trang này.</p>
          <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
            Đăng nhập
          </Link>
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
            <img
              src={user?.avt || `https://via.placeholder.com/40x40?text=${user?.fullname?.charAt(0) || 'E'}`}
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.fullname || 'Nhà tuyển dụng'}
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
                to="/"
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Quay lại trang chủ
              </Link>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tất cả ứng viên</h1>
              <p className="text-gray-600">Quản lý và theo dõi ứng viên đã ứng tuyển</p>
            </div>
          </div>
        </header>

        {/* Candidates Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}

          {!companyLoading && !company && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2" />
                <span className="text-yellow-700">
                  Bạn chưa tạo hồ sơ công ty. 
                  <Link to="/employer/company" className="text-yellow-800 underline ml-1">
                    Tạo ngay
                  </Link>
                </span>
              </div>
            </div>
          )}

          {/* AI Statistics */}
          {applications.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <StarIcon className="h-5 w-5 text-blue-500" />
                <span>Thống kê AI Screening</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{getAIStats().withAI}</div>
                  <div className="text-sm text-blue-700">Đã screening</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{getAIStats().passCount}</div>
                  <div className="text-sm text-green-700">PASS</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{getAIStats().reviewCount}</div>
                  <div className="text-sm text-yellow-700">REVIEW</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{getAIStats().failCount}</div>
                  <div className="text-sm text-red-700">FAIL</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{getAIStats().avgScore.toFixed(1)}</div>
                  <div className="text-sm text-purple-700">Điểm TB</div>
                </div>
              </div>
            </div>
          )}

          {/* Filters and Search */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4 flex-wrap gap-2">
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm ứng viên, vị trí..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none w-80"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="PENDING">Chờ xét duyệt</option>
                  <option value="REVIEWING">Đang xem xét</option>
                  <option value="SHORTLISTED">Đã qua CV</option>
                  <option value="INTERVIEWED">Đã phỏng vấn</option>
                  <option value="HIRED">Được tuyển</option>
                  <option value="REJECTED">Không phù hợp</option>
                </select>
                <select
                  value={filterAIDecision}
                  onChange={(e) => setFilterAIDecision(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                >
                  <option value="all">Tất cả AI</option>
                  <option value="PASS">AI: PASS</option>
                  <option value="REVIEW">AI: REVIEW</option>
                  <option value="FAIL">AI: FAIL</option>
                  <option value="no-ai">Chưa screening</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={fetchApplications}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                >
                  <span>Làm mới</span>
                </button>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              Hiển thị {filteredApplications.length} ứng viên từ tổng số {totalElements}
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải danh sách ứng viên...</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có ứng viên nào</h3>
              <p className="text-gray-600">Chưa có ứng viên nào ứng tuyển vào các vị trí của bạn.</p>
            </div>
          ) : (
            <>
          {/* Candidates List */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-200">
                  {filteredApplications.map((application) => (
                    <div key={application.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                      <img
                            src={application.user?.avt || `https://via.placeholder.com/48x48?text=${application.user?.fullname?.charAt(0) || 'U'}`}
                            alt={application.user?.fullname || 'User'}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                              <h3 className="text-lg font-medium text-gray-900">
                                {application.user?.fullname || 'Không có tên'}
                              </h3>
                              {application.screeningResult?.overallScore && (
                          <div className="flex items-center space-x-1">
                            <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                                  <span className={`text-sm font-medium ${getScoreColor(application.screeningResult.overallScore)}`}>
                                    {application.screeningResult.overallScore.toFixed(1)}/5
                                  </span>
                                </div>
                              )}
                              {application.screeningResult?.candidateDecision && (
                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  application.screeningResult.candidateDecision === 'PASS' 
                                    ? 'bg-green-100 text-green-800 border border-green-200' 
                                    : application.screeningResult.candidateDecision === 'FAIL'
                                    ? 'bg-red-100 text-red-800 border border-red-200'
                                    : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                }`}>
                                  AI: {application.screeningResult.candidateDecision}
                          </div>
                              )}
                        </div>
                        
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <span>{application.user?.email}</span>
                              {application.user?.phone && <span>{application.user.phone}</span>}
                        </div>
                        
                        <div className="flex items-center space-x-4 mt-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <BriefcaseIcon className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-600">Ứng tuyển: {application.jobPost?.title}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CalendarIcon className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-600">{formatDate(application.createdAt)}</span>
                              </div>
                            </div>

                            {/* AI Screening Results */}
                            {application.screeningResult ? (
                              <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="text-sm font-semibold text-gray-900 flex items-center space-x-2">
                                    <StarIcon className="h-4 w-4 text-blue-500" />
                                    <span>Đánh giá AI</span>
                                  </h4>
                                  {application.screeningResult.screenedAt && (
                                    <span className="text-xs text-gray-500">
                                      {formatDate(application.screeningResult.screenedAt)}
                                    </span>
                                  )}
                                </div>

                                {/* Score and Decision */}
                                <div className="grid grid-cols-2 gap-4 mb-3">
                                  <div className="flex flex-col space-y-1">
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm text-gray-600">Điểm tổng:</span>
                                      <span className={`font-semibold ${getScoreColor(application.screeningResult.overallScore)}`}>
                                        {application.screeningResult.overallScore?.toFixed(1)}/5.0
                                      </span>
                                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                                        application.screeningResult.scoreLevel === 'EXCELLENT' ? 'bg-green-100 text-green-800' :
                                        application.screeningResult.scoreLevel === 'GOOD' ? 'bg-blue-100 text-blue-800' :
                                        application.screeningResult.scoreLevel === 'AVERAGE' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                      }`}>
                                        {application.screeningResult.scoreLevel}
                                      </span>
                                    </div>
                                    {/* Progress Bar */}
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div 
                                        className={`h-2 rounded-full transition-all duration-300 ${
                                          (application.screeningResult.overallScore || 0) >= 4 ? 'bg-green-500' :
                                          (application.screeningResult.overallScore || 0) >= 3 ? 'bg-yellow-500' :
                                          (application.screeningResult.overallScore || 0) >= 2 ? 'bg-orange-500' :
                                          'bg-red-500'
                                        }`}
                                        style={{ width: `${((application.screeningResult.overallScore || 0) / 5) * 100}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-600">Quyết định:</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      application.screeningResult.candidateDecision === 'PASS' 
                                        ? 'bg-green-100 text-green-800' 
                                        : application.screeningResult.candidateDecision === 'FAIL'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {application.screeningResult.candidateDecision}
                                    </span>
                                  </div>
                                </div>

                                {/* Matching Points */}
                                {application.screeningResult.matchingPoints && application.screeningResult.matchingPoints.length > 0 && (
                                  <div className="mb-3">
                                    <h5 className="text-xs font-medium text-green-700 mb-2 flex items-center space-x-1">
                                      <CheckCircleIcon className="h-3 w-3" />
                                      <span>Điểm phù hợp ({application.screeningResult.matchingPoints.length})</span>
                                    </h5>
                                    <div className="flex flex-wrap gap-1">
                                      {application.screeningResult.matchingPoints.map((point, index) => (
                                        <span
                                          key={index}
                                          className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full border border-green-200"
                                        >
                                          {point}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Not Matching Points */}
                                {application.screeningResult.notMatchingPoints && application.screeningResult.notMatchingPoints.length > 0 && (
                                  <div className="mb-3">
                                    <h5 className="text-xs font-medium text-red-700 mb-2 flex items-center space-x-1">
                                      <XCircleIcon className="h-3 w-3" />
                                      <span>Điểm chưa phù hợp ({application.screeningResult.notMatchingPoints.length})</span>
                                    </h5>
                                    <div className="flex flex-wrap gap-1">
                                      {application.screeningResult.notMatchingPoints.map((point, index) => (
                                        <span
                                          key={index}
                                          className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full border border-red-200"
                                        >
                                          {point}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* AI Recommendation */}
                                {application.screeningResult.recommendation && (
                                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <h5 className="text-xs font-medium text-blue-700 mb-1 flex items-center space-x-1">
                                      <ChatBubbleLeftRightIcon className="h-3 w-3" />
                                      <span>Khuyến nghị AI</span>
                                    </h5>
                                    <p className="text-sm text-blue-800 leading-relaxed">
                                      {application.screeningResult.recommendation}
                                    </p>
                                  </div>
                                                                 )}
                               </div>
                             ) : (
                               <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                 <div className="flex items-center space-x-2 text-yellow-700">
                                   <ExclamationTriangleIcon className="h-4 w-4" />
                                   <span className="text-sm font-medium">Chưa có đánh giá AI</span>
                                 </div>
                                 <p className="text-xs text-yellow-600 mt-1">
                                   CV chưa được phân tích bởi hệ thống AI
                                 </p>
                               </div>
                             )}

                            {/* Cover Letter */}
                            {application.coverLetter && (
                              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                <h5 className="text-xs font-medium text-gray-700 mb-1">Thư xin việc</h5>
                                <p className="text-sm text-gray-700 line-clamp-3">
                                  {application.coverLetter}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end space-y-3 ml-4">
                          {/* Status Badge */}
                          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
                            {getStatusIcon(application.status)}
                            <span>{getStatusText(application.status)}</span>
                    </div>
                    
                          {/* Action Buttons */}
                          <div className="flex flex-col space-y-2">
                            <select
                              value={application.status}
                              onChange={(e) => handleStatusUpdate(application.id, e.target.value as ApplicationStatus)}
                              className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 min-w-[140px]"
                            >
                              <option value="PENDING">Chờ xét duyệt</option>
                              <option value="REVIEWING">Đang xem xét</option>
                              <option value="SHORTLISTED">Đã qua CV</option>
                              <option value="INTERVIEWED">Đã phỏng vấn</option>
                              <option value="HIRED">Được tuyển</option>
                              <option value="REJECTED">Không phù hợp</option>
                            </select>
                      
                            <div className="flex items-center space-x-1">
                              <button 
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Xem chi tiết"
                                onClick={() => handleViewDetail(application.id)}
                              >
                                <EyeIcon className="h-4 w-4" />
                        </button>
                              <button 
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Nhắn tin"
                              >
                                <ChatBubbleLeftRightIcon className="h-4 w-4" />
                        </button>
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
                  <span className="text-sm text-gray-600">ứng viên / trang</span>
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
    </div>
  );
};

export default CandidatesPage; 
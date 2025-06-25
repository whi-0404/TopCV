import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { jobPostApi, JobPostResponse, JobPostStatus } from '../../services/api/jobPostApi';
import { applicationApi, ApplicationResponse, ApplicationStatus } from '../../services/api/applicationApi';
import { companyApi } from '../../services/api/companyApi';
import { 
  MapPinIcon, 
  CurrencyDollarIcon,
  CalendarIcon,
  UserGroupIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  ClockIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  DocumentTextIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  StarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  UsersIcon,
  BuildingOfficeIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

const EmployerJobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [job, setJob] = useState<JobPostResponse | null>(null);
  const [applications, setApplications] = useState<ApplicationResponse[]>([]);
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [companyLoading, setCompanyLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalApplications, setTotalApplications] = useState(0);
  const [expandedApplication, setExpandedApplication] = useState<number | null>(null);

  // Sidebar items
  const sidebarItems = [
    { icon: HomeIcon, label: 'Tổng quan', active: false, href: '/employer/dashboard' },
    { icon: BriefcaseIcon, label: 'Danh sách công việc', active: true, href: '/employer/jobs' },
    { icon: UsersIcon, label: 'Tất cả ứng viên', href: '/employer/candidates' },
    { icon: BuildingOfficeIcon, label: 'Hồ sơ công ty', href: '/employer/company' },
    { icon: Cog6ToothIcon, label: 'Cài đặt', href: '/employer/settings' },
    { icon: QuestionMarkCircleIcon, label: 'Trợ giúp', href: '/employer/help' }
  ];

  useEffect(() => {
    if (!user || user.role !== 'EMPLOYER') {
      navigate('/auth/login');
      return;
    }

    if (!id) {
      navigate('/employer/jobs');
      return;
    }

    fetchJobDetails();
    fetchApplications();
    fetchCompanyInfo();
  }, [id, navigate, user]);

  useEffect(() => {
    if (id) {
      fetchApplications();
    }
  }, [currentPage, id]);

  const fetchJobDetails = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);

      const jobResponse = await jobPostApi.getJobPostDetail(Number(id));
      
      if (jobResponse.code === 1000 && jobResponse.result) {
        setJob(jobResponse.result);
      } else {
        setError('Không thể tải thông tin công việc');
      }
    } catch (err) {
      console.error('Error fetching job details:', err);
      setError('Đã có lỗi xảy ra khi tải thông tin công việc');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    if (!id) return;
    
    try {
      setApplicationsLoading(true);
      const response = await applicationApi.getJobApplications(Number(id), currentPage, 10);
      
      if (response.code === 1000 && response.result) {
        setApplications(response.result.data || []);
        setTotalPages(response.result.totalPages || 0);
        setTotalApplications(response.result.totalElements || 0);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setApplicationsLoading(false);
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

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleStatusUpdate = async (applicationId: number, newStatus: ApplicationStatus) => {
    try {
      await applicationApi.updateApplicationStatus(applicationId, { status: newStatus });
      // Refresh applications list
      fetchApplications();
    } catch (err) {
      console.error('Error updating application status:', err);
      alert('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const formatSalary = (salary?: string): string => {
    if (!salary || salary.trim() === '') return 'Thỏa thuận';
    return salary;
  };

  const formatDeadline = (deadline: string): string => {
    try {
      const date = new Date(deadline);
      return date.toLocaleDateString('vi-VN');
    } catch {
      return 'Không xác định';
    }
  };

  const formatDateTime = (dateTime: string): string => {
    try {
      const date = new Date(dateTime);
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Không xác định';
    }
  };

  const getStatusColor = (status: JobPostStatus): string => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800';
      case 'CLOSED':
        return 'bg-red-100 text-red-800';
      case 'SUSPENDED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-blue-100 text-blue-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: JobPostStatus): string => {
    switch (status) {
      case 'ACTIVE':
        return 'Đang tuyển';
      case 'DRAFT':
        return 'Bản nháp';
      case 'CLOSED':
        return 'Đã đóng';
      case 'SUSPENDED':
        return 'Tạm dừng';
      case 'PENDING':
        return 'Chờ duyệt';
      case 'APPROVED':
        return 'Đã duyệt';
      case 'REJECTED':
        return 'Bị từ chối';
      default:
        return status;
    }
  };

  const getApplicationStatusColor = (status: ApplicationStatus): string => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REVIEWING':
        return 'bg-blue-100 text-blue-800';
      case 'SHORTLISTED':
        return 'bg-purple-100 text-purple-800';
      case 'INTERVIEWED':
        return 'bg-indigo-100 text-indigo-800';
      case 'HIRED':
        return 'bg-green-200 text-green-900';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'WITHDRAWN':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getApplicationStatusText = (status: ApplicationStatus): string => {
    switch (status) {
      case 'PENDING':
        return 'Chờ xử lý';
      case 'REVIEWING':
        return 'Đang xem xét';
      case 'SHORTLISTED':
        return 'Lọt vòng trong';
      case 'INTERVIEWED':
        return 'Đã phỏng vấn';
      case 'HIRED':
        return 'Đã tuyển';
      case 'REJECTED':
        return 'Từ chối';
      case 'WITHDRAWN':
        return 'Đã rút';
      default:
        return status;
    }
  };

  const getAIDecisionIcon = (decision: string) => {
    switch (decision) {
      case 'PASS':
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case 'FAIL':
        return <XCircleIcon className="w-5 h-5 text-red-600" />;
      case 'REVIEW':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getAIDecisionColor = (decision: string): string => {
    switch (decision) {
      case 'PASS':
        return 'bg-green-100 text-green-800';
      case 'FAIL':
        return 'bg-red-100 text-red-800';
      case 'REVIEW':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
                to="/employer/jobs"
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Quay lại danh sách
              </Link>
              {job && (
                <Link
                  to={`/employer/jobs/${job.id}/edit`}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                >
                  Chỉnh sửa
                </Link>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {loading ? 'Đang tải...' : job?.title || 'Chi tiết công việc'}
              </h1>
              <p className="text-gray-600">Quản lý và theo dõi ứng viên đã ứng tuyển</p>
            </div>
          </div>
        </header>

        {/* Job Detail Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mb-4"></div>
                <p className="text-gray-600">Đang tải thông tin công việc...</p>
              </div>
            </div>
          ) : error || !job ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error || 'Không tìm thấy công việc'}</p>
                <Link
                  to="/employer/jobs"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Quay lại danh sách việc làm
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Job Info Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <div className="flex items-start gap-4 mb-6">
                  {/* Company Logo */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                      {job.company.logo ? (
                        <img
                          src={`http://localhost:8080/TopCV/uploads/${job.company.logo}`}
                          alt={job.company.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error('Company logo failed to load in employer job detail:', job.company.logo);
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                            if (fallback) {
                              fallback.style.display = 'block';
                            }
                          }}
                        />
                      ) : null}
                      <BriefcaseIcon 
                        className="w-8 h-8 text-gray-400" 
                        style={{ display: job.company.logo ? 'none' : 'block' }}
                      />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h2>
                    <p className="text-lg text-gray-600 mb-3">{job.company.name}</p>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
                        {getStatusText(job.status)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Job Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <CurrencyDollarIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Mức lương</div>
                      <div className="font-medium text-green-600">{formatSalary(job.salary)}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPinIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Địa điểm</div>
                      <div className="font-medium">{job.location}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Hạn ứng tuyển</div>
                      <div className="font-medium">{formatDeadline(job.deadline)}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <UserGroupIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Ứng viên</div>
                      <div className="font-medium">{job.appliedCount}/{job.hiringQuota}</div>
                    </div>
                  </div>
                </div>

                {/* Job Classification */}
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {job.jobType.name}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {job.jobLevel.name}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    <AcademicCapIcon className="w-4 h-4 inline mr-1" />
                    {job.experienceRequired}
                  </span>
                  {job.skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Applications List */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Danh sách ứng viên ({totalApplications})
                    </h3>
                    {applicationsLoading && (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
                    )}
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {applications.length === 0 ? (
                    <div className="p-8 text-center">
                      <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Chưa có ứng viên nào ứng tuyển</p>
                    </div>
                  ) : (
                    applications.map((application) => (
                      <div key={application.id} className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            {/* Avatar */}
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                              {application.user?.avt ? (
                                <img
                                  src={application.user.avt}
                                  alt={application.user.fullname}
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                <UserIcon className="w-6 h-6 text-gray-400" />
                              )}
                            </div>

                            {/* Candidate Info */}
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="text-lg font-semibold text-gray-900">
                                  {application.user?.fullname || 'Không có tên'}
                                </h4>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getApplicationStatusColor(application.status)}`}>
                                  {getApplicationStatusText(application.status)}
                                </span>
                              </div>

                              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                <div className="flex items-center gap-1">
                                  <EnvelopeIcon className="w-4 h-4" />
                                  {application.user?.email || 'Không có email'}
                                </div>
                                {application.user?.phone && (
                                  <div className="flex items-center gap-1">
                                    <PhoneIcon className="w-4 h-4" />
                                    {application.user.phone}
                                  </div>
                                )}
                                <div className="flex items-center gap-1">
                                  <ClockIcon className="w-4 h-4" />
                                  {formatDateTime(application.createdAt)}
                                </div>
                              </div>

                              {/* AI Screening Results */}
                              {application.screeningResult && (
                                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                  <div className="flex items-center justify-between mb-3">
                                    <h5 className="font-medium text-gray-900 flex items-center gap-2">
                                      <StarIcon className="w-5 h-5 text-yellow-500" />
                                      Kết quả AI Screening
                                    </h5>
                                    <div className="flex items-center gap-2">
                                      {getAIDecisionIcon(application.screeningResult.candidateDecision)}
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAIDecisionColor(application.screeningResult.candidateDecision)}`}>
                                        {application.screeningResult.candidateDecision}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                    <div>
                                      <div className="text-sm text-gray-600">Điểm số</div>
                                      <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                          <div 
                                            className="bg-blue-600 h-2 rounded-full" 
                                            style={{ width: `${(application.screeningResult.overallScore / 5) * 100}%` }}
                                          ></div>
                                        </div>
                                        <span className="text-sm font-medium">
                                          {application.screeningResult.overallScore}/5
                                        </span>
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-sm text-gray-600">Điểm phù hợp</div>
                                      <div className="text-sm font-medium text-green-600">
                                        {application.screeningResult.matchingPoints?.length || 0} điểm
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-sm text-gray-600">Điểm chưa phù hợp</div>
                                      <div className="text-sm font-medium text-red-600">
                                        {application.screeningResult.notMatchingPoints?.length || 0} điểm
                                      </div>
                                    </div>
                                  </div>

                                  {application.screeningResult.recommendation && (
                                    <div className="text-sm text-gray-700">
                                      <strong>Khuyến nghị:</strong> {application.screeningResult.recommendation}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Cover Letter */}
                              {application.coverLetter && (
                                <div className="mb-4">
                                  <button
                                    onClick={() => setExpandedApplication(
                                      expandedApplication === application.id ? null : application.id
                                    )}
                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                                  >
                                    <DocumentTextIcon className="w-4 h-4" />
                                    Thư xin việc
                                    {expandedApplication === application.id ? (
                                      <ChevronUpIcon className="w-4 h-4" />
                                    ) : (
                                      <ChevronDownIcon className="w-4 h-4" />
                                    )}
                                  </button>
                                  
                                  {expandedApplication === application.id && (
                                    <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                                      {application.coverLetter}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 ml-4">
                            <select
                              value={application.status}
                              onChange={(e) => handleStatusUpdate(application.id, e.target.value as ApplicationStatus)}
                              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                              <option value="PENDING">Chờ xử lý</option>
                              <option value="REVIEWING">Đang xem xét</option>
                              <option value="SHORTLISTED">Lọt vòng trong</option>
                              <option value="INTERVIEWED">Đã phỏng vấn</option>
                              <option value="HIRED">Đã tuyển</option>
                              <option value="REJECTED">Từ chối</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="p-6 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        Hiển thị {((currentPage - 1) * 10) + 1} - {Math.min(currentPage * 10, totalApplications)} trong {totalApplications} ứng viên
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          Trước
                        </button>
                        <span className="px-3 py-1 bg-emerald-600 text-white rounded-md text-sm">
                          {currentPage}
                        </span>
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          Sau
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default EmployerJobDetailPage;
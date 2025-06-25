import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  UserIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon,
  EyeIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  ClockIcon,
  BuildingOfficeIcon,
  HomeIcon,
  UsersIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { applicationApi, ApplicationResponse } from '../../services/api/applicationApi';
import { userApi, UserResponse } from '../../services/api/userApi';

const CandidateDetailPage: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [application, setApplication] = useState<ApplicationResponse | null>(null);
  const [candidate, setCandidate] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDownloadingCV, setIsDownloadingCV] = useState(false);

  const sidebarItems = [
    { icon: HomeIcon, label: 'Tổng quan', href: '/employer/dashboard' },
    { icon: BriefcaseIcon, label: 'Danh sách công việc', href: '/employer/jobs' },
    { icon: UsersIcon, label: 'Tất cả ứng viên', active: true, href: '/employer/candidates' },
    { icon: BuildingOfficeIcon, label: 'Hồ sơ công ty', href: '/employer/company' },
    { icon: Cog6ToothIcon, label: 'Cài đặt', href: '/employer/settings' },
    { icon: QuestionMarkCircleIcon, label: 'Trợ giúp', href: '/employer/help' }
  ];

  useEffect(() => {
    if (!user || user.role !== 'EMPLOYER') {
      navigate('/auth/login');
      return;
    }
    
    if (applicationId) {
      fetchApplicationDetail();
    }
  }, [applicationId, user, navigate]);

  const fetchApplicationDetail = async () => {
    if (!applicationId) return;

    setLoading(true);
    setError('');

    try {
      console.log('Fetching application details for ID:', applicationId);
      
      // Lấy thông tin application
      const applicationResponse = await applicationApi.getApplicationById(parseInt(applicationId));
      console.log('Application response:', applicationResponse);
      setApplication(applicationResponse.result);

      // Lấy thông tin candidate qua applicationId
      console.log('Fetching candidate details for application ID:', applicationId);
      const candidateData = await userApi.getCandidateByApplicationId(parseInt(applicationId));
      console.log('Candidate data:', candidateData);
      setCandidate(candidateData);

    } catch (error: any) {
      console.error('Error fetching application details:', error);
      setError('Không thể tải thông tin chi tiết ứng viên');
    } finally {
      setLoading(false);
    }
  };

  const handleViewCV = async () => {
    if (!applicationId) {
      alert('Không tìm thấy thông tin ứng tuyển');
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('Vui lòng đăng nhập lại');
        return;
      }

      // 🔥 DEBUG: Test debug endpoint trước
      console.log('🔥 Testing debug endpoint first...');
      const debugUrl = `http://localhost:8080/TopCV/api/v1/resumes/debug-employer-access/${applicationId}`;
      const debugResponse = await fetch(debugUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (debugResponse.ok) {
        const debugText = await debugResponse.text();
        console.log('🔥 Debug result:', debugText);
        
        if (!debugText.includes('✅ SUCCESS')) {
          alert('Debug failed: ' + debugText);
          return;
        }
      } else {
        console.error('🔥 Debug endpoint failed:', debugResponse.status);
        alert('Debug endpoint failed: ' + debugResponse.status);
        return;
      }

      // 🔥 Nếu debug OK, tiếp tục với view CV
      console.log('🔥 Debug OK, proceeding to view CV...');
      const url = `http://localhost:8080/TopCV/api/v1/resumes/view-candidate/${applicationId}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Đọc error message từ response
        const errorText = await response.text();
        console.error('🔥 View CV failed:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const blob = await response.blob();
      const url_blob = window.URL.createObjectURL(blob);
      window.open(url_blob, '_blank');
      
      setTimeout(() => {
        window.URL.revokeObjectURL(url_blob);
      }, 60000);
      
    } catch (error: any) {
      console.error('Error viewing CV:', error);
      alert(`Không thể xem CV. Lỗi: ${error?.message || 'Unknown error'}`);
    }
  };

  const handleDownloadCV = async () => {
    if (!applicationId) {
      alert('Không tìm thấy thông tin ứng tuyển');
      return;
    }

    setIsDownloadingCV(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('Vui lòng đăng nhập lại');
        return;
      }

      const response = await fetch(`http://localhost:8080/TopCV/api/v1/resumes/download-candidate/${applicationId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CV_Application_${applicationId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error: any) {
      console.error('Error downloading CV:', error);
      alert('Không thể tải CV. Vui lòng thử lại sau.');
    } finally {
      setIsDownloadingCV(false);
    }
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'Chưa có thông tin';
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

  const getDecisionIcon = (decision?: string) => {
    switch (decision) {
      case 'PASS':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'FAIL':
        return <XCircleIcon className="h-5 w-5 text-red-600" />;
      case 'REVIEW':
        return <ClockIcon className="h-5 w-5 text-yellow-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getDecisionText = (decision?: string): string => {
    switch (decision) {
      case 'PASS':
        return 'Đề xuất phỏng vấn';
      case 'FAIL':
        return 'Không phù hợp';
      case 'REVIEW':
        return 'Cần xem xét thêm';
      default:
        return 'Chưa có đánh giá';
    }
  };

  const getDecisionColor = (decision?: string): string => {
    switch (decision) {
      case 'PASS':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'FAIL':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'REVIEW':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col fixed h-full z-10">
          <div className="p-6 border-b border-gray-200">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-bold text-gray-900">TopJob</span>
            </Link>
          </div>
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {sidebarItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      item.active
                        ? 'bg-emerald-50 text-emerald-700 border-r-2 border-emerald-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-64">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang tải thông tin ứng viên...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col fixed h-full z-10">
          <div className="p-6 border-b border-gray-200">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-bold text-gray-900">TopJob</span>
            </Link>
          </div>
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {sidebarItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      item.active
                        ? 'bg-emerald-50 text-emerald-700 border-r-2 border-emerald-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-64">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Có lỗi xảy ra</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={fetchApplicationDetail}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Fixed width và full height */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col fixed h-full z-10">
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
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {sidebarItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    item.active
                      ? 'bg-emerald-50 text-emerald-700 border-r-2 border-emerald-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
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

      {/* Main Content - Với margin-left để tránh sidebar */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/employer/candidates')}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-2" />
                  Quay lại danh sách ứng viên
                </button>
              </div>
              {application && (
                <div className="text-right">
                  <p className="text-sm text-gray-500">Ứng tuyển ngày</p>
                  <p className="font-semibold text-gray-900">{formatDate(application.createdAt)}</p>
                </div>
              )}
            </div>
            <div className="mt-4">
              <h1 className="text-2xl font-bold text-gray-900">Hồ sơ ứng viên</h1>
              <p className="text-gray-600 mt-1">
                Chi tiết thông tin và CV của ứng viên
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cột trái: Thông tin ứng viên */}
            <div className="lg:col-span-2 space-y-6">
              {/* Thông tin cá nhân */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <UserIcon className="h-5 w-5 mr-2 text-blue-600" />
                  Thông tin cá nhân
                </h2>
                {candidate ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Họ và tên</label>
                        <p className="mt-1 text-lg font-semibold text-gray-900">{candidate.fullname}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <div className="mt-1 flex items-center">
                          <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <p className="text-gray-900">{candidate.email}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Số điện thoại</label>
                        <div className="mt-1 flex items-center">
                          <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <p className="text-gray-900">{candidate.phone || 'Chưa cập nhật'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Địa chỉ</label>
                        <div className="mt-1 flex items-center">
                          <MapPinIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <p className="text-gray-900">{candidate.address || 'Chưa cập nhật'}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Ngày sinh</label>
                        <div className="mt-1 flex items-center">
                          <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <p className="text-gray-900">{formatDate(candidate.dob)}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Ngày đăng ký</label>
                        <div className="mt-1 flex items-center">
                          <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <p className="text-gray-900">{formatDate(candidate.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Không thể tải thông tin ứng viên</p>
                )}
              </div>

              {/* CV Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <DocumentTextIcon className="h-5 w-5 mr-2 text-green-600" />
                  Hồ sơ CV
                </h2>
                {application?.resume ? (
                  <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <DocumentTextIcon className="h-8 w-8 text-red-600 mr-3" />
                        <div>
                          <h3 className="font-medium text-gray-900">{application.resume.originalFileName}</h3>
                          <p className="text-sm text-gray-500">
                            Tải lên: {formatDate(application.resume.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleViewCV}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <EyeIcon className="h-4 w-4 mr-2" />
                        Xem CV
                      </button>
                      <button
                        onClick={handleDownloadCV}
                        disabled={isDownloadingCV}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {isDownloadingCV ? (
                          <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                          <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                        )}
                        Tải xuống
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 border border-gray-200 rounded-lg bg-gray-50">
                    <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Không có CV được tải lên</p>
                  </div>
                )}
              </div>

              {/* AI Screening Results */}
              {application?.screeningResult && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <AcademicCapIcon className="h-5 w-5 mr-2 text-purple-600" />
                    Kết quả sàng lọc AI
                  </h2>
                  
                  {/* Kết quả tổng quan */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className={`border rounded-lg p-4 ${getDecisionColor(application.screeningResult.candidateDecision)}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Quyết định AI</p>
                          <p className="text-lg font-semibold">{getDecisionText(application.screeningResult.candidateDecision)}</p>
                        </div>
                        {getDecisionIcon(application.screeningResult.candidateDecision)}
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4 bg-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Điểm đánh giá</p>
                          <div className="flex items-center mt-1">
                            <div className="flex text-yellow-400 mr-2">
                              {[...Array(5)].map((_, i) => (
                                <StarIcon
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(application.screeningResult?.overallScore || 0)
                                      ? 'fill-current'
                                      : ''
                                  }`}
                                />
                              ))}
                            </div>
                            <span className={`font-semibold ${getScoreColor(application.screeningResult.overallScore)}`}>
                              {application.screeningResult.overallScore?.toFixed(1)}/5.0
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4 bg-white">
                      <p className="text-sm font-medium text-gray-600">Thời gian phân tích</p>
                      <p className="text-lg font-semibold text-gray-900">{formatDate(application.screeningResult.screenedAt)}</p>
                    </div>
                  </div>

                  {/* Nhận xét AI */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Nhận xét từ AI</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700">{application.screeningResult.recommendation}</p>
                    </div>
                  </div>

                  {/* Điểm mạnh và điểm yếu */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Điểm phù hợp */}
                    <div>
                      <h3 className="text-lg font-medium text-green-600 mb-3 flex items-center">
                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                        Điểm phù hợp
                      </h3>
                      <div className="space-y-2">
                        {application.screeningResult.matchingPoints?.map((point: string, index: number) => (
                          <div key={index} className="flex items-start bg-green-50 rounded-lg p-3">
                            <span className="text-green-500 mr-2 mt-0.5">•</span>
                            <span className="text-sm text-gray-700">{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Điểm cần cải thiện */}
                    <div>
                      <h3 className="text-lg font-medium text-red-600 mb-3 flex items-center">
                        <XCircleIcon className="h-5 w-5 mr-2" />
                        Điểm cần cải thiện
                      </h3>
                      <div className="space-y-2">
                        {application.screeningResult.notMatchingPoints?.map((point: string, index: number) => (
                          <div key={index} className="flex items-start bg-red-50 rounded-lg p-3">
                            <span className="text-red-500 mr-2 mt-0.5">•</span>
                            <span className="text-sm text-gray-700">{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cột phải: Thông tin ứng tuyển */}
            <div className="space-y-6">
              {/* Chi tiết ứng tuyển */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <BriefcaseIcon className="h-5 w-5 mr-2 text-blue-600" />
                  Chi tiết ứng tuyển
                </h2>
                {application && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Vị trí ứng tuyển</label>
                      <p className="mt-1 font-semibold text-gray-900">{application.jobPost?.title}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Công ty</label>
                      <div className="mt-1 flex items-center">
                        <BuildingOfficeIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <p className="text-gray-900">{application.jobPost?.companyName}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Địa điểm làm việc</label>
                      <div className="mt-1 flex items-center">
                        <MapPinIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <p className="text-gray-900">{application.jobPost?.location}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Mức lương</label>
                      <p className="mt-1 text-gray-900">{application.jobPost?.salary || 'Thỏa thuận'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Trạng thái</label>
                      <p className="mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {application.status}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Thư xin việc */}
              {application?.coverLetter && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Thư xin việc</h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {application.coverLetter}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetailPage; 
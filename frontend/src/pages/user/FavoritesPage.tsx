import React, { useState, useEffect } from 'react';
import { 
  HomeIcon,
  BriefcaseIcon,
  HeartIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  HeartIcon as HeartSolidIcon,
  MapPinIcon,
  ClockIcon,
  ChevronDownIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  userApi, 
  jobPostApi,
  applicationApi,
  type JobPostDashboardResponse,
  type UserResponse
} from '../../services/api';

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // API Data States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState<UserResponse | null>(null);
  const [favoriteJobs, setFavoriteJobs] = useState<JobPostDashboardResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [userApplications, setUserApplications] = useState<number[]>([]); // Store applied job IDs
  const [favoriteStates, setFavoriteStates] = useState<Record<number, boolean>>({}); // Track favorite states

  const pageSize = 8;

  useEffect(() => {
    if (!user || user.role !== 'USER') {
      navigate('/auth/login');
      return;
    }
    
    fetchPageData();
  }, [user, navigate, currentPage]);

  const fetchPageData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchUserInfo(),
        fetchFavoriteJobs(),
        fetchUserApplications()
      ]);
    } catch (error) {
      console.error('Error fetching page data:', error);
      setError('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await userApi.getMyInfo();
      if (response.code === 1000 && response.result) {
        setUserInfo(response.result);
      }
    } catch (err) {
      console.error('Error fetching user info:', err);
    }
  };

  const fetchFavoriteJobs = async () => {
    try {
      const response = await userApi.getFavoriteJobs(currentPage, pageSize);
      if (response.code === 1000 && response.result) {
        setFavoriteJobs(response.result.data || []);
        setTotalPages(response.result.totalPages || 1);
        setTotalElements(response.result.totalElements || 0);
        
        // Initialize favorite states (all true since these are favorite jobs)
        const favoriteStatesInit: Record<number, boolean> = {};
        response.result.data?.forEach(job => {
          favoriteStatesInit[job.id] = true;
        });
        setFavoriteStates(favoriteStatesInit);
      }
    } catch (error) {
      console.error('Error fetching favorite jobs:', error);
    }
  };

  const fetchUserApplications = async () => {
    try {
      // Get all user applications to check which jobs are already applied
      const response = await applicationApi.getMyApplications(1, 100);
      if (response.code === 1000 && response.result) {
        const appliedJobIds = response.result.data?.map(app => app.jobPost.id) || [];
        setUserApplications(appliedJobIds);
      }
    } catch (error) {
      console.error('Error fetching user applications:', error);
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

  const toggleFavorite = async (jobId: number) => {
    try {
      const isCurrentlyFavorite = favoriteStates[jobId];
      
      if (isCurrentlyFavorite) {
        // Remove from favorites
        await jobPostApi.unfavoriteJob(jobId);
        setFavoriteStates(prev => ({ ...prev, [jobId]: false }));
        // Remove from favoriteJobs list
        setFavoriteJobs(prev => prev.filter(job => job.id !== jobId));
        setTotalElements(prev => prev - 1);
      } else {
        // Add to favorites
        await jobPostApi.favoriteJob(jobId);
        setFavoriteStates(prev => ({ ...prev, [jobId]: true }));
        // Refresh the list
        fetchFavoriteJobs();
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setError('Không thể cập nhật yêu thích');
    }
  };

  const handleApply = (jobId: number) => {
    // Navigate to job detail page for application
    navigate(`/jobs/${jobId}`);
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  };

  // Helper function to get company logo
  const getCompanyLogo = (companyName: string, logo?: string | null) => {
    if (logo) {
      // If logo path exists, construct proper URL
      return `http://localhost:8080/TopCV/uploads/${logo}`;
    }
    // Fallback to placeholder
    return `https://via.placeholder.com/80x80?text=${companyName.charAt(0)}`;
  };

  // Check if job is already applied
  const isJobApplied = (jobId: number) => {
    return userApplications.includes(jobId);
  };

  const sidebarItems = [
    { icon: HomeIcon, label: 'Tổng quan', active: false, href: '/user/dashboard' },
    { icon: BriefcaseIcon, label: 'Công việc đã ứng tuyển', href: '/user/applications' },
    { icon: HeartIcon, label: 'Công việc yêu thích', active: true, href: '/user/favorites' },
    { icon: UserCircleIcon, label: 'Trang cá nhân', href: '/user/profile' },
    { icon: Cog6ToothIcon, label: 'Cài đặt', href: '/user/settings' },
    { icon: QuestionMarkCircleIcon, label: 'Trợ giúp', href: '/user/help' }
  ];

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
              src={userInfo?.avt || `https://via.placeholder.com/40x40?text=${userInfo?.fullname?.charAt(0) || 'U'}`}
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userInfo?.fullname || 'Người dùng'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {userInfo?.email || 'email@example.com'}
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
        {/* Loading State */}
        {loading && (
          <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-600 px-4 py-3 rounded-lg">
            Đang tải dữ liệu...
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Công việc yêu thích</h1>
            <p className="text-gray-600 mt-1">
              {totalElements > 0 ? `${totalElements} công việc yêu thích` : 'Chưa có công việc yêu thích nào'}
            </p>
          </div>
          <Link
            to="/"
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Quay lại trang chủ
          </Link>
        </div>

        {/* Job Grid */}
        {favoriteJobs.length > 0 ? (
        <div className="grid grid-cols-2 gap-6">
          {favoriteJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              {/* Job Type and Location Tags */}
              <div className="flex items-center space-x-2 mb-4">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                    {job.type.name}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                    {job.level.name}
                </span>
              </div>

              {/* Company Info */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <img
                      src={getCompanyLogo(job.companyName, job.logo)}
                      alt={job.companyName}
                    className="w-16 h-16 rounded-lg border border-gray-200"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{job.companyName}</p>
                      <p className="text-sm text-gray-500">{job.appliedCount} người đã ứng tuyển</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleFavorite(job.id)}
                  className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  <HeartSolidIcon className="h-6 w-6 fill-current" />
                </button>
              </div>

              {/* Job Details */}
              <div className="space-y-2 mb-6">
                  {job.salary && (
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <CurrencyDollarIcon className="h-4 w-4" />
                  <span className="font-medium">{job.salary}</span>
                </div>
                  )}
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <MapPinIcon className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                  {job.deadline && (
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <ClockIcon className="h-4 w-4" />
                      <span>Hạn: {formatDate(job.deadline)}</span>
                    </div>
                  )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                  {isJobApplied(job.id) ? (
                  <button
                    disabled
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed"
                  >
                    Đã ứng tuyển
                  </button>
                ) : (
                  <button
                    onClick={() => handleApply(job.id)}
                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                  >
                    Ứng tuyển
                  </button>
                )}
                  <button 
                    onClick={() => toggleFavorite(job.id)}
                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                  <HeartSolidIcon className="h-5 w-5 fill-current" />
                </button>
              </div>
            </div>
          ))}
        </div>
        ) : (
          <div className="text-center py-12">
            <HeartIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có công việc yêu thích</h3>
            <p className="text-gray-600 mb-6">Hãy khám phá các công việc thú vị và thêm vào danh sách yêu thích</p>
            <Link
              to="/jobs"
              className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
            >
              Khám phá công việc
            </Link>
          </div>
        )}

        {/* Load More Button */}
        {favoriteJobs.length > 0 && currentPage < totalPages && (
        <div className="flex justify-center mt-12">
            <button 
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="flex items-center space-x-2 px-6 py-3 bg-emerald-100 text-emerald-700 rounded-lg font-medium hover:bg-emerald-200 transition-colors"
              disabled={loading}
            >
              <span>{loading ? 'Đang tải...' : 'Xem thêm'}</span>
            <ChevronDownIcon className="h-4 w-4" />
          </button>
        </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
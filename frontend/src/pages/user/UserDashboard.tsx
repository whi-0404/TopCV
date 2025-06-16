import React, { useState } from 'react';
import { 
  HomeIcon,
  UserIcon,
  BriefcaseIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDateRange, setSelectedDateRange] = useState('19/5 - 25/5');

  const handleLogout = () => {
    // Xóa token/session từ localStorage hoặc sessionStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    sessionStorage.clear();
    
    // Chuyển hướng về trang chủ
    navigate('/');
  };

  // Mock data
  const stats = {
    totalApplications: 45,
    interviewsScheduled: 18,
    applicationStatusChart: {
      pending: 60,
      interviewed: 40
    }
  };

  const recentApplications = [
    {
      id: '1',
      position: 'Social Media Assistant',
      company: 'Nomad',
      location: 'Paris, Pháp',
      type: 'Full-Time',
      appliedDate: '24-06-2021',
      status: 'Đang xem xét',
      logo: 'https://via.placeholder.com/40x40?text=N',
      logoColor: 'bg-emerald-500'
    },
    {
      id: '2',
      position: 'Social Media Assistant',
      company: 'Udacity',
      location: 'New York, USA',
      type: 'Full-Time',
      appliedDate: '23-05-2021',
      status: 'Đã vào vòng trong',
      logo: 'https://via.placeholder.com/40x40?text=U',
      logoColor: 'bg-blue-500'
    },
    {
      id: '3',
      position: 'Social Media Assistant',
      company: 'Packer',
      location: 'Madrid, Tây Ban Nha',
      type: 'Full-Time',
      appliedDate: '22-05-2021',
      status: 'Đã bị từ chối',
      logo: 'https://via.placeholder.com/40x40?text=P',
      logoColor: 'bg-red-500'
    }
  ];

  const upcomingInterviews = [
    {
      id: '1',
      time: '10:00 AM',
      candidate: '',
      position: '',
      company: ''
    },
    {
      id: '2',
      time: '10:30 AM',
      candidate: 'Joe Bartmann',
      position: 'Quản lý nhân sự tại Divvy',
      company: 'Divvy',
      avatar: 'https://via.placeholder.com/40x40?text=JB'
    },
    {
      id: '3',
      time: '11:00 AM',
      candidate: '',
      position: '',
      company: ''
    }
  ];

  const sidebarItems = [
    { icon: HomeIcon, label: 'Tổng quan', active: true, href: '/user/dashboard' },
    { icon: UserIcon, label: 'Tin nhắn', badge: '1', active: false, href: '/user/messages' },
    { icon: BriefcaseIcon, label: 'Công việc đã ứng tuyển', href: '/user/applications' },
    { icon: HeartIcon, label: 'Công việc yêu thích', href: '/user/favorites' },
    { icon: UserCircleIcon, label: 'Trang cá nhân', href: '/user/profile' },
    { icon: Cog6ToothIcon, label: 'Cài đặt', href: '/user/settings' },
    { icon: QuestionMarkCircleIcon, label: 'Trợ giúp', href: '/user/help' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Đang xem xét':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Đã vào vòng trong':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Đã bị từ chối':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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
                  {item.badge && (
                    <span className="bg-emerald-600 text-white text-xs rounded-full px-2 py-0.5">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>



        {/* User Profile - Sticky at bottom */}
        <div className="sticky bottom-0 bg-white p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <img
              src="https://via.placeholder.com/40x40?text=NH"
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                Nguyễn Quang Huy
              </p>
              <p className="text-xs text-gray-500 truncate">
                qhi@email.com
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
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tổng quan</h1>
            </div>
            <Link
              to="/"
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Quay lại trang chủ
            </Link>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Welcome Message */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Huy ơi, chúc buổi sáng tràn đầy năng lượng nhé!
            </h2>
            <p className="text-gray-600">
              Đây là cập nhật về các đơn ứng tuyển việc làm của bạn từ 19/5/2025 đến 25/5/2025
            </p>
            <div className="mt-4 flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">{selectedDateRange}</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Stats */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats Cards */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Total Applications */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-600">Tổng ứng tuyển</h3>
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <BriefcaseIcon className="h-6 w-6 text-gray-400" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{stats.totalApplications}</div>
                </div>

                {/* Applications Status Chart */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-4">Trạng thái ứng tuyển</h3>
                  <div className="flex items-center space-x-4">
                    <div className="relative w-20 h-20">
                      <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="3"
                        />
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#0891b2"
                          strokeWidth="3"
                          strokeDasharray="60, 40"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-cyan-600 rounded-full"></div>
                        <span className="text-sm text-gray-600">60%</span>
                        <span className="text-xs text-gray-500">Không phù hợp</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                        <span className="text-sm text-gray-600">40%</span>
                        <span className="text-xs text-gray-500">Đã phỏng vấn</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interviews Scheduled */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-600">Đã phỏng vấn</h3>
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <UserIcon className="h-6 w-6 text-gray-400" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{stats.interviewsScheduled}</div>
                </div>
              </div>

              {/* Recent Applications */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Công việc đã ứng tuyển gần đây</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {recentApplications.map((application) => (
                    <div key={application.id} className="p-6 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 ${application.logoColor} rounded-lg flex items-center justify-center`}>
                          <span className="text-white font-semibold">
                            {application.company.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{application.position}</h4>
                          <p className="text-sm text-gray-600">
                            {application.company} • {application.location} • {application.type}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Ngày ứng tuyển</p>
                          <p className="text-sm font-medium text-gray-900">{application.appliedDate}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
                          {application.status}
                        </span>
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <EllipsisHorizontalIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-6 border-t border-gray-200 text-center">
                  <Link
                    to="/user/applications"
                    className="inline-flex items-center space-x-2 text-sm font-medium text-emerald-600 hover:text-emerald-700"
                  >
                    <span>Tất cả công việc đã ứng tuyển</span>
                    <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column - Calendar & Interviews */}
            <div className="space-y-6">
              {/* Interview Schedule */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Phỏng vấn sắp diễn ra</h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-900">Hôm nay, 26 tháng 6</span>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <ChevronLeftIcon className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <ChevronRightIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {upcomingInterviews.map((interview) => (
                      <div key={interview.id} className="flex items-center space-x-3">
                        <div className="w-16 text-sm text-gray-500">{interview.time}</div>
                        {interview.candidate ? (
                          <div className="flex items-center space-x-3 flex-1">
                            <img
                              src={interview.avatar}
                              alt={interview.candidate}
                              className="w-8 h-8 rounded-full"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{interview.candidate}</p>
                              <p className="text-xs text-gray-500">{interview.position}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1 h-8 bg-gray-50 rounded border-2 border-dashed border-gray-200"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard; 
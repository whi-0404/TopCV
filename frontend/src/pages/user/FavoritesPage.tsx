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
  HeartIcon as HeartSolidIcon,
  MapPinIcon,
  ClockIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xóa token/session từ localStorage hoặc sessionStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    sessionStorage.clear();
    
    // Chuyển hướng về trang chủ
    navigate('/');
  };
  // Mock data for favorite jobs
  const favoriteJobs = [
    {
      id: '1',
      title: 'Project Manager',
      company: 'Nomad',
      companyLogo: 'https://via.placeholder.com/80x80?text=N',
      location: 'Paris, Pháp',
      salary: '8 - 15 triệu / tháng',
      type: 'Full Time',
      city: 'TP.HCM',
      description: 'Nomad tạo ra doanh thu 728.000 USD (USD).',
      isFavorited: true,
      isApplied: false
    },
    {
      id: '2',
      title: 'Project Manager',
      company: 'Nomad',
      companyLogo: 'https://via.placeholder.com/80x80?text=N',
      location: 'Paris, Pháp',
      salary: '8 - 15 triệu / tháng',
      type: 'Full Time',
      city: 'TP.HCM',
      description: 'Nomad tạo ra doanh thu 728.000 USD (USD).',
      isFavorited: true,
      isApplied: true
    },
    {
      id: '3',
      title: 'Project Manager',
      company: 'Nomad',
      companyLogo: 'https://via.placeholder.com/80x80?text=N',
      location: 'Paris, Pháp',
      salary: '8 - 15 triệu / tháng',
      type: 'Full Time',
      city: 'TP.HCM',
      description: 'Nomad tạo ra doanh thu 728.000 USD (USD).',
      isFavorited: true,
      isApplied: false
    },
    {
      id: '4',
      title: 'Project Manager',
      company: 'Nomad',
      companyLogo: 'https://via.placeholder.com/80x80?text=N',
      location: 'Paris, Pháp',
      salary: '8 - 15 triệu / tháng',
      type: 'Full Time',
      city: 'TP.HCM',
      description: 'Nomad tạo ra doanh thu 728.000 USD (USD).',
      isFavorited: true,
      isApplied: false
    },
    {
      id: '5',
      title: 'Project Manager',
      company: 'Nomad',
      companyLogo: 'https://via.placeholder.com/80x80?text=N',
      location: 'Paris, Pháp',
      salary: '8 - 15 triệu / tháng',
      type: 'Full Time',
      city: 'TP.HCM',
      description: 'Nomad tạo ra doanh thu 728.000 USD (USD).',
      isFavorited: true,
      isApplied: false
    },
    {
      id: '6',
      title: 'Project Manager',
      company: 'Nomad',
      companyLogo: 'https://via.placeholder.com/80x80?text=N',
      location: 'Paris, Pháp',
      salary: '8 - 15 triệu / tháng',
      type: 'Full Time',
      city: 'TP.HCM',
      description: 'Nomad tạo ra doanh thu 728.000 USD (USD).',
      isFavorited: true,
      isApplied: false
    },
    {
      id: '7',
      title: 'Project Manager',
      company: 'Nomad',
      companyLogo: 'https://via.placeholder.com/80x80?text=N',
      location: 'Paris, Pháp',
      salary: '8 - 15 triệu / tháng',
      type: 'Full Time',
      city: 'TP.HCM',
      description: 'Nomad tạo ra doanh thu 728.000 USD (USD).',
      isFavorited: true,
      isApplied: false
    },
    {
      id: '8',
      title: 'Project Manager',
      company: 'Nomad',
      companyLogo: 'https://via.placeholder.com/80x80?text=N',
      location: 'Paris, Pháp',
      salary: '8 - 15 triệu / tháng',
      type: 'Full Time',
      city: 'TP.HCM',
      description: 'Nomad tạo ra doanh thu 728.000 USD (USD).',
      isFavorited: true,
      isApplied: false
    }
  ];

  const sidebarItems = [
    { icon: HomeIcon, label: 'Tổng quan', active: false, href: '/user/dashboard' },
    { icon: UserIcon, label: 'Tin nhắn', badge: '1', active: false, href: '/user/messages' },
    { icon: BriefcaseIcon, label: 'Công việc đã ứng tuyển', href: '/user/applications' },
    { icon: HeartIcon, label: 'Công việc yêu thích', active: true, href: '/user/favorites' },
    { icon: UserCircleIcon, label: 'Trang cá nhân', href: '/user/profile' },
    { icon: Cog6ToothIcon, label: 'Cài đặt', href: '/user/settings' },
    { icon: QuestionMarkCircleIcon, label: 'Trợ giúp', href: '/user/help' }
  ];

  const toggleFavorite = (jobId: string) => {
    // Handle toggle favorite
    console.log('Toggle favorite for job:', jobId);
  };

  const handleApply = (jobId: string) => {
    // Handle apply for job
    console.log('Apply for job:', jobId);
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

        {/* Settings Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
            CÀI ĐẶT
          </div>
          <ul className="space-y-2">
            <li>
              <Link
                to="/user/settings"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <Cog6ToothIcon className="h-5 w-5" />
                <span>Cài đặt</span>
              </Link>
            </li>
            <li>
              <Link
                to="/help"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <QuestionMarkCircleIcon className="h-5 w-5" />
                <span>Trợ giúp</span>
              </Link>
            </li>
          </ul>
        </div>

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
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Công việc yêu thích</h1>
          </div>
          <Link
            to="/"
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Quay lại trang chủ
          </Link>
        </div>

        {/* Job Grid */}
        <div className="grid grid-cols-2 gap-6">
          {favoriteJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              {/* Job Type and Location Tags */}
              <div className="flex items-center space-x-2 mb-4">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                  {job.type}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                  {job.city}
                </span>
              </div>

              {/* Company Info */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={job.companyLogo}
                    alt={job.company}
                    className="w-16 h-16 rounded-lg border border-gray-200"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{job.company}</p>
                    <p className="text-sm text-gray-500">{job.description}</p>
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
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">{job.salary}</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <MapPinIcon className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                {job.isApplied ? (
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
                <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                  <HeartSolidIcon className="h-5 w-5 fill-current" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="flex justify-center mt-12">
          <button className="flex items-center space-x-2 px-6 py-3 bg-emerald-100 text-emerald-700 rounded-lg font-medium hover:bg-emerald-200 transition-colors">
            <span>Xem tất cả</span>
            <ChevronDownIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;
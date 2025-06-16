import React, { useState } from 'react';
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
  CalendarIcon,
  ChevronDownIcon,
  EyeIcon,
  UserPlusIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const EmployerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDateRange, setSelectedDateRange] = useState('Jul 19 - Jul 25');
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    sessionStorage.clear();
    navigate('/');
  };

  const sidebarItems = [
    { icon: HomeIcon, label: 'Tổng quan', active: true, href: '/employer/dashboard' },
    { icon: BriefcaseIcon, label: 'Tin nhắn', href: '/employer/messages' },
    { icon: BuildingOfficeIcon, label: 'Hồ sơ công ty', href: '/employer/company' },
    { icon: UsersIcon, label: 'Tất cả ứng viên', href: '/employer/candidates' },
    { icon: DocumentTextIcon, label: 'Danh sách công việc', href: '/employer/jobs' },
    { icon: Cog6ToothIcon, label: 'Cài đặt', href: '/employer/settings' },
    { icon: QuestionMarkCircleIcon, label: 'Trợ giúp', href: '/employer/help' }
  ];

  // Mock data
  const stats = {
    totalJobs: 36,
    interviews: 1,
    messages: 24,
    applicants: 12,
    totalCandidates: 67,
    views: 2342,
    applications: 654
  };

  const recentJobs = [
    {
      id: 1,
      title: 'Social Media Assistant',
      company: 'Nomad',
      location: 'Paris, France',
      type: 'Full-Time',
      tags: ['Marketing', 'Design'],
      applied: 5,
      capacity: 10,
      logo: 'https://via.placeholder.com/40x40?text=N',
      logoColor: 'bg-emerald-500'
    },
    {
      id: 2,
      title: 'Brand Designer',
      company: 'Nomad',
      location: 'Paris, France',
      type: 'Full-Time',
      tags: ['Business', 'Design'],
      applied: 5,
      capacity: 10,
      logo: 'https://via.placeholder.com/40x40?text=D',
      logoColor: 'bg-blue-500'
    },
    {
      id: 3,
      title: 'Interactive Developer',
      company: 'Terraform',
      location: 'Berlin, Germany',
      type: 'Full-Time',
      tags: ['Marketing', 'Design'],
      applied: 5,
      capacity: 10,
      logo: 'https://via.placeholder.com/40x40?text=T',
      logoColor: 'bg-cyan-500'
    },
    {
      id: 4,
      title: 'Product Designer',
      company: 'ClassPass',
      location: 'Berlin, Germany',
      type: 'Full-Time',
      tags: ['Business', 'Design'],
      applied: 5,
      capacity: 10,
      logo: 'https://via.placeholder.com/40x40?text=C',
      logoColor: 'bg-purple-500'
    }
  ];

  const chartData = [
    { day: 'Mon', views: 150, applications: 80 },
    { day: 'Tue', views: 200, applications: 90 },
    { day: 'Wed', views: 180, applications: 120 },
    { day: 'Thu', views: 220, applications: 100 },
    { day: 'Fri', views: 160, applications: 70 },
    { day: 'Sat', views: 90, applications: 50 },
    { day: 'Sun', views: 110, applications: 60 }
  ];

  const jobStats = {
    fullTime: 45,
    partTime: 24,
    remote: 22,
    internship: 32,
    contract: 30
  };

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
        <div className="bg-white p-4 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4" />
            <span>Đăng xuất</span>
          </button>
          
          <div className="mt-3 flex items-center space-x-3">
            <img
              src="https://via.placeholder.com/40x40?text=NQ"
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
        </div>
      </div>

      {/* Main Content - Margin left để tránh sidebar */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header - 2 hàng như thiết kế */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          {/* Hàng 1: Company VNG + nút Đăng việc làm */}
          <div className="px-6 py-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              {/* Company Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm text-gray-600">Company</span>
                  <span className="text-orange-600 font-medium">VNG</span>
                  <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                </button>
                
                {/* Dropdown Menu */}
                {showCompanyDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                    <div className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold">V</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">VNG Corporation</h3>
                          <p className="text-sm text-gray-500">Công ty hiện tại</p>
                        </div>
                      </div>
                      <div className="border-t border-gray-200 pt-3">
                        <Link
                          to="/employer/company"
                          className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                          onClick={() => setShowCompanyDropdown(false)}
                        >
                          Xem hồ sơ công ty
                        </Link>
                        <Link
                          to="/employer/settings"
                          className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                          onClick={() => setShowCompanyDropdown(false)}
                        >
                          Cài đặt công ty
                        </Link>
                        <button 
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                          onClick={() => setShowCompanyDropdown(false)}
                        >
                          Chuyển đổi công ty
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Actions */}
              <div className="flex items-center space-x-3">
                <Link
                  to="/"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Về trang chủ
                </Link>
                <Link
                  to="/employer/jobs/create"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center space-x-2"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span>Đăng việc làm</span>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Hàng 2: Xin chào Maria + date picker */}
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Xin chào, Maria</h1>
                <p className="text-gray-600 mt-1">Chào mừng quay trở lại dashboard của bạn</p>
              </div>
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <select 
                  value={selectedDateRange}
                  onChange={(e) => setSelectedDateRange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                >
                  <option value="Jul 19 - Jul 25">Jul 19 - Jul 25</option>
                  <option value="Jul 26 - Aug 1">Jul 26 - Aug 1</option>
                  <option value="Aug 2 - Aug 8">Aug 2 - Aug 8</option>
                  <option value="Aug 9 - Aug 15">Aug 9 - Aug 15</option>
                </select>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Số ứng viên mới */}
              <div className="bg-emerald-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-3xl font-bold">{stats.totalJobs}</h3>
                    <p className="text-emerald-100 mt-1">Số ứng viên mới</p>
                  </div>
                  <UserPlusIcon className="h-8 w-8 text-emerald-200" />
                </div>
              </div>

              {/* Lịch phỏng vấn hôm nay */}
              <div className="bg-cyan-500 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-3xl font-bold">{stats.interviews}</h3>
                    <p className="text-cyan-100 mt-1">Lịch phỏng vấn hôm nay</p>
                  </div>
                  <CalendarIcon className="h-8 w-8 text-cyan-200" />
                </div>
              </div>

              {/* Tin nhắn đã nhận */}
              <div className="bg-blue-500 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-3xl font-bold">{stats.messages}</h3>
                    <p className="text-blue-100 mt-1">Tin nhắn đã nhận</p>
                  </div>
                  <BriefcaseIcon className="h-8 w-8 text-blue-200" />
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Chart Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Thống kê</h2>
                      <p className="text-sm text-gray-600">Thống kê từ 20/4 - 27/4</p>
                    </div>
                    <div className="flex space-x-4">
                      <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">Week</button>
                      <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">Month</button>
                      <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">Year</button>
                    </div>
                  </div>
                  
                  {/* Simple Chart */}
                  <div className="h-64 flex items-end justify-between space-x-2 mb-4">
                    {chartData.map((data, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center space-y-2">
                        <div className="flex flex-col items-center space-y-1">
                          <div 
                            className="w-full bg-yellow-400 rounded-t"
                            style={{ height: `${(data.views / 250) * 100}px` }}
                          ></div>
                          <div 
                            className="w-full bg-purple-500 rounded-b"
                            style={{ height: `${(data.applications / 250) * 120}px` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">{data.day}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                      <span className="text-gray-600">Số lượt xem</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-500 rounded"></div>
                      <span className="text-gray-600">Số lượt ứng tuyển</span>
                    </div>
                  </div>
                </div>

                {/* Recent Job Updates */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Cập nhật công việc</h2>
                    <Link 
                      to="/employer/jobs"
                      className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                    >
                      Xem tất cả →
                    </Link>
                  </div>
                  
                  <div className="space-y-4">
                    {recentJobs.map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 ${job.logoColor} rounded-lg flex items-center justify-center`}>
                            <span className="text-white font-bold">{job.title.charAt(0)}</span>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{job.title}</h3>
                            <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">
                                {job.type}
                              </span>
                              {job.tags.map((tag, index) => (
                                <span 
                                  key={index}
                                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {job.applied} applied of {job.capacity} capacity
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Job Stats */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Số công việc đang tuyển</h3>
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-gray-900">{stats.applicants}</div>
                    <div className="text-gray-600">Công việc</div>
                  </div>
                </div>

                {/* Candidate Stats */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tóm tắt ứng viên</h3>
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-gray-900">{stats.totalCandidates}</div>
                    <div className="text-gray-600">Ứng viên</div>
                  </div>
                  
                  {/* Progress bars */}
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-purple-500 rounded"></div>
                        <span>Full Time</span>
                      </span>
                      <span className="font-medium">{jobStats.fullTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-emerald-500 rounded"></div>
                        <span>Part-Time</span>
                      </span>
                      <span className="font-medium">{jobStats.partTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span>Remote</span>
                      </span>
                      <span className="font-medium">{jobStats.remote}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-orange-500 rounded"></div>
                        <span>Internship</span>
                      </span>
                      <span className="font-medium">{jobStats.internship}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded"></div>
                        <span>Contract</span>
                      </span>
                      <span className="font-medium">{jobStats.contract}</span>
                    </div>
                  </div>
                </div>

                {/* Views & Applications */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                          <EyeIcon className="h-4 w-4 text-orange-600" />
                        </div>
                        <span className="text-sm text-gray-600">Số lượt xem</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">{stats.views.toLocaleString()}</span>
                      <div className="flex items-center space-x-1 text-green-600">
                        <ArrowTrendingUpIcon className="h-4 w-4" />
                        <span className="text-sm">6.4%</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">Tuần này</p>
                  </div>
                  
                  <hr className="my-4" />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <DocumentTextIcon className="h-4 w-4 text-purple-600" />
                        </div>
                        <span className="text-sm text-gray-600">Số lượt ứng tuyển</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">{stats.applications}</span>
                      <div className="flex items-center space-x-1 text-red-600">
                        <ArrowTrendingDownIcon className="h-4 w-4" />
                        <span className="text-sm">0.5%</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">Tuần này</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Backdrop for dropdown */}
      {showCompanyDropdown && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setShowCompanyDropdown(false)}
        ></div>
      )}
    </div>
  );
};

export default EmployerDashboard; 
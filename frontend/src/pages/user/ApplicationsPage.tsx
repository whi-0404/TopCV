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
  FunnelIcon,
  MagnifyingGlassIcon as SearchIcon,
  EllipsisHorizontalIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';

const ApplicationsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xóa token/session từ localStorage hoặc sessionStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    sessionStorage.clear();
    
    // Chuyển hướng về trang chủ
    navigate('/');
  };
  const [activeTab, setActiveTab] = useState('all');
  const [dateRange, setDateRange] = useState('19/5 - 25/5');

  // Mock data
  const applications = [
    {
      id: '1',
      company: 'Nomad',
      companyLogo: 'https://via.placeholder.com/40x40?text=N',
      position: 'Social Media Assistant',
      location: 'Paris, France',
      appliedDate: '24/06/2021',
      status: 'reviewing',
      statusText: 'Đang xem xét',
      statusColor: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: '2',
      company: 'Udacity',
      companyLogo: 'https://via.placeholder.com/40x40?text=U',
      position: 'Social Media Assistant',
      location: 'New York, USA',
      appliedDate: '20/06/2021',
      status: 'shortlisted',
      statusText: 'Đã vào vòng trong',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      id: '3',
      company: 'Packer',
      companyLogo: 'https://via.placeholder.com/40x40?text=P',
      position: 'Social Media Assistant',
      location: 'Madrid, Spain',
      appliedDate: '18/06/2021',
      status: 'interview',
      statusText: 'Lời mời làm việc',
      statusColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: '4',
      company: 'Divvy',
      companyLogo: 'https://via.placeholder.com/40x40?text=D',
      position: 'Social Media Assistant',
      location: 'Berlin, Germany',
      appliedDate: '14/06/2021',
      status: 'interview',
      statusText: 'Đang phỏng vấn',
      statusColor: 'bg-orange-100 text-orange-800'
    },
    {
      id: '5',
      company: 'DigitalOcean',
      companyLogo: 'https://via.placeholder.com/40x40?text=DO',
      position: 'Social Media Assistant',
      location: 'London, UK',
      appliedDate: '10/06/2021',
      status: 'rejected',
      statusText: 'Không phù hợp',
      statusColor: 'bg-red-100 text-red-800'
    }
  ];

  const tabs = [
    { id: 'all', label: 'Tất cả', count: 45 },
    { id: 'reviewing', label: 'Đang xem xét', count: 34 },
    { id: 'interview', label: 'Đang phỏng vấn', count: 18 },
    { id: 'shortlisted', label: 'Đánh giá', count: 5 },
    { id: 'invite', label: 'Lời mời làm việc', count: 2 },
    { id: 'rejected', label: 'Đã tuyển', count: 1 }
  ];

  const sidebarItems = [
    { icon: HomeIcon, label: 'Tổng quan', active: false, href: '/user/dashboard' },
    { icon: UserIcon, label: 'Tin nhắn', badge: '1', active: false, href: '/user/messages' },
    { icon: BriefcaseIcon, label: 'Công việc đã ứng tuyển', active: true, href: '/user/applications' },
    { icon: HeartIcon, label: 'Công việc yêu thích', href: '/user/favorites' },
    { icon: UserCircleIcon, label: 'Trang cá nhân', href: '/user/profile' },
    { icon: Cog6ToothIcon, label: 'Cài đặt', href: '/user/settings' },
    { icon: QuestionMarkCircleIcon, label: 'Trợ giúp', href: '/user/help' }
  ];

  const filteredApplications = activeTab === 'all' 
    ? applications 
    : applications.filter(app => app.status === activeTab);

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
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Công việc đã ứng tuyển</h1>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-gray-600">Gửi vùng phòng độ nhé, Huy!</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Dưới đây là trang thái các đơn ứng tuyển từ 19 - 25/5/2025.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg">
                <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium">{dateRange}</span>
              </div>
                             <Link
                 to="/"
                 className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
               >
                 Quay lại trang chủ
               </Link>
            </div>
          </div>

          {/* Feature Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-blue-900 mb-1">Tính năng mới</h3>
              <p className="text-sm text-blue-700 mb-2">
                Bạn có thể gửi yêu cầu theo dõi sau 7 ngày kể từ khi nộp hồ sơ, nếu trạng thái hồ sơ đang được xem xét.
              </p>
              <p className="text-sm text-blue-700">
                Mỗi công việc chỉ được gửi 1 yêu cầu theo dõi.
              </p>
            </div>
            <button className="text-blue-400 hover:text-blue-600">
              <span className="sr-only">Đóng</span>
              ×
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900">Lịch sử ứng tuyển</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none w-64"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <FunnelIcon className="h-4 w-4" />
              <span>Lọc</span>
            </button>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên công ty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vị trí
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày ứng tuyển
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplications.map((application, index) => (
                <tr key={application.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-lg"
                          src={application.companyLogo}
                          alt={application.company}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {application.company}
                        </div>
                        <div className="text-sm text-gray-500">
                          {application.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {application.position}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {application.appliedDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${application.statusColor}`}>
                      {application.statusText}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-gray-600">
                      <EllipsisHorizontalIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Hiển thị</span>
            <select className="border border-gray-300 rounded px-2 py-1 text-sm">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            <span className="text-sm text-gray-700">kết quả</span>
          </div>
          <nav className="flex items-center space-x-2">
            <button className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
              ←
            </button>
            <button className="px-3 py-2 text-sm font-medium bg-emerald-600 text-white rounded">
              1
            </button>
            <button className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
              2
            </button>
            <button className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
              3
            </button>
            <button className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
              4
            </button>
            <button className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
              5
            </button>
            <span className="px-2 text-gray-500">...</span>
            <button className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
              33
            </button>
            <button className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
              →
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsPage;
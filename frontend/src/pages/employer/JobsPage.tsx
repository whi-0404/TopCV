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
  ChevronDownIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisHorizontalIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const JobsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    sessionStorage.clear();
    navigate('/');
  };

  const sidebarItems = [
    { icon: HomeIcon, label: 'Tổng quan', active: false, href: '/employer/dashboard' },
    { icon: BriefcaseIcon, label: 'Tin nhắn', href: '/employer/messages' },
    { icon: BuildingOfficeIcon, label: 'Hồ sơ công ty', href: '/employer/company' },
    { icon: UsersIcon, label: 'Tất cả ứng viên', href: '/employer/candidates' },
    { icon: DocumentTextIcon, label: 'Danh sách công việc', active: true, href: '/employer/jobs' },
    { icon: Cog6ToothIcon, label: 'Cài đặt', href: '/employer/settings' },
    { icon: QuestionMarkCircleIcon, label: 'Trợ giúp', href: '/employer/help' }
  ];

  // Mock data for jobs - giống hình ảnh
  const jobs = [
    {
      id: 1,
      title: 'Social Media Assistant',
      position: 'Social Media Assistant',
      status: 'Đã đăng',
      postedDate: '26/04/2025',
      deadline: '26/05/2025',
      type: 'Fulltime',
      salaryRange: '20',
      applicants: 4,
      totalSlots: 11,
      color: 'text-emerald-600'
    },
    {
      id: 2,
      title: 'Senior Designer',
      position: 'Senior Designer',
      status: 'Đã đăng',
      postedDate: '26/04/2025',
      deadline: '26/05/2025',
      type: 'Fulltime',
      salaryRange: '24',
      applicants: 0,
      totalSlots: 20,
      color: 'text-emerald-600'
    },
    {
      id: 3,
      title: 'Visual Designer',
      position: 'Visual Designer',
      status: 'Đã đăng',
      postedDate: '26/04/2025',
      deadline: '26/05/2025',
      type: 'Freelance',
      salaryRange: '20',
      applicants: 1,
      totalSlots: 5,
      color: 'text-orange-600'
    },
    {
      id: 4,
      title: 'Data Science',
      position: 'Data Science',
      status: 'Đã đóng',
      postedDate: '26/04/2025',
      deadline: '26/05/2025',
      type: 'Freelance',
      salaryRange: '26',
      applicants: 10,
      totalSlots: 10,
      color: 'text-orange-600'
    },
    {
      id: 5,
      title: 'Kotlin Developer',
      position: 'Kotlin Developer',
      status: 'Đã đóng',
      postedDate: '26/04/2025',
      deadline: '26/05/2025',
      type: 'Fulltime',
      salaryRange: '30',
      applicants: 20,
      totalSlots: 20,
      color: 'text-purple-600'
    },
    {
      id: 6,
      title: 'React Developer',
      position: 'React Developer',
      status: 'Đã đóng',
      postedDate: '26/04/2025',
      deadline: '26/05/2025',
      type: 'Fulltime',
      salaryRange: '14',
      applicants: 10,
      totalSlots: 10,
      color: 'text-purple-600'
    },
    {
      id: 7,
      title: 'C ++ Developer',
      position: 'C ++ Developer',
      status: 'Đã đóng',
      postedDate: '26/04/2025',
      deadline: '26/05/2025',
      type: 'Fulltime',
      salaryRange: '30',
      applicants: 20,
      totalSlots: 20,
      color: 'text-purple-600'
    },
    {
      id: 8,
      title: 'Python Developer',
      position: 'Python Developer',
      status: 'Đã đóng',
      postedDate: '26/04/2025',
      deadline: '26/05/2025',
      type: 'Fulltime',
      salaryRange: '30',
      applicants: 20,
      totalSlots: 20,
      color: 'text-purple-600'
    },
    {
      id: 9,
      title: 'Java Developer',
      position: 'Java Developer',
      status: 'Đã đóng',
      postedDate: '26/04/2025',
      deadline: '26/05/2025',
      type: 'Fulltime',
      salaryRange: '30',
      applicants: 20,
      totalSlots: 20,
      color: 'text-purple-600'
    },
    {
      id: 10,
      title: 'Rust Developer',
      position: 'Rust Developer',
      status: 'Đã đóng',
      postedDate: '26/04/2025',
      deadline: '26/05/2025',
      type: 'Fulltime',
      salaryRange: '30',
      applicants: 20,
      totalSlots: 20,
      color: 'text-purple-600'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Đã đăng':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Đã đóng':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Nháp':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Fulltime':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Freelance':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Part-time':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || job.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

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

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Company</span>
                <span className="text-orange-600 font-medium">VNG</span>
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
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2">
                <FunnelIcon className="h-4 w-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </header>

        {/* Jobs Content */}
        <main className="flex-1 overflow-y-auto p-6">
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
                <div>Số lượng</div>
                <div>Nhụ câu</div>
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
                    </div>

                    {/* Status */}
                    <div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </div>

                    {/* Posted Date */}
                    <div className="text-sm text-gray-600">
                      {job.postedDate}
                    </div>

                    {/* Deadline */}
                    <div className="text-sm text-gray-600">
                      {job.deadline}
                    </div>

                    {/* Job Type */}
                    <div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(job.type)}`}>
                        {job.type}
                      </span>
                    </div>

                    {/* Applicants */}
                    <div className="text-sm text-gray-600">
                      {job.salaryRange}
                    </div>

                    {/* Applications */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {job.applicants} / {job.totalSlots}
                      </span>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <EllipsisHorizontalIcon className="h-5 w-5" />
                      </button>
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
              <select className="border border-gray-300 rounded px-2 py-1 text-sm">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              <span className="text-sm text-gray-600">công việc / trang</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                &lt;
              </button>
              <button className="px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium">
                1
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                2
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                &gt;
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default JobsPage; 
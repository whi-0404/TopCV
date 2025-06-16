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
  EyeIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const CandidatesPage: React.FC = () => {
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
    { icon: UsersIcon, label: 'Tất cả ứng viên', active: true, href: '/employer/candidates' },
    { icon: DocumentTextIcon, label: 'Danh sách công việc', href: '/employer/jobs' },
    { icon: Cog6ToothIcon, label: 'Cài đặt', href: '/employer/settings' },
    { icon: QuestionMarkCircleIcon, label: 'Trợ giúp', href: '/employer/help' }
  ];

  // Mock data for candidates
  const candidates = [
    {
      id: 1,
      name: 'Nguyễn Văn An',
      position: 'Frontend Developer',
      avatar: 'https://via.placeholder.com/40x40?text=NA',
      email: 'an.nguyen@email.com',
      phone: '0901234567',
      experience: '3 năm',
      skills: ['React', 'TypeScript', 'Node.js'],
      appliedJob: 'Senior Frontend Developer',
      appliedDate: '2024-01-15',
      status: 'pending',
      rating: 4.5,
      cv: 'CV_NguyenVanAn.pdf'
    },
    {
      id: 2,
      name: 'Trần Thị Bình',
      position: 'UI/UX Designer',
      avatar: 'https://via.placeholder.com/40x40?text=TB',
      email: 'binh.tran@email.com',
      phone: '0901234568',
      experience: '2 năm',
      skills: ['Figma', 'Adobe XD', 'Sketch'],
      appliedJob: 'UI/UX Designer',
      appliedDate: '2024-01-14',
      status: 'interviewed',
      rating: 4.8,
      cv: 'CV_TranThiBinh.pdf'
    },
    {
      id: 3,
      name: 'Lê Hoàng Cường',
      position: 'Backend Developer',
      avatar: 'https://via.placeholder.com/40x40?text=LC',
      email: 'cuong.le@email.com',
      phone: '0901234569',
      experience: '5 năm',
      skills: ['Python', 'Django', 'PostgreSQL'],
      appliedJob: 'Backend Developer',
      appliedDate: '2024-01-13',
      status: 'hired',
      rating: 4.9,
      cv: 'CV_LeHoangCuong.pdf'
    },
    {
      id: 4,
      name: 'Phạm Thị Dung',
      position: 'Product Manager',
      avatar: 'https://via.placeholder.com/40x40?text=PD',
      email: 'dung.pham@email.com',
      phone: '0901234570',
      experience: '4 năm',
      skills: ['Product Strategy', 'Agile', 'Analytics'],
      appliedJob: 'Senior Product Manager',
      appliedDate: '2024-01-12',
      status: 'rejected',
      rating: 4.2,
      cv: 'CV_PhamThiDung.pdf'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'interviewed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'hired':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ xem xét';
      case 'interviewed':
        return 'Đã phỏng vấn';
      case 'hired':
        return 'Đã tuyển';
      case 'rejected':
        return 'Từ chối';
      default:
        return status;
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         candidate.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         candidate.appliedJob.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || candidate.status === filterStatus;
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
          {/* Filters and Search */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
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
                  <option value="pending">Chờ xem xét</option>
                  <option value="interviewed">Đã phỏng vấn</option>
                  <option value="hired">Đã tuyển</option>
                  <option value="rejected">Từ chối</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2">
                  <FunnelIcon className="h-4 w-4" />
                  <span>Bộ lọc</span>
                </button>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              Hiển thị {filteredCandidates.length} ứng viên
            </div>
          </div>

          {/* Candidates List */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {filteredCandidates.map((candidate) => (
                <div key={candidate.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-4">
                      <img
                        src={candidate.avatar}
                        alt={candidate.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-medium text-gray-900">{candidate.name}</h3>
                          <div className="flex items-center space-x-1">
                            <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">{candidate.rating}</span>
                          </div>
                        </div>
                        <p className="text-gray-600 mt-1">{candidate.position} • {candidate.experience} kinh nghiệm</p>
                        
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>{candidate.email}</span>
                          <span>{candidate.phone}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 mt-3">
                          {candidate.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center space-x-4 mt-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <BriefcaseIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">Ứng tuyển: {candidate.appliedJob}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CalendarIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{candidate.appliedDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(candidate.status)}`}>
                        {getStatusText(candidate.status)}
                      </span>
                      
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <ChatBubbleLeftRightIcon className="h-5 w-5" />
                        </button>
                        <button className="px-4 py-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors">
                          Xem CV
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Hiển thị 1-{filteredCandidates.length} trong tổng số {candidates.length} ứng viên
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Trước
              </button>
              <button className="px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium">
                1
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                2
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Sau
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CandidatesPage; 
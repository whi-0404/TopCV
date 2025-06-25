import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  UsersIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  BookOpenIcon,
  LifebuoyIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  PhoneIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  ChartBarIcon,
  UserGroupIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { 
  employerApi,
  type UserResponse,
  type CompanyResponse
} from '../../services/api';

const EmployerHelpPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // API Data States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState<UserResponse | null>(null);
  const [companyInfo, setCompanyInfo] = useState<CompanyResponse | null>(null);
  
  // Local States
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'EMPLOYER') {
      navigate('/auth/employer/login');
      return;
    }
    
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [userResponse, companyResponse] = await Promise.all([
        employerApi.getMyInfo(),
        employerApi.getMyCompany()
      ]);

      if (userResponse.code === 1000) {
        setUserInfo(userResponse.result);
      }
      
      if (companyResponse) {
        setCompanyInfo(companyResponse);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Không thể tải thông tin');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth/employer/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const sidebarItems = [
    { icon: HomeIcon, label: 'Tổng quan', href: '/employer/dashboard' },
    { icon: BriefcaseIcon, label: 'Danh sách công việc', href: '/employer/jobs' },
    { icon: UsersIcon, label: 'Tất cả ứng viên', href: '/employer/candidates' },
    { icon: BuildingOfficeIcon, label: 'Hồ sơ công ty', href: '/employer/company' },
    { icon: Cog6ToothIcon, label: 'Cài đặt', href: '/employer/settings' },
    { icon: QuestionMarkCircleIcon, label: 'Trợ giúp', active: true, href: '/employer/help' }
  ];

  const helpCategories = [
    {
      id: 'getting-started',
      title: 'Bắt đầu với TopJob',
      icon: BookOpenIcon,
      description: 'Hướng dẫn thiết lập tài khoản và công ty',
      articles: 8
    },
    {
      id: 'job-posting',
      title: 'Đăng tin tuyển dụng',
      icon: BriefcaseIcon,
      description: 'Cách tạo và quản lý tin tuyển dụng hiệu quả',
      articles: 12
    },
    {
      id: 'candidate-management',
      title: 'Quản lý ứng viên',
      icon: UserGroupIcon,
      description: 'Tìm kiếm, sàng lọc và tương tác với ứng viên',
      articles: 10
    },
    {
      id: 'company-profile',
      title: 'Hồ sơ công ty',
      icon: BuildingOfficeIcon,
      description: 'Tối ưu hóa trang công ty để thu hút nhân tài',
      articles: 6
    },
    {
      id: 'analytics',
      title: 'Báo cáo & Phân tích',
      icon: ChartBarIcon,
      description: 'Theo dõi hiệu quả tuyển dụng',
      articles: 5
    },
    {
      id: 'account-settings',
      title: 'Tài khoản & Cài đặt',
      icon: CogIcon,
      description: 'Quản lý tài khoản và cài đặt bảo mật',
      articles: 7
    }
  ];

  const faqs = [
    {
      id: '1',
      question: 'Làm thế nào để đăng tin tuyển dụng đầu tiên?',
      answer: 'Để đăng tin tuyển dụng: 1) Vào mục "Danh sách công việc", 2) Nhấp "Đăng tin mới", 3) Điền đầy đủ thông tin vị trí, yêu cầu, lương thưởng, 4) Thêm mô tả công việc chi tiết, 5) Đặt deadline và xuất bản tin.'
    },
    {
      id: '2',
      question: 'Làm sao để thu hút nhiều ứng viên chất lượng?',
      answer: 'Để thu hút ứng viên: 1) Viết tiêu đề hấp dẫn, cụ thể, 2) Mô tả rõ quyền lợi và cơ hội phát triển, 3) Đề cập mức lương cạnh tranh, 4) Hoàn thiện hồ sơ công ty, 5) Sử dụng từ khóa phù hợp trong ngành.'
    },
    {
      id: '3',
      question: 'Tôi có thể quản lý bao nhiêu tin tuyển dụng?',
      answer: 'Tùy thuộc vào gói dịch vụ: Gói cơ bản có thể đăng 5 tin/tháng, gói premium không giới hạn. Bạn có thể xem chi tiết các gói trong mục Cài đặt > Gói dịch vụ.'
    },
    {
      id: '4',
      question: 'Làm thế nào để sàng lọc ứng viên hiệu quả?',
      answer: 'Sử dụng các tính năng: 1) Bộ lọc theo kinh nghiệm, kỹ năng, 2) Đánh giá CV tự động bằng AI, 3) Đặt câu hỏi sàng lọc, 4) Sử dụng tags để phân loại ứng viên, 5) Tương tác trực tiếp qua tin nhắn.'
    },
    {
      id: '5',
      question: 'Tại sao tin tuyển dụng của tôi không hiển thị?',
      answer: 'Kiểm tra: 1) Tin đã được phê duyệt chưa (thường mất 2-4h), 2) Thông tin có đầy đủ và tuân thủ quy định không, 3) Deadline còn hiệu lực, 4) Trạng thái tin đang "Đang tuyển". Liên hệ hỗ trợ nếu vẫn gặp vấn đề.'
    },
    {
      id: '6',
      question: 'Làm sao để nâng cao thương hiệu công ty?',
      answer: 'Tối ưu hồ sơ công ty: 1) Cập nhật logo, ảnh bìa chất lượng cao, 2) Viết giới thiệu công ty hấp dẫn, 3) Thêm văn hóa công ty, 4) Chia sẻ tin tức, thành tựu, 5) Thu thập đánh giá từ nhân viên, 6) Tương tác với cộng đồng.'
    }
  ];

  const contactOptions = [
    {
      id: 'chat',
      title: 'Chat trực tuyến',
      description: 'Hỗ trợ tức thì cho nhà tuyển dụng',
      icon: ChatBubbleLeftRightIcon,
      available: 'Trực tuyến 24/7',
      action: 'Bắt đầu chat'
    },
    {
      id: 'email',
      title: 'Email hỗ trợ',
      description: 'employer-support@topjob.vn',
      icon: EnvelopeIcon,
      available: 'Phản hồi trong 4h',
      action: 'Gửi email'
    },
    {
      id: 'phone',
      title: 'Hotline doanh nghiệp',
      description: '1900 2468 (miễn phí)',
      icon: PhoneIcon,
      available: '8:00 - 22:00 hàng ngày',
      action: 'Gọi ngay'
    },
    {
      id: 'video',
      title: 'Tư vấn video',
      description: 'Hỗ trợ 1-1 với chuyên gia HR',
      icon: VideoCameraIcon,
      available: 'Đặt lịch hẹn',
      action: 'Đặt lịch'
    }
  ];

  const toggleFaq = (faqId: string) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              src={userInfo?.avt || `https://via.placeholder.com/40x40?text=${userInfo?.fullname?.charAt(0) || 'E'}`}
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userInfo?.fullname || 'Nhà tuyển dụng'}
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
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Company</span>
                <span className="text-orange-600 font-medium">
                  {companyInfo?.name || 'Chưa cập nhật'}
                </span>
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
              <h1 className="text-2xl font-bold text-gray-900">Trung tâm trợ giúp</h1>
              <p className="text-gray-600">Tìm câu trả lời và hướng dẫn cho nhà tuyển dụng</p>
            </div>
          </div>
        </header>

        {/* Help Content */}
        <main className="flex-1 overflow-y-auto p-6">
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

          <div className="max-w-6xl mx-auto space-y-8">
            {/* Search */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center mb-6">
                <LifebuoyIcon className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Chúng tôi có thể hỗ trợ gì cho bạn?</h2>
                <p className="text-gray-600">Tìm kiếm hướng dẫn và giải pháp cho các thắc mắc tuyển dụng</p>
              </div>
              <div className="relative max-w-xl mx-auto">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm hướng dẫn, câu hỏi..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* Help Categories */}
            <div className="grid grid-cols-3 gap-6">
              {helpCategories.map((category) => (
                <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <category.icon className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{category.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                      <span className="text-xs text-emerald-600 font-medium">{category.articles} bài viết</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Câu hỏi thường gặp</h2>
              <div className="space-y-4">
                {filteredFaqs.map((faq) => (
                  <div key={faq.id} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      <ChevronDownIcon
                        className={`h-5 w-5 text-gray-500 transition-transform ${
                          expandedFaq === faq.id ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {expandedFaq === faq.id && (
                      <div className="px-6 pb-4 border-t border-gray-100">
                        <p className="text-gray-700 pt-4 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {filteredFaqs.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Không tìm thấy câu hỏi phù hợp. Hãy thử từ khóa khác hoặc liên hệ hỗ trợ.</p>
                </div>
              )}
            </div>

            {/* Contact Support */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Liên hệ hỗ trợ doanh nghiệp</h2>
              <p className="text-gray-600 mb-6">Đội ngũ chuyên gia TopJob luôn sẵn sàng hỗ trợ bạn tối ưu hóa quá trình tuyển dụng.</p>
              <div className="grid grid-cols-2 gap-4">
                {contactOptions.map((option) => (
                  <div key={option.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <option.icon className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{option.title}</h3>
                        <p className="text-sm text-gray-600 mb-1">{option.description}</p>
                        <p className="text-xs text-gray-500 mb-3">{option.available}</p>
                        <button className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded text-sm font-medium hover:bg-emerald-100 transition-colors">
                          {option.action}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                  </div>
                </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Tài nguyên hữu ích</h2>
              <div className="grid grid-cols-4 gap-4">
                <Link to="/employer/jobs/create" className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <BriefcaseIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">Đăng tin tuyển dụng</span>
                </Link>
                <Link to="/employer/company" className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">Cập nhật công ty</span>
                </Link>
                <Link to="/employer/candidates" className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <UsersIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">Tìm ứng viên</span>
                </Link>
                <Link to="/employer/settings" className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Cog6ToothIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">Cài đặt tài khoản</span>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployerHelpPage; 
import React, { useState } from 'react';
import { 
  HomeIcon,
  UserIcon,
  BriefcaseIcon,
  HeartIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  PhoneIcon,
  DocumentTextIcon,
  BookOpenIcon,
  LifebuoyIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';

const HelpPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xóa token/session từ localStorage hoặc sessionStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    sessionStorage.clear();
    
    // Chuyển hướng về trang chủ
    navigate('/');
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const sidebarItems = [
    { icon: HomeIcon, label: 'Tổng quan', active: false, href: '/user/dashboard' },
    { icon: UserIcon, label: 'Tin nhắn', badge: '1', active: false, href: '/user/messages' },
    { icon: BriefcaseIcon, label: 'Công việc đã ứng tuyển', href: '/user/applications' },
    { icon: HeartIcon, label: 'Công việc yêu thích', href: '/user/favorites' },
    { icon: UserCircleIcon, label: 'Trang cá nhân', href: '/user/profile' },
    { icon: Cog6ToothIcon, label: 'Cài đặt', href: '/user/settings' },
    { icon: QuestionMarkCircleIcon, label: 'Trợ giúp', active: true, href: '/user/help' }
  ];

  const helpCategories = [
    {
      id: 'getting-started',
      title: 'Bắt đầu sử dụng',
      icon: BookOpenIcon,
      description: 'Hướng dẫn cơ bản cho người dùng mới',
      articles: 12
    },
    {
      id: 'job-search',
      title: 'Tìm kiếm việc làm',
      icon: MagnifyingGlassIcon,
      description: 'Cách tìm và ứng tuyển việc làm hiệu quả',
      articles: 8
    },
    {
      id: 'profile',
      title: 'Hồ sơ cá nhân',
      icon: UserIcon,
      description: 'Tạo và tối ưu hóa hồ sơ của bạn',
      articles: 6
    },
    {
      id: 'account',
      title: 'Tài khoản & Bảo mật',
      icon: Cog6ToothIcon,
      description: 'Quản lý tài khoản và cài đặt bảo mật',
      articles: 5
    }
  ];

  const faqs = [
    {
      id: '1',
      question: 'Làm thế nào để tạo một hồ sơ ấn tượng?',
      answer: 'Để tạo một hồ sơ ấn tượng, bạn nên: 1) Sử dụng ảnh đại diện chuyên nghiệp, 2) Viết mô tả bản thân ngắn gọn và thu hút, 3) Liệt kê đầy đủ kinh nghiệm và kỹ năng, 4) Thêm các dự án và thành tựu nổi bật, 5) Cập nhật thông tin thường xuyên.'
    },
    {
      id: '2',
      question: 'Tôi có thể ứng tuyển bao nhiêu công việc mỗi ngày?',
      answer: 'Không có giới hạn số lượng công việc bạn có thể ứng tuyển mỗi ngày. Tuy nhiên, chúng tôi khuyến nghị bạn nên tập trung vào chất lượng hơn số lượng - chọn những công việc phù hợp và tùy chỉnh đơn ứng tuyển cho từng vị trí.'
    },
    {
      id: '3',
      question: 'Làm sao để nhà tuyển dụng dễ tìm thấy tôi?',
      answer: 'Để tăng khả năng được nhà tuyển dụng tìm thấy: 1) Hoàn thiện 100% hồ sơ, 2) Sử dụng từ khóa liên quan đến ngành nghề, 3) Cập nhật trạng thái "Đang tìm việc", 4) Tham gia các nhóm và sự kiện ngành, 5) Thường xuyên đăng nhập và hoạt động trên nền tảng.'
    },
    {
      id: '4',
      question: 'Tôi quên mật khẩu, làm sao để lấy lại?',
      answer: 'Để lấy lại mật khẩu: 1) Truy cập trang đăng nhập, 2) Nhấp vào "Quên mật khẩu", 3) Nhập địa chỉ email đã đăng ký, 4) Kiểm tra email và làm theo hướng dẫn, 5) Tạo mật khẩu mới và đăng nhập.'
    },
    {
      id: '5',
      question: 'Làm thế nào để thay đổi thông tin cá nhân?',
      answer: 'Để thay đổi thông tin cá nhân: 1) Đăng nhập vào tài khoản, 2) Vào mục "Trang cá nhân", 3) Nhấp vào biểu tượng chỉnh sửa, 4) Cập nhật thông tin cần thiết, 5) Nhấp "Lưu thay đổi".'
    },
    {
      id: '6',
      question: 'Tại sao tôi không nhận được thông báo việc làm?',
      answer: 'Kiểm tra các nguyên nhân: 1) Cài đặt thông báo đã được bật chưa, 2) Email có bị vào thư mục spam không, 3) Tiêu chí tìm kiếm có quá hẹp không, 4) Hồ sơ đã hoàn thiện chưa. Nếu vẫn không nhận được, hãy liên hệ bộ phận hỗ trợ.'
    }
  ];

  const contactOptions = [
    {
      id: 'chat',
      title: 'Chat trực tuyến',
      description: 'Trò chuyện với đội ngũ hỗ trợ',
      icon: ChatBubbleLeftRightIcon,
      available: 'Trực tuyến',
      action: 'Bắt đầu chat'
    },
    {
      id: 'email',
      title: 'Gửi email',
      description: 'support@topjob.com',
      icon: EnvelopeIcon,
      available: 'Phản hồi trong 24h',
      action: 'Gửi email'
    },
    {
      id: 'phone',
      title: 'Hotline',
      description: '1900 xxxx (miễn phí)',
      icon: PhoneIcon,
      available: '8:00 - 22:00 hàng ngày',
      action: 'Gọi ngay'
    },
    {
      id: 'video',
      title: 'Video call',
      description: 'Hỗ trợ qua video call',
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
                to="/user/help"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium bg-emerald-50 text-emerald-700 border-r-2 border-emerald-600 transition-colors"
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
            <h1 className="text-2xl font-bold text-gray-900">Trợ giúp & Hỗ trợ</h1>
            <p className="text-gray-600 mt-1">Tìm câu trả lời cho các câu hỏi thường gặp</p>
          </div>
          <Link
            to="/"
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Quay lại trang chủ
          </Link>
        </div>

        <div className="max-w-4xl space-y-8">
          {/* Search */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center mb-6">
              <LifebuoyIcon className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Chúng tôi có thể giúp gì cho bạn?</h2>
              <p className="text-gray-600">Tìm kiếm câu trả lời nhanh chóng trong kho tri thức của chúng tôi</p>
            </div>
            <div className="relative max-w-xl mx-auto">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm câu hỏi, từ khóa..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Help Categories */}
          <div className="grid grid-cols-2 gap-6">
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
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Liên hệ hỗ trợ</h2>
            <p className="text-gray-600 mb-6">Không tìm thấy câu trả lời? Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn.</p>
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
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Liên kết hữu ích</h2>
            <div className="grid grid-cols-3 gap-4">
              <Link to="/terms" className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">Điều khoản sử dụng</span>
              </Link>
              <Link to="/privacy" className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">Chính sách bảo mật</span>
              </Link>
              <Link to="/community" className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">Cộng đồng</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
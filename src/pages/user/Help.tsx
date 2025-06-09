import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Help: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');

  const helpCategories = [
    { id: 'general', name: 'Câu hỏi chung', icon: '❓' },
    { id: 'account', name: 'Tài khoản', icon: '👤' },
    { id: 'applications', name: 'Ứng tuyển', icon: '📝' },
    { id: 'profile', name: 'Hồ sơ', icon: '📋' },
    { id: 'notifications', name: 'Thông báo', icon: '🔔' },
    { id: 'technical', name: 'Kỹ thuật', icon: '⚙️' }
  ];

  const faqData = {
    general: [
      {
        question: 'TopCV là gì?',
        answer: 'TopCV là nền tảng tuyển dụng hàng đầu Việt Nam, kết nối ứng viên với các nhà tuyển dụng uy tín.'
      },
      {
        question: 'Sử dụng TopCV có mất phí không?',
        answer: 'Việc tạo tài khoản và ứng tuyển công việc trên TopCV hoàn toàn miễn phí cho ứng viên.'
      },
      {
        question: 'Làm sao để tăng cơ hội được tuyển dụng?',
        answer: 'Hãy hoàn thiện hồ sơ, cập nhật CV định kỳ, ứng tuyển những vị trí phù hợp với kỹ năng và kinh nghiệm của bạn.'
      }
    ],
    account: [
      {
        question: 'Làm sao để đổi mật khẩu?',
        answer: 'Vào Cài đặt > Bảo mật > Đổi mật khẩu. Nhập mật khẩu hiện tại và mật khẩu mới.'
      },
      {
        question: 'Tôi quên mật khẩu, phải làm sao?',
        answer: 'Tại trang đăng nhập, nhấp "Quên mật khẩu", nhập email và làm theo hướng dẫn để đặt lại mật khẩu.'
      },
      {
        question: 'Làm sao để xóa tài khoản?',
        answer: 'Liên hệ với bộ phận hỗ trợ qua email support@topcv.vn để được hỗ trợ xóa tài khoản.'
      }
    ],
    applications: [
      {
        question: 'Làm sao để ứng tuyển việc làm?',
        answer: 'Tìm công việc phù hợp, nhấp "Ứng tuyển ngay", chọn CV và viết thư xin việc nếu cần.'
      },
      {
        question: 'Tôi có thể ứng tuyển bao nhiều công việc?',
        answer: 'Không có giới hạn số lượng công việc bạn có thể ứng tuyển. Hãy ứng tuyển những vị trí phù hợp nhất.'
      },
      {
        question: 'Làm sao để xem trạng thái đơn ứng tuyển?',
        answer: 'Vào mục "Công việc đã ứng tuyển" trong dashboard để xem tất cả đơn ứng tuyển và trạng thái của chúng.'
      }
    ],
    profile: [
      {
        question: 'Làm sao để cập nhật thông tin cá nhân?',
        answer: 'Vào trang Hồ sơ, nhấp "Chỉnh sửa" và cập nhật thông tin cần thiết.'
      },
      {
        question: 'Tôi có thể upload nhiều CV không?',
        answer: 'Có, bạn có thể tạo và lưu nhiều phiên bản CV khác nhau cho các vị trí khác nhau.'
      },
      {
        question: 'Thông tin cá nhân có được bảo mật không?',
        answer: 'TopCV cam kết bảo mật thông tin cá nhân của bạn theo chính sách bảo mật nghiêm ngặt.'
      }
    ],
    notifications: [
      {
        question: 'Làm sao để tắt thông báo email?',
        answer: 'Vào Cài đặt > Thông báo để tùy chỉnh các loại thông báo bạn muốn nhận.'
      },
      {
        question: 'Tôi không nhận được thông báo việc làm phù hợp?',
        answer: 'Kiểm tra cài đặt thông báo và đảm bảo bạn đã cập nhật đầy đủ kỹ năng, kinh nghiệm trong hồ sơ.'
      }
    ],
    technical: [
      {
        question: 'Website load chậm, tôi phải làm sao?',
        answer: 'Thử làm mới trang, xóa cache trình duyệt hoặc thử trình duyệt khác. Nếu vẫn chậm, liên hệ hỗ trợ.'
      },
      {
        question: 'Tôi không upload được CV?',
        answer: 'Đảm bảo file CV có định dạng PDF, DOC hoặc DOCX và không quá 5MB. Thử trình duyệt khác nếu cần.'
      }
    ]
  };

  const filteredFAQs = faqData[activeCategory as keyof typeof faqData].filter(
    faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Trung tâm trợ giúp</h1>
        <p className="text-gray-600">Tìm câu trả lời cho các câu hỏi thường gặp</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm câu hỏi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <svg 
            className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Category Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-medium text-gray-900 mb-4">Danh mục</h3>
            <div className="space-y-2">
              {helpCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    activeCategory === category.id
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm">
            {filteredFAQs.length === 0 ? (
              <div className="p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy kết quả</h3>
                <p className="mt-1 text-sm text-gray-500">Thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredFAQs.map((faq, index) => (
                  <details key={index} className="group">
                    <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50">
                      <h3 className="text-lg font-medium text-gray-900 group-open:text-blue-600">
                        {faq.question}
                      </h3>
                      <svg 
                        className="w-5 h-5 text-gray-500 transform transition-transform group-open:rotate-180" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div className="px-6 pb-6">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy câu trả lời?</h3>
            <p className="text-gray-600 mb-4">
              Nếu bạn không tìm thấy câu trả lời cho vấn đề của mình, hãy liên hệ với chúng tôi.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="mailto:support@topcv.vn"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Gửi email hỗ trợ
              </a>
              <a
                href="tel:1900123456"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Gọi hotline
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/user/profile"
          className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Cập nhật hồ sơ</h4>
            <p className="text-sm text-gray-500">Hoàn thiện thông tin cá nhân</p>
          </div>
        </Link>

        <Link
          to="/user/settings"
          className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Cài đặt tài khoản</h4>
            <p className="text-sm text-gray-500">Quản lý thông tin tài khoản</p>
          </div>
        </Link>

        <Link
          to="/jobs"
          className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Tìm việc làm</h4>
            <p className="text-sm text-gray-500">Khám phá cơ hội nghề nghiệp</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Help; 
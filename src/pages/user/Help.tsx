import React, { useState } from 'react';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const Help: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'general', name: 'Tổng quan', icon: '🏠' },
    { id: 'account', name: 'Tài khoản', icon: '👤' },
    { id: 'jobs', name: 'Việc làm', icon: '💼' },
    { id: 'profile', name: 'Hồ sơ', icon: '📝' },
    { id: 'payment', name: 'Thanh toán', icon: '💳' },
  ];

  const faqs: FAQ[] = [
    {
      id: 1,
      question: 'Làm thế nào để tạo tài khoản?',
      answer: 'Bạn có thể tạo tài khoản bằng cách nhấp vào nút "Đăng ký" ở góc trên bên phải của trang web. Điền thông tin cần thiết và xác nhận email để hoàn tất đăng ký.',
      category: 'account'
    },
    {
      id: 2,
      question: 'Tôi quên mật khẩu, làm sao để khôi phục?',
      answer: 'Nhấp vào "Quên mật khẩu" ở trang đăng nhập. Nhập email của bạn, chúng tôi sẽ gửi liên kết đặt lại mật khẩu đến email của bạn.',
      category: 'account'
    },
    {
      id: 3,
      question: 'Làm thế nào để tìm kiếm việc làm phù hợp?',
      answer: 'Sử dụng thanh tìm kiếm trên trang chủ. Bạn có thể tìm theo từ khóa, địa điểm, lương hoặc sử dụng bộ lọc nâng cao để tìm việc làm phù hợp nhất.',
      category: 'jobs'
    },
    {
      id: 4,
      question: 'Cách ứng tuyển vào một công việc?',
      answer: 'Nhấp vào công việc bạn quan tâm, đọc chi tiết và nhấp "Ứng tuyển ngay". Bạn có thể gửi CV có sẵn hoặc tải lên CV mới.',
      category: 'jobs'
    },
    {
      id: 5,
      question: 'Làm thế nào để cập nhật hồ sơ?',
      answer: 'Đăng nhập vào tài khoản, vào phần "Hồ sơ" trong dashboard. Bạn có thể chỉnh sửa thông tin cá nhân, kinh nghiệm làm việc, học vấn và kỹ năng.',
      category: 'profile'
    },
    {
      id: 6,
      question: 'TopCV có miễn phí không?',
      answer: 'TopCV cung cấp nhiều tính năng miễn phí cho người tìm việc. Một số tính năng nâng cao có thể yêu cầu gói premium.',
      category: 'general'
    },
    {
      id: 7,
      question: 'Làm thế nào để liên hệ hỗ trợ?',
      answer: 'Bạn có thể liên hệ qua email support@topcv.vn, hotline 1900-xxxx hoặc sử dụng chat trực tuyến trên website.',
      category: 'general'
    },
    {
      id: 8,
      question: 'Cách thanh toán cho gói premium?',
      answer: 'Chúng tôi hỗ trợ thanh toán qua thẻ tín dụng, chuyển khoản ngân hàng, ví điện tử và cổng thanh toán online.',
      category: 'payment'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'general' || faq.category === activeCategory;
    const matchesSearch = searchTerm === '' || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Trung tâm trợ giúp</h1>
        <p className="text-gray-600">Tìm câu trả lời cho các câu hỏi thường gặp</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Tìm kiếm câu hỏi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="text-3xl mb-3">📞</div>
          <h3 className="font-semibold text-gray-900 mb-2">Hotline</h3>
          <p className="text-gray-600 text-sm mb-3">Hỗ trợ 24/7</p>
          <p className="text-blue-600 font-medium">1900-xxxx</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="text-3xl mb-3">✉️</div>
          <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
          <p className="text-gray-600 text-sm mb-3">Phản hồi trong 24h</p>
          <p className="text-blue-600 font-medium">support@topcv.vn</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="text-3xl mb-3">💬</div>
          <h3 className="font-semibold text-gray-900 mb-2">Chat trực tuyến</h3>
          <p className="text-gray-600 text-sm mb-3">Hỗ trợ tức thì</p>
          <button className="text-blue-600 font-medium hover:text-blue-700">
            Bắt đầu chat
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Categories */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Danh mục</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeCategory === category.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">{category.icon}</span>
                  <span className="text-sm font-medium">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Câu hỏi thường gặp
                {activeCategory !== 'general' && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    - {categories.find(c => c.id === activeCategory)?.name}
                  </span>
                )}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {filteredFaqs.length} câu hỏi được tìm thấy
              </p>
            </div>

            <div className="divide-y divide-gray-200">
              {filteredFaqs.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="text-4xl mb-3">🔍</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy câu hỏi</h3>
                  <p className="text-gray-600">Thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác</p>
                </div>
              ) : (
                filteredFaqs.map((faq) => (
                  <div key={faq.id} className="p-6">
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full flex items-center justify-between text-left"
                    >
                      <h3 className="text-md font-medium text-gray-900 pr-4">
                        {faq.question}
                      </h3>
                      <svg
                        className={`w-5 h-5 text-gray-500 transition-transform ${
                          expandedFaq === faq.id ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {expandedFaq === faq.id && (
                      <div className="mt-4 text-sm text-gray-600 leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-sm mt-6 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Không tìm thấy câu trả lời?
            </h3>
            <p className="text-gray-600 mb-4">
              Gửi câu hỏi cho chúng tôi và nhận phản hồi trong vòng 24 giờ.
            </p>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chủ đề
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nội dung câu hỏi
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Gửi câu hỏi
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help; 
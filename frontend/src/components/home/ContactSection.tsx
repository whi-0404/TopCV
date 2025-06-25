import React, { useState } from 'react';
import { 
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement contact form submission
    console.log('Contact form submitted:', formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const contactInfo = [
    {
      icon: PhoneIcon,
      title: 'Điện thoại',
      content: '+84 (028) 1234 5678',
      action: 'tel:+842812345678'
    },
    {
      icon: EnvelopeIcon,
      title: 'Email',
      content: 'contact@topjob.vn',
      action: 'mailto:contact@topjob.vn'
    },
    {
      icon: MapPinIcon,
      title: 'Địa chỉ',
      content: '123 Đường ABC, Quận 1, TP. Hồ Chí Minh',
      action: null
    }
  ];

  const subjects = [
    'Hỗ trợ tài khoản',
    'Đăng tin tuyển dụng',
    'Báo cáo lỗi',
    'Đề xuất tính năng',
    'Hợp tác kinh doanh',
    'Khác'
  ];

  return (
    <section className="py-16 bg-white" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Liên hệ
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Có câu hỏi hoặc cần hỗ trợ? Hãy liên hệ với chúng tôi, team TopJob sẽ phản hồi sớm nhất có thể
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Thông tin liên hệ
              </h3>
              <div className="space-y-6">
                {contactInfo.map((info) => (
                  <div key={info.title} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <info.icon className="h-6 w-6 text-emerald-600" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-1">
                        {info.title}
                      </h4>
                      {info.action ? (
                        <a
                          href={info.action}
                          className="text-gray-600 hover:text-emerald-600 transition-colors"
                        >
                          {info.content}
                        </a>
                      ) : (
                        <p className="text-gray-600">{info.content}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Office Hours */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Giờ làm việc
              </h3>
              <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Thứ 2 - Thứ 6:</span>
                  <span className="font-medium text-gray-900">8:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thứ 7:</span>
                  <span className="font-medium text-gray-900">8:00 - 12:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Chủ nhật:</span>
                  <span className="font-medium text-gray-900">Nghỉ</span>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Theo dõi chúng tôi
              </h3>
              <div className="flex space-x-4">
                {['Facebook', 'LinkedIn', 'Twitter', 'YouTube'].map((platform) => (
                  <a
                    key={platform}
                    href={`#${platform.toLowerCase()}`}
                    className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center hover:bg-emerald-200 transition-colors"
                    aria-label={platform}
                  >
                    <span className="text-emerald-600 font-semibold text-sm">
                      {platform.charAt(0)}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Gửi tin nhắn
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Chủ đề *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  >
                    <option value="">Chọn chủ đề</option>
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Tin nhắn *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
                    placeholder="Nhập nội dung tin nhắn..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Gửi tin nhắn</span>
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection; 
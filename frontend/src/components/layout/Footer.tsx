import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Về TopJob', href: '/about' },
    { name: 'Tra cứu', href: '/search' },
    { name: 'Ứng dụng trên mobile', href: '/mobile-app' }
  ];

  const supportLinks = [
    { name: 'Hỗ trợ NTD', href: '/employer-support' },
    { name: 'Hỗ trợ NTV', href: '/candidate-support' },
    { name: 'Thỏa thuận sử dụng', href: '/terms' },
    { name: 'Chính sách Bảo mật', href: '/privacy' },
    { name: 'Liên hệ', href: '/contact' }
  ];

  const categories = [
    { name: 'Việc làm Hà Nội', href: '/jobs?location=hanoi' },
    { name: 'Việc làm Hồ Chí Minh', href: '/jobs?location=hcm' },
    { name: 'Việc làm Đà Nẵng', href: '/jobs?location=danang' },
    { name: 'Việc làm Cần Thơ', href: '/jobs?location=cantho' },
    { name: 'Việc làm IT', href: '/jobs?category=it' },
    { name: 'Việc làm Kế toán', href: '/jobs?category=accounting' },
    { name: 'Việc làm Marketing', href: '/jobs?category=marketing' }
  ];

  const connectLinks = [
    { name: 'Facebook', href: 'https://facebook.com/topjob' },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/topjob' },
    { name: 'YouTube', href: 'https://youtube.com/topjob' },
    { name: 'Telegram', href: 'https://t.me/topjob' }
  ];

  return (
    <footer className="bg-emerald-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-emerald-600 font-bold text-sm">T</span>
              </div>
              <span className="ml-2 text-xl font-bold">
                Top<span className="text-emerald-200">Job</span>
              </span>
            </div>
            <p className="text-emerald-100 text-sm leading-relaxed">
              Kết nối nhân tài với cơ hội việc làm IT hàng đầu Việt Nam. 
              Nền tảng tuyển dụng chuyên nghiệp cho lĩnh vực Công nghệ Thông tin.
            </p>
            <div className="flex space-x-3">
              {connectLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center hover:bg-emerald-400 transition-colors"
                  aria-label={link.name}
                >
                  <span className="text-xs font-semibold">
                    {link.name.charAt(0)}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Về TopJob</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-emerald-100 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-emerald-100 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Job Categories */}
          <div>
            <h3 className="font-semibold mb-4">Ứng dụng trên mobile</h3>
            <div className="space-y-3">
              <p className="text-emerald-100 text-sm">
                Tải ứng dụng TopJob để tìm việc mọi lúc mọi nơi
              </p>
              <div className="flex flex-col space-y-2">
                <a
                  href="#"
                  className="bg-emerald-500 hover:bg-emerald-400 px-4 py-2 rounded-md text-sm font-medium transition-colors text-center"
                >
                  Tải trên App Store
                </a>
                <a
                  href="#"
                  className="bg-emerald-500 hover:bg-emerald-400 px-4 py-2 rounded-md text-sm font-medium transition-colors text-center"
                >
                  Tải trên Google Play
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Job Categories */}
        <div className="mt-8 pt-8 border-t border-emerald-500">
          <h3 className="font-semibold mb-4">Việc làm theo địa điểm & lĩnh vực</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.href}
                className="text-emerald-100 hover:text-white transition-colors text-sm"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-emerald-500 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-emerald-100 text-sm">
            <p>
              © {currentYear} TopJob Vietnam. All rights reserved by TopJob.
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="w-16 h-8 bg-white rounded flex items-center justify-center">
              <span className="text-emerald-600 text-xs font-bold">SSL</span>
            </div>
            <div className="w-16 h-8 bg-white rounded flex items-center justify-center">
              <span className="text-emerald-600 text-xs font-bold">DMCA</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
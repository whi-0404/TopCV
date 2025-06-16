import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPinIcon, 
  UsersIcon,
  ArrowRightIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { Company } from '../../types';

const CompanySection: React.FC = () => {
  // Mock data - sẽ thay thế bằng API call thực tế
  const featuredCompanies: Company[] = [
    {
      id: '1',
      name: 'FPT Smart Cloud',
      description: 'Công ty hàng đầu về Cloud Computing và Digital Transformation tại Việt Nam. Chuyên cung cấp các giải pháp đám mây, AI và IoT.',
      logo: 'https://via.placeholder.com/80x80?text=FPT',
      website: 'https://fpt-software.com',
      employeeRange: '1000+',
      address: 'Hà Nội',
      categoryIds: [1],
      employerId: '1',
      isApproved: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '2',
      name: 'WorkQuest',
      description: 'Nền tảng công việc freelance và blockchain hàng đầu. Kết nối doanh nghiệp với freelancer toàn cầu qua công nghệ blockchain.',
      logo: 'https://via.placeholder.com/80x80?text=WQ',
      website: 'https://workquest.co',
      employeeRange: '100-500',
      address: 'Hồ Chí Minh',
      categoryIds: [1],
      employerId: '2',
      isApproved: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '3',
      name: 'BOSCH',
      description: 'Tập đoàn công nghệ đa quốc gia hàng đầu thế giới. Chuyên về IoT, AI, automotive và công nghệ thông minh.',
      logo: 'https://via.placeholder.com/80x80?text=BOSCH',
      website: 'https://bosch.com.vn',
      employeeRange: '2000+',
      address: 'Đồng Nai',
      categoryIds: [1],
      employerId: '3',
      isApproved: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '4',
      name: 'OPSWAT',
      description: 'Công ty bảo mật mạng hàng đầu thế giới. Chuyên phát triển các giải pháp bảo mật endpoint và critical infrastructure.',
      logo: 'https://via.placeholder.com/80x80?text=OPS',
      website: 'https://opswat.com',
      employeeRange: '500-1000',
      address: 'Hồ Chí Minh',
      categoryIds: [1],
      employerId: '4',
      isApproved: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '5',
      name: 'VinFast',
      description: 'Hãng ô tô điện hàng đầu Việt Nam. Tiên phong trong lĩnh vực xe điện thông minh và giải pháp di chuyển bền vững.',
      logo: 'https://via.placeholder.com/80x80?text=VF',
      website: 'https://vinfast.vn',
      employeeRange: '1000+',
      address: 'Hải Phòng',
      categoryIds: [1],
      employerId: '5',
      isApproved: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '6',
      name: 'Sun* Vietnam',
      description: 'Công ty phát triển phần mềm offshore hàng đầu. Chuyên cung cấp dịch vụ phát triển ứng dụng mobile, web và AI.',
      logo: 'https://via.placeholder.com/80x80?text=SUN',
      website: 'https://sun-asterisk.vn',
      employeeRange: '1000+',
      address: 'Hà Nội',
      categoryIds: [1],
      employerId: '6',
      isApproved: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }
  ];

  const CompanyCard: React.FC<{ company: Company }> = ({ company }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border">
      <div className="flex items-start space-x-4">
        {/* Company Logo */}
        <div className="flex-shrink-0">
          <img
            src={company.logo}
            alt={company.name}
            className="w-16 h-16 rounded-lg object-cover bg-gray-100 border"
          />
        </div>

        {/* Company Info */}
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 hover:text-emerald-600 cursor-pointer">
              <Link to={`/companies/${company.id}`}>
                {company.name}
              </Link>
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
              <div className="flex items-center space-x-1">
                <MapPinIcon className="h-4 w-4 text-gray-400" />
                <span>{company.address}</span>
              </div>
              <div className="flex items-center space-x-1">
                <UsersIcon className="h-4 w-4 text-gray-400" />
                <span>{company.employeeRange} nhân viên</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-700 line-clamp-3">
            {company.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
                Technology
              </span>
              <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                Hiring
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600"
              >
                <GlobeAltIcon className="h-5 w-5" />
              </a>
              <Link
                to={`/companies/${company.id}`}
                className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center space-x-1"
              >
                <span>Xem chi tiết</span>
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Công ty IT
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Khám phá các công ty công nghệ hàng đầu đang tuyển dụng nhân tài IT
          </p>
          <Link
            to="/companies"
            className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-medium mt-4"
          >
            <span>Xem tất cả</span>
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {featuredCompanies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/companies"
            className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors inline-flex items-center space-x-2"
          >
            <span>Xem thêm công ty</span>
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CompanySection;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPinIcon, 
  UsersIcon,
  ArrowRightIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { companyApi, CompanyDashboardResponse } from '../../services/api/companyApi';

const CompanySection: React.FC = () => {
  const [featuredCompanies, setFeaturedCompanies] = useState<CompanyDashboardResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeaturedCompanies();
  }, []);

  const fetchFeaturedCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Lấy danh sách công ty và chọn 6 công ty đầu tiên làm featured
      const response = await companyApi.getAllCompanies(1, 6);

      if (response.code === 1000 && response.result) {
        setFeaturedCompanies(response.result.data || []);
      } else {
        setError('Không thể tải danh sách công ty');
      }
    } catch (err) {
      console.error('Error fetching featured companies:', err);
      setError('Đã có lỗi xảy ra khi tải danh sách công ty');
    } finally {
      setLoading(false);
    }
  };

  const CompanyCard: React.FC<{ company: CompanyDashboardResponse }> = ({ company }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border">
      <div className="flex items-start space-x-4">
        {/* Company Logo */}
        <div className="flex-shrink-0">
          <img
            src={company.logo ? `http://localhost:8080/TopCV/uploads/${company.logo}` : `https://via.placeholder.com/64x64?text=${company.name?.charAt(0) || 'C'}`}
            alt={company.name}
            className="w-16 h-16 rounded-lg object-cover bg-gray-100 border"
            onError={(e) => {
              e.currentTarget.src = `https://via.placeholder.com/64x64?text=${company.name?.charAt(0) || 'C'}`;
            }}
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
                <UsersIcon className="h-4 w-4 text-gray-400" />
                <span>{company.jobCount} việc làm</span>
              </div>
              {company.categories && company.categories.length > 0 && (
                <div className="flex items-center space-x-1">
                  <span className="text-gray-400">•</span>
                  <span>{company.categories[0].name}</span>
                </div>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-700 line-clamp-3">
            {company.description || 'Thông tin mô tả công ty sẽ được cập nhật sau'}
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

  if (loading) {
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
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
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
          </div>
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchFeaturedCompanies}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </section>
    );
  }

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

        {featuredCompanies.length > 0 ? (
          <div className="grid lg:grid-cols-2 gap-6">
            {featuredCompanies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-600 mb-4">Chưa có công ty nào được đăng ký</p>
            <Link
              to="/companies"
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Xem tất cả công ty
            </Link>
          </div>
        )}

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
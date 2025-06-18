import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPinIcon, 
  CurrencyDollarIcon,
  ClockIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { jobPostApi, JobPostDashboardResponse } from '../../services/api/jobPostApi';

const JobSection: React.FC = () => {
  const [featuredJobs, setFeaturedJobs] = useState<JobPostDashboardResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeaturedJobs();
  }, []);

  const fetchFeaturedJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Lấy 6 jobs mới nhất làm featured jobs
      const response = await jobPostApi.searchJobPosts({
        page: 1,
        size: 6,
        sortBy: 'createdAt',
        sortDirection: 'desc'
      });

      if (response.code === 1000 && response.result) {
        setFeaturedJobs(response.result.data || []);
      } else {
        setError('Không thể tải danh sách việc làm');
      }
    } catch (err) {
      console.error('Error fetching featured jobs:', err);
      setError('Đã có lỗi xảy ra khi tải danh sách việc làm');
    } finally {
      setLoading(false);
    }
  };

  const formatSalary = (salary?: string | null): string => {
    if (!salary) return 'Thỏa thuận';
    return salary;
  };

  const formatDate = (dateString?: string | null): string => {
    if (!dateString) return 'Không xác định';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const JobCard: React.FC<{ job: JobPostDashboardResponse }> = ({ job }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border">
      <div className="flex items-start space-x-4">
        {/* Company Logo */}
        <div className="flex-shrink-0">
          <img
            src={job.logo ? `http://localhost:8080/TopCV/uploads/${job.logo}` : `https://via.placeholder.com/48x48?text=${job.companyName?.charAt(0) || 'C'}`}
            alt={job.companyName}
            className="w-12 h-12 rounded-lg object-cover bg-gray-100"
            onError={(e) => {
              e.currentTarget.src = `https://via.placeholder.com/48x48?text=${job.companyName?.charAt(0) || 'C'}`;
            }}
          />
        </div>

        {/* Job Info */}
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 hover:text-emerald-600 cursor-pointer line-clamp-2">
              <Link to={`/jobs/${job.id}`}>
                {job.title}
              </Link>
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {job.companyName}
            </p>
          </div>

          <p className="text-sm text-gray-700 line-clamp-2">
            {job.experienceLevel ? `Yêu cầu: ${job.experienceLevel}` : 'Thông tin chi tiết sẽ có trong trang việc làm'}
          </p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <CurrencyDollarIcon className="h-4 w-4 text-emerald-500" />
              <span>{formatSalary(job.salary)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPinIcon className="h-4 w-4 text-gray-400" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ClockIcon className="h-4 w-4 text-gray-400" />
              <span>Hạn: {formatDate(job.deadline)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
                {job.type?.name || 'Full-time'}
              </span>
              <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                {job.level?.name || 'Junior'}
              </span>
            </div>
            <Link
              to={`/jobs/${job.id}`}
              className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center space-x-1"
            >
              <span>Xem chi tiết</span>
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Công việc IT
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Khám phá những cơ hội việc làm IT hấp dẫn từ các công ty hàng đầu
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
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Công việc IT
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Khám phá những cơ hội việc làm IT hấp dẫn từ các công ty hàng đầu
            </p>
          </div>
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchFeaturedJobs}
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
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Công việc IT
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Khám phá những cơ hội việc làm IT hấp dẫn từ các công ty hàng đầu
          </p>
          <Link
            to="/jobs"
            className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-medium mt-4"
          >
            <span>Xem tất cả</span>
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>

        {featuredJobs.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-600 mb-4">Chưa có việc làm nào được đăng</p>
            <Link
              to="/jobs"
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Xem tất cả việc làm
            </Link>
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/jobs"
            className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors inline-flex items-center space-x-2"
          >
            <span>Xem thêm việc làm</span>
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default JobSection;
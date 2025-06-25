import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobPostApi, JobPostResponse, JobPostStatus } from '../services/api/jobPostApi';
import { 
  MapPinIcon, 
  CurrencyDollarIcon,
  CalendarIcon,
  UserGroupIcon,
  HeartIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  ClockIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import Layout from '../components/layout/Layout';
import Breadcrumb from '../components/common/Breadcrumb';
import ApplyJobModal from '../components/job/ApplyJobModal';
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = 'http://localhost:8080/TopCV';

// Helper component for detail items
const DetailItem: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode }> = ({ icon, label, value }) => (
  <div className="flex items-start space-x-3">
    <div className="flex-shrink-0 w-6 h-6 text-gray-500">{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-base text-gray-900 font-semibold">{value}</p>
    </div>
  </div>
);

// Helper component for rendering text with newlines or as bullet list
const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;
  // Tách câu: xuống dòng sau . ! ? hoặc ... nếu sau đó là chữ hoa, KHÔNG xuống dòng sau ... nếu sau đó không phải chữ hoa
  let processed = text
    // Tạm thời thay thế ... bằng một token đặc biệt để không bị tách nhầm
    .replace(/\.\.\./g, '[[ELLIPSIS]]');
  // Thêm xuống dòng sau . ! ? nếu sau đó là khoảng trắng + chữ hoa
  processed = processed.replace(/([.!?])\s+(?=[A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯẠ-ỹ])/g, '$1\n');
  // Khôi phục ...
  processed = processed.replace(/\[\[ELLIPSIS\]\]/g, '...');
  // Tách dòng
  const lines = processed
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0);
  if (lines.length > 1) {
    return (
      <ul className="list-disc pl-6 text-gray-700 space-y-1">
        {lines.map((line, idx) => (
          <li key={idx}>{line}</li>
        ))}
      </ul>
    );
  }
  // Nếu chỉ có 1 dòng, hiển thị như cũ
  return <p className="text-gray-700 whitespace-pre-line">{text}</p>;
};

const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [job, setJob] = useState<JobPostResponse | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate('/jobs');
      return;
    }

    fetchJobDetails();
  }, [id, navigate]);

  const handleFavoriteToggle = async () => {
    if (!job) return;

    try {
      if (isFavorite) {
        await jobPostApi.unfavoriteJob(job.id);
        setIsFavorite(false);
      } else {
        await jobPostApi.favoriteJob(job.id);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const handleApplyClick = () => {
    if (!user) {
      // Redirect to login if not authenticated
      navigate('/auth/login', { 
        state: { from: `/jobs/${id}` } 
      });
      return;
    }

    if (user.role !== 'USER') {
      alert('Chỉ ứng viên mới có thể ứng tuyển việc làm');
      return;
    }

    setShowApplyModal(true);
  };

  const handleApplySuccess = () => {
    // Refresh job data to update canApply status
    if (id) {
      fetchJobDetails();
    }
  };

  const fetchJobDetails = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);

      const jobResponse = await jobPostApi.getJobPostDetail(Number(id));
      
      if (jobResponse.code === 1000 && jobResponse.result) {
        setJob(jobResponse.result);
        setIsFavorite(jobResponse.result.isFavorite);
        
        if (!jobResponse.result.isFavorite) {
          try {
            const favoriteResponse = await jobPostApi.isFavoriteJob(Number(id));
            if (favoriteResponse.code === 1000) {
              setIsFavorite(favoriteResponse.result);
            }
          } catch (favoriteError) {
            console.log('User not authenticated or error fetching favorite status');
          }
        }
      } else {
        setError('Không thể tải thông tin công việc');
      }
    } catch (err) {
      console.error('Error fetching job details:', err);
      setError('Đã có lỗi xảy ra khi tải thông tin công việc');
    } finally {
      setLoading(false);
    }
  };

  const formatSalary = (salary?: string): string => {
    if (!salary || salary.trim() === '') return 'Thỏa thuận';
    return salary;
  };

  const formatDeadline = (deadline: string): string => {
    try {
      const date = new Date(deadline);
      return date.toLocaleDateString('vi-VN');
    } catch {
      return 'Không xác định';
    }
  };

  const formatDateTime = (dateTime: string): string => {
    try {
      const date = new Date(dateTime);
      return date.toLocaleDateString('vi-VN');
    } catch {
      return 'Không xác định';
    }
  };

  const getStatusColor = (status: JobPostStatus): string => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800';
      case 'CLOSED':
        return 'bg-red-100 text-red-800';
      case 'SUSPENDED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-blue-100 text-blue-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: JobPostStatus): string => {
    switch (status) {
      case 'ACTIVE':
        return 'Đang tuyển';
      case 'DRAFT':
        return 'Bản nháp';
      case 'CLOSED':
        return 'Đã đóng';
      case 'SUSPENDED':
        return 'Tạm dừng';
      case 'PENDING':
        return 'Chờ duyệt';
      case 'APPROVED':
        return 'Đã duyệt';
      case 'REJECTED':
        return 'Bị từ chối';
      default:
        return status;
    }
  };

  const getCompanyLogoUrl = (logoPath?: string) => {
    if (!logoPath) return '/default-logo.png'; // Provide a default logo path
    return `${API_BASE_URL}/uploads/${logoPath}`;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (error || !job) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen py-16 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">{error || 'Không tìm thấy công việc'}</h2>
          <p className="text-gray-600 mb-6">Công việc bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <button
            onClick={() => navigate('/jobs')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Quay lại danh sách việc làm
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumb
            items={[
              { label: 'Trang chủ', href: '/' },
              { label: 'Việc làm', href: '/jobs' },
              { label: job.title },
            ]}
          />

          {/* Job Header */}
          <div className="bg-white p-6 rounded-lg shadow-sm mt-4">
            <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
              <div className="flex-shrink-0">
                <img
                  src={getCompanyLogoUrl(job.company.logo)}
                  alt={`${job.company.name} logo`}
                  className="w-24 h-24 rounded-lg object-contain border border-gray-200"
                />
              </div>
              <div className="flex-grow">
                <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                <p className="text-lg text-gray-600 mt-1">{job.company.name}</p>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <ClockIcon className="w-4 h-4 mr-1.5" />
                  <span>Hạn nộp hồ sơ: {formatDeadline(job.deadline)}</span>
                  <span className={`ml-4 px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(job.status)}`}>
                    {getStatusText(job.status)}
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0 w-full md:w-auto">
                <div className="flex items-center space-x-2">
                  {user && user.role === 'USER' && (
                    <button
                      onClick={handleFavoriteToggle}
                      className="p-3 rounded-full hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors"
                    >
                      {isFavorite ? <HeartIconSolid className="w-6 h-6 text-red-500" /> : <HeartIcon className="w-6 h-6" />}
                    </button>
                  )}
                  <button
                    onClick={handleApplyClick}
                    disabled={!job.canApply}
                    className="w-full md:w-auto flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <PaperAirplaneIcon className="w-5 h-5 mr-2 -rotate-45" />
                    {job.canApply ? 'Ứng tuyển ngay' : 'Đã ứng tuyển'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Left Column */}
            <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Chi tiết tin tuyển dụng</h2>
              
              <div className="space-y-8">
                {job.description && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Mô tả công việc</h3>
                    <FormattedText text={job.description} />
                  </div>
                )}
                {job.requirements && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Yêu cầu ứng viên</h3>
                    <FormattedText text={job.requirements} />
                  </div>
                )}
                {job.benefits && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Quyền lợi</h3>
                    <FormattedText text={job.benefits} />
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Thông tin chung</h3>
                <div className="space-y-4">
                  <DetailItem icon={<CurrencyDollarIcon />} label="Mức lương" value={formatSalary(job.salary)} />
                  <DetailItem icon={<BriefcaseIcon />} label="Cấp bậc" value={job.jobLevel.name} />
                  <DetailItem icon={<AcademicCapIcon />} label="Kinh nghiệm" value={job.experienceRequired} />
                  <DetailItem icon={<UserGroupIcon />} label="Số lượng tuyển" value={`${job.hiringQuota} người`} />
                  <DetailItem icon={<ClockIcon />} label="Hình thức làm việc" value={job.workingTime} />
                  <DetailItem icon={<MapPinIcon />} label="Địa điểm" value={job.location} />
                </div>
              </div>
              
              {job.skills && job.skills.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Kỹ năng yêu cầu</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map(skill => (
                      <span key={skill.id} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Về {job.company.name}</h3>
                <p className="text-gray-600 whitespace-pre-line">{job.company.description}</p>
                 <button 
                  onClick={() => navigate(`/companies/${job.company.id}`)}
                  className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Xem trang công ty &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {job && (
        <ApplyJobModal
          isOpen={showApplyModal}
          onClose={() => setShowApplyModal(false)}
          jobId={job.id}
          jobTitle={job.title}
          companyName={job.company.name}
          onSuccess={handleApplySuccess}
        />
      )}
    </Layout>
  );
};

export default JobDetailPage; 
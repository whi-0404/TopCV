import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import JobApplicationForm from '../components/job/JobApplicationForm';
import jobService, { JobPost } from '../services/jobService';

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<JobPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isCheckingFavorite, setIsCheckingFavorite] = useState(false);

  useEffect(() => {
    const loadJobDetail = async () => {
      if (!id) {
        setError('ID công việc không hợp lệ');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const jobData = await jobService.getJobById(parseInt(id));
        setJob(jobData);
        
        // Check if job is favorite (only if user is logged in)
        try {
          setIsCheckingFavorite(true);
          const favoriteStatus = await jobService.isFavoriteJob(parseInt(id));
          setIsFavorite(favoriteStatus);
        } catch (err) {
          // User might not be logged in, ignore error
          console.log('Not checking favorite status (user not logged in)');
        } finally {
          setIsCheckingFavorite(false);
        }
        
        setError('');
      } catch (err: any) {
        console.error('Failed to load job details:', err);
        setError('Không thể tải thông tin công việc. Vui lòng thử lại.');
      } finally {
        setIsLoading(false);
      }
    };

    loadJobDetail();
  }, [id]);

  const handleFavoriteToggle = async () => {
    if (!job || isCheckingFavorite) return;

    try {
      setIsCheckingFavorite(true);
      if (isFavorite) {
        await jobService.unfavoriteJob(job.id);
        setIsFavorite(false);
      } else {
        await jobService.favoriteJob(job.id);
        setIsFavorite(true);
      }
    } catch (err: any) {
      console.error('Failed to toggle favorite:', err);
      // If not authenticated, redirect to login
      if (err.message?.includes('Authentication')) {
        navigate('/auth/jobseeker/login');
      }
    } finally {
      setIsCheckingFavorite(false);
    }
  };

  const handleApplyClick = () => {
    setShowApplicationForm(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mr-3"></div>
            <span className="text-gray-600">Đang tải thông tin công việc...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Có lỗi xảy ra</h3>
            <p className="text-gray-600 mb-4">{error || 'Không tìm thấy công việc'}</p>
            <button 
              onClick={() => navigate('/jobs')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Quay lại danh sách việc làm
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <img
                src={jobService.getCompanyLogoUrl(job.company.logo)}
                alt={job.company.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                <div className="flex items-center gap-4 mt-2 text-gray-600">
                  <span>{job.company.name}</span>
                  <span>•</span>
                  <span>{job.location || 'Không xác định'}</span>
                  <span>•</span>
                  <span>{job.jobType?.name || 'Không xác định'}</span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span>{jobService.formatDate(job.createdAt)}</span>
                  <span>•</span>
                  <span>{jobService.formatSalary(job.salary)}</span>
                  {job.deadline && (
                    <>
                      <span>•</span>
                      <span>Hạn nộp: {new Date(job.deadline).toLocaleDateString('vi-VN')}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleFavoriteToggle}
                disabled={isCheckingFavorite}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  isFavorite 
                    ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' 
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                } ${isCheckingFavorite ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isCheckingFavorite ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <svg className={`w-4 h-4 mr-2 inline ${isFavorite ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {isFavorite ? 'Đã yêu thích' : 'Yêu thích'}
                  </>
                )}
              </button>
              <button 
                onClick={handleApplyClick}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Ứng tuyển ngay
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="col-span-2 space-y-8">
            {/* Description */}
            {job.description && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Mô tả công việc</h2>
                <div className="text-gray-600 whitespace-pre-line">
                  {job.description}
                </div>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Yêu cầu công việc</h2>
                <div className="text-gray-600 whitespace-pre-line">
                  {job.requirements}
                </div>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Quyền lợi</h2>
                <div className="text-gray-600 whitespace-pre-line">
                  {job.benefits}
                </div>
              </div>
            )}

            {/* Working Time */}
            {job.workingTime && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Thời gian làm việc</h2>
                <div className="text-gray-600 whitespace-pre-line">
                  {job.workingTime}
                </div>
              </div>
            )}

            {/* Skills Required */}
            {job.skills && job.skills.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Kỹ năng yêu cầu</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job Overview */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Thông tin chung</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày đăng</span>
                  <span className="font-medium">{jobService.formatDate(job.createdAt)}</span>
                </div>
                {job.jobType && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Loại hình</span>
                    <span className="font-medium">{job.jobType.name}</span>
                  </div>
                )}
                {job.jobLevel && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cấp độ</span>
                    <span className="font-medium">{job.jobLevel.name}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Mức lương</span>
                  <span className="font-medium">{jobService.formatSalary(job.salary)}</span>
                </div>
                {job.experienceRequired && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kinh nghiệm</span>
                    <span className="font-medium">{job.experienceRequired}</span>
                  </div>
                )}
                {job.deadline && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hạn nộp</span>
                    <span className="font-medium">
                      {new Date(job.deadline).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                )}
                {job.hiringQuota && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số lượng tuyển</span>
                    <span className="font-medium">{job.hiringQuota} người</span>
                  </div>
                )}
                {job.appliedCount !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Đã ứng tuyển</span>
                    <span className="font-medium">{job.appliedCount} người</span>
                  </div>
                )}
              </div>
            </div>

            {/* Company Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Thông tin công ty</h2>
              <div className="flex items-start gap-3 mb-4">
                <img
                  src={jobService.getCompanyLogoUrl(job.company.logo)}
                  alt={job.company.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{job.company.name}</h3>
                  {job.company.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {job.company.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                {job.company.jobCount !== undefined && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{job.company.jobCount}</span> việc làm đang tuyển
                  </div>
                )}
                <button 
                  onClick={() => navigate(`/companies/${job.company.id}`)}
                  className="w-full text-center py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Xem trang công ty
                </button>
              </div>
            </div>

            {/* Apply Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Ứng tuyển ngay</h2>
              <p className="text-gray-600 text-sm mb-4">
                Gửi hồ sơ của bạn để ứng tuyển vào vị trí này
              </p>
              <button 
                onClick={handleApplyClick}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Ứng tuyển ngay
              </button>
            </div>
          </div>
        </div>
      </main>

      {showApplicationForm && job && (
        <JobApplicationForm
          jobTitle={job.title}
          companyName={job.company.name}
          companyLogo={jobService.getCompanyLogoUrl(job.company.logo)}
          location={job.location || 'Không xác định'}
          jobType={job.jobType?.name || 'Không xác định'}
          onClose={() => setShowApplicationForm(false)}
        />
      )}
    </div>
  );
};

export default JobDetail; 
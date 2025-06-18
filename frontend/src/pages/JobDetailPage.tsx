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

     if (loading) {
  return (
    <Layout>
         <div className="flex items-center justify-center min-h-96">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
       </Layout>
     );
   }

   if (error || !job) {
     return (
       <Layout>
         <div className="flex flex-col items-center justify-center min-h-96 py-16">
           <div className="text-red-600 text-xl mb-4">{error || 'Không tìm thấy công việc'}</div>
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
         {/* Breadcrumb */}
         <Breadcrumb 
           items={[
             { label: 'Việc làm', href: '/jobs' },
             { label: job.company.name, href: `/companies/${job.company.id}` },
             { label: job.title }
           ]} 
         />

        {/* Job Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Job Info */}
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-6">
                {/* Company Logo */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                    {job.company.logo ? (
                      <img
                        src={`http://localhost:8080/TopCV/uploads/${job.company.logo}`}
                        alt={job.company.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Company logo failed to load:', job.company.logo);
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.style.display = 'flex';
                        }}
                      />
                    ) : (
                      <BriefcaseIcon className="w-8 h-8 text-gray-400" />
                    )}
                    {job.company.logo && (
                      <BriefcaseIcon className="w-8 h-8 text-gray-400" style={{ display: 'none' }} />
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                  <button
                    onClick={() => navigate(`/companies/${job.company.id}`)}
                    className="text-xl text-blue-600 hover:underline mb-3"
                  >
                    {job.company.name}
                  </button>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
                      {getStatusText(job.status)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Job Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <CurrencyDollarIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Mức lương</div>
                    <div className="font-medium text-green-600">{formatSalary(job.salary)}</div>
              </div>
            </div>

                <div className="flex items-center gap-2">
                  <MapPinIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Địa điểm</div>
                    <div className="font-medium">{job.location}</div>
          </div>
        </div>

                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Hạn ứng tuyển</div>
                    <div className="font-medium">{formatDeadline(job.deadline)}</div>
                </div>
              </div>

                <div className="flex items-center gap-2">
                  <UserGroupIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Số lượng cần tuyển</div>
                    <div className="font-medium">{job.hiringQuota} người</div>
                    </div>
                </div>
              </div>

              {/* Job Classification */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {job.jobType.name}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {job.jobLevel.name}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  <AcademicCapIcon className="w-4 h-4 inline mr-1" />
                  {job.experienceRequired}
                </span>
                {job.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {skill.name}
                  </span>
                  ))}
                </div>
              </div>

            {/* Action Buttons */}
            <div className="flex-shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
              <button
                onClick={handleFavoriteToggle}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  isFavorite
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isFavorite ? (
                  <HeartIconSolid className="w-5 h-5" />
                ) : (
                  <HeartIcon className="w-5 h-5" />
                )}
                {isFavorite ? 'Đã lưu' : 'Lưu việc làm'}
              </button>

              {job.canApply !== false && job.status === 'ACTIVE' && (
                <button 
                  onClick={handleApplyClick}
                  className="flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  <PaperAirplaneIcon className="w-5 h-5" />
                  Ứng tuyển ngay
                </button>
              )}
                        </div>
                      </div>
                    </div>
                  </div>

             {/* Job Content */}
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                     {/* Main Content */}
           <div className="lg:col-span-2 space-y-8">
             {/* Job Overview */}
             <div className="bg-white rounded-lg shadow-sm p-6">
               <h2 className="text-2xl font-semibold mb-4">Tổng quan về công việc</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <h3 className="text-lg font-medium mb-3">Thông tin cơ bản</h3>
                   <div className="space-y-2">
                     <div className="flex justify-between">
                       <span className="text-gray-600">Vị trí:</span>
                       <span className="font-medium">{job.title}</span>
                        </div>
                     <div className="flex justify-between">
                       <span className="text-gray-600">Địa điểm:</span>
                       <span className="font-medium">{job.location}</span>
                      </div>
                     <div className="flex justify-between">
                       <span className="text-gray-600">Mức lương:</span>
                       <span className="font-medium text-green-600">{formatSalary(job.salary)}</span>
                    </div>
                     <div className="flex justify-between">
                       <span className="text-gray-600">Kinh nghiệm:</span>
                       <span className="font-medium">{job.experienceRequired}</span>
                        </div>
                      </div>
                    </div>
                 
                 <div>
                   <h3 className="text-lg font-medium mb-3">Thời gian & Ứng tuyển</h3>
                   <div className="space-y-2">
                     <div className="flex justify-between">
                       <span className="text-gray-600">Hạn ứng tuyển:</span>
                       <span className="font-medium">{formatDeadline(job.deadline)}</span>
                  </div>
                     <div className="flex justify-between">
                       <span className="text-gray-600">Số người cần tuyển:</span>
                       <span className="font-medium">{job.hiringQuota} người</span>
                        </div>
                     <div className="flex justify-between">
                       <span className="text-gray-600">Đã ứng tuyển:</span>
                       <span className="font-medium">{job.appliedCount} người</span>
                      </div>
                     <div className="flex justify-between">
                       <span className="text-gray-600">Trạng thái:</span>
                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                         {getStatusText(job.status)}
                       </span>
                    </div>
                   </div>
                 </div>
               </div>
             </div>

             {/* Skills Required */}
             {job.skills && job.skills.length > 0 && (
               <div className="bg-white rounded-lg shadow-sm p-6">
                 <h2 className="text-2xl font-semibold mb-4">Kỹ năng yêu cầu</h2>
                 <div className="flex flex-wrap gap-2">
                   {job.skills.map((skill) => (
                     <span
                       key={skill.id}
                       className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium"
                     >
                       {skill.name}
                     </span>
                   ))}
                 </div>
               </div>
             )}

             {/* How to Apply */}
             <div className="bg-white rounded-lg shadow-sm p-6">
               <h2 className="text-2xl font-semibold mb-4">Cách thức ứng tuyển</h2>
               <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                 <p className="text-blue-800 mb-3">
                   Để ứng tuyển vào vị trí <strong>{job.title}</strong> tại <strong>{job.company.name}</strong>, 
                   vui lòng nhấp vào nút "Ứng tuyển ngay" và hoàn thành hồ sơ của bạn.
                 </p>
                 <div className="text-sm text-blue-600">
                   <p><strong>Lưu ý:</strong></p>
                   <ul className="list-disc list-inside mt-1 space-y-1">
                     <li>Đảm bảo CV của bạn được cập nhật đầy đủ</li>
                     <li>Kiểm tra kỹ các yêu cầu công việc trước khi ứng tuyển</li>
                     <li>Hạn cuối ứng tuyển: {formatDeadline(job.deadline)}</li>
                   </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                         {/* Job Summary */}
             <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
               <h3 className="text-lg font-semibold mb-4">Thông tin chung</h3>
               <div className="space-y-3">
                 <div className="flex justify-between items-center py-2 hover:bg-gray-50 rounded px-2 -mx-2 transition-colors">
                   <span className="text-gray-600">Kinh nghiệm:</span>
                   <span className="font-medium">{job.experienceRequired}</span>
                  </div>
                 <div className="flex justify-between items-center py-2 hover:bg-gray-50 rounded px-2 -mx-2 transition-colors">
                   <span className="text-gray-600">Loại công việc:</span>
                   <span className="font-medium text-blue-600">{job.jobType.name}</span>
                  </div>
                 <div className="flex justify-between items-center py-2 hover:bg-gray-50 rounded px-2 -mx-2 transition-colors">
                   <span className="text-gray-600">Cấp bậc:</span>
                   <span className="font-medium text-green-600">{job.jobLevel.name}</span>
                  </div>
                 <div className="flex justify-between items-center py-2 hover:bg-gray-50 rounded px-2 -mx-2 transition-colors">
                   <span className="text-gray-600">Số người đã ứng tuyển:</span>
                   <span className="font-medium text-orange-600">{job.appliedCount}</span>
                  </div>
                 <div className="flex justify-between items-center py-2 hover:bg-gray-50 rounded px-2 -mx-2 transition-colors">
                   <span className="text-gray-600">Cần tuyển:</span>
                   <span className="font-medium text-purple-600">{job.hiringQuota} người</span>
                  </div>
                </div>
              </div>

            {/* Company Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Thông tin công ty</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                  {job.company.logo ? (
                    <img
                      src={`http://localhost:8080/TopCV/uploads/${job.company.logo}`}
                      alt={job.company.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Company logo failed to load in sidebar:', job.company.logo);
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                        if (fallback) {
                          fallback.style.display = 'block';
                        }
                      }}
                    />
                  ) : null}
                  <BriefcaseIcon 
                    className="w-6 h-6 text-gray-400" 
                    style={{ display: job.company.logo ? 'none' : 'block' }}
                  />
                </div>
                <div>
                  <h4 className="font-medium">{job.company.name}</h4>
                  <p className="text-sm text-gray-600">{job.company.jobCount} việc làm</p>
                </div>
              </div>

              <button
                onClick={() => navigate(`/companies/${job.company.id}`)}
                className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Xem công ty
              </button>
            </div>

            {/* Job Timing */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Thời gian</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Đăng ngày</div>
                    <div className="font-medium">{formatDateTime(job.createdAt)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Hạn ứng tuyển</div>
                    <div className="font-medium">{formatDeadline(job.deadline)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
       </div>

       {/* Apply Job Modal */}
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
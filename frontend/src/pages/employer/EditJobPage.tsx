import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  HomeIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
  CheckIcon,
  CalendarIcon,
  MapPinIcon,
  BanknotesIcon,
  AcademicCapIcon,
  TagIcon,
  ClockIcon,
  ChevronDownIcon,
  ArrowLeftIcon,
  ChatBubbleLeftRightIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { 
  jobTypeApi, 
  jobLevelApi, 
  skillApi,
  type JobTypeResponse,
  type JobLevelResponse,
  type SkillResponse
} from '../../services/api/jobTypeLevelApi';
import { 
  jobPostApi, 
  type JobPostUpdateRequest,
  type JobPostResponse
} from '../../services/api/jobPostApi';

interface FormData extends Omit<JobPostUpdateRequest, 'jobTypeId' | 'jobLevelId' | 'skillIds'> {
  jobTypeId: string;
  jobLevelId: string;
  skillIds: string[];
}

interface FieldError {
  field: string;
  message: string;
}

const EditJobPage: React.FC = () => {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [jobData, setJobData] = useState<JobPostResponse | null>(null);

  // Form data
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    requirements: '',
    benefits: '',
    location: '',
    workingTime: '',
    salary: '',
    experienceRequired: '',
    deadline: '',
    hiringQuota: 1,
    jobTypeId: '',
    jobLevelId: '',
    skillIds: []
  });

  // Options data
  const [jobTypes, setJobTypes] = useState<JobTypeResponse[]>([]);
  const [jobLevels, setJobLevels] = useState<JobLevelResponse[]>([]);
  const [skills, setSkills] = useState<SkillResponse[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<SkillResponse[]>([]);

  const [errors, setErrors] = useState<FieldError[]>([]);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (jobId) {
      loadJobData();
    }
  }, [jobId]);

  const loadJobData = async () => {
    if (!jobId) return;
    
    setLoading(true);
    try {
      // Load job data and options in parallel
      const [jobResponse, jobTypesRes, jobLevelsRes, skillsRes] = await Promise.all([
        jobPostApi.getJobPostDetail(parseInt(jobId)),
        jobTypeApi.getAllJobTypes(),
        jobLevelApi.getAllJobLevels(),
        skillApi.getAllSkills()
      ]);

      const job = jobResponse.result;
      setJobData(job);
      setJobTypes(jobTypesRes.result);
      setJobLevels(jobLevelsRes.result);
      setSkills(skillsRes.result);

      // Populate form with job data
      setFormData({
        title: job.title || '',
        description: job.description || '',
        requirements: job.requirements || '',
        benefits: job.benefits || '',
        location: job.location || '',
        workingTime: job.workingTime || '',
        salary: job.salary || '',
        experienceRequired: job.experienceRequired || '',
        deadline: job.deadline ? job.deadline.split('T')[0] : '', // Convert to YYYY-MM-DD format
        hiringQuota: job.hiringQuota || 1,
        jobTypeId: job.jobType?.id?.toString() || '',
        jobLevelId: job.jobLevel?.id?.toString() || '',
        skillIds: job.skills?.map(skill => skill.id.toString()) || []
      });

      // Set selected skills
      setSelectedSkills(job.skills || []);

    } catch (error: any) {
      console.error('Error loading job data:', error);
      setErrors([{ field: 'general', message: 'Không thể tải thông tin công việc. Vui lòng thử lại.' }]);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleInputChange = (field: keyof FormData, value: string | number | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors.find(e => e.field === field)) {
      setErrors(prev => prev.filter(e => e.field !== field));
    }
  };

  const handleSkillSelect = (skillId: string) => {
    const skill = skills.find(s => s.id.toString() === skillId);
    if (!skill) return;

    if (selectedSkills.find(s => s.id === skill.id)) {
      // Remove skill
      setSelectedSkills(prev => prev.filter(s => s.id !== skill.id));
      setFormData(prev => ({
        ...prev,
        skillIds: prev.skillIds.filter(id => id !== skillId)
      }));
    } else {
      // Add skill
      setSelectedSkills(prev => [...prev, skill]);
      setFormData(prev => ({
        ...prev,
        skillIds: [...prev.skillIds, skillId]
      }));
    }
  };

  const removeSkill = (skillId: number) => {
    setSelectedSkills(prev => prev.filter(s => s.id !== skillId));
    setFormData(prev => ({
      ...prev,
      skillIds: prev.skillIds.filter(id => id !== skillId.toString())
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FieldError[] = [];

    if (!formData.title?.trim()) newErrors.push({ field: 'title', message: 'Tiêu đề công việc là bắt buộc' });
    if (!formData.location?.trim()) newErrors.push({ field: 'location', message: 'Địa điểm làm việc là bắt buộc' });
    if (!formData.salary?.trim()) newErrors.push({ field: 'salary', message: 'Mức lương là bắt buộc' });
    if (!formData.deadline) newErrors.push({ field: 'deadline', message: 'Hạn nộp hồ sơ là bắt buộc' });
    if (!formData.hiringQuota || formData.hiringQuota < 1) newErrors.push({ field: 'hiringQuota', message: 'Số lượng tuyển dụng phải lớn hơn 0' });

    // Validate deadline is in future
    if (formData.deadline) {
      const selectedDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate <= today) {
        newErrors.push({ field: 'deadline', message: 'Hạn nộp hồ sơ phải là ngày trong tương lai' });
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const firstError = errors[0];
      if (firstError) {
        alert(`Vui lòng kiểm tra: ${firstError.message}`);
      }
      return;
    }

    if (!jobId) {
      alert('Không tìm thấy ID công việc');
      return;
    }

    setSubmitLoading(true);
    setErrors([]);
    setSuccess('');
    
    try {
      const requestData: JobPostUpdateRequest = {
        title: formData.title?.trim(),
        description: formData.description?.trim(),
        requirements: formData.requirements?.trim(),
        benefits: formData.benefits?.trim(),
        location: formData.location?.trim(),
        workingTime: formData.workingTime?.trim(),
        salary: formData.salary?.trim(),
        experienceRequired: formData.experienceRequired?.trim(),
        deadline: formData.deadline,
        hiringQuota: formData.hiringQuota,
        jobTypeId: formData.jobTypeId ? parseInt(formData.jobTypeId) : undefined,
        jobLevelId: formData.jobLevelId ? parseInt(formData.jobLevelId) : undefined,
        skillIds: formData.skillIds.length > 0 ? formData.skillIds.map(id => parseInt(id)) : undefined
      };

      console.log('Updating job post with data:', requestData);
      
      const response = await jobPostApi.updateJobPost(parseInt(jobId), requestData);
      console.log('Job post updated successfully:', response);

      setSuccess('Cập nhật tin tuyển dụng thành công!');
      
      // Redirect sau 2 giây
      setTimeout(() => {
        navigate('/employer/jobs');
      }, 2000);
      
    } catch (error: any) {
      console.error('Error updating job post:', error);
      console.error('Error response:', error.response?.data);
      
      let errorMessage = 'Có lỗi xảy ra khi cập nhật tin tuyển dụng';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.errors && Array.isArray(errorData.errors)) {
          errorMessage = errorData.errors.join(', ');
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setErrors([{ field: 'general', message: errorMessage }]);
    } finally {
      setSubmitLoading(false);
    }
  };

  const sidebarItems = [
    { icon: HomeIcon, label: 'Tổng quan', href: '/employer/dashboard' },
    { icon: BriefcaseIcon, label: 'Danh sách công việc', active: true, href: '/employer/jobs' },
    { icon: UsersIcon, label: 'Tất cả ứng viên', href: '/employer/candidates' },
    { icon: BuildingOfficeIcon, label: 'Hồ sơ công ty', href: '/employer/company' },
    { icon: Cog6ToothIcon, label: 'Cài đặt', href: '/employer/settings' },
    { icon: QuestionMarkCircleIcon, label: 'Trợ giúp', href: '/employer/help' }
  ];

  // Check authorization
  if (!user || user.role !== 'EMPLOYER') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Không có quyền truy cập</h1>
          <p className="text-gray-600">Bạn không có quyền truy cập trang này.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin công việc...</p>
        </div>
      </div>
    );
  }

  if (!jobData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Không tìm thấy công việc</h1>
          <p className="text-gray-600 mb-4">Công việc không tồn tại hoặc bạn không có quyền chỉnh sửa.</p>
          <Link
            to="/employer/jobs"
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-sm border-r border-gray-200 fixed left-0 top-0 h-full">
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TC</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">TopCV</h1>
              <p className="text-sm text-gray-500">Employer</p>
            </div>
          </div>
        </div>

        <nav className="mt-6">
          <div className="px-6 space-y-1">
            {sidebarItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.active
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <img
              src={user?.avt || `https://via.placeholder.com/32x32?text=${user?.fullname?.charAt(0) || 'E'}`}
              alt="User Avatar"
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.fullname || 'Nhà tuyển dụng'}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1 text-red-400 hover:text-red-600 transition-colors"
              title="Đăng xuất"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link
                  to="/employer/jobs"
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-50"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  <span>Quay lại danh sách</span>
                </Link>
                <div className="h-6 w-px bg-gray-300"></div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa tin tuyển dụng</h1>
                  <p className="text-gray-600 mt-1">Cập nhật thông tin chi tiết cho tin tuyển dụng</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                  jobData.status === 'ACTIVE' ? 'bg-green-100 text-green-800 border-green-200' :
                  jobData.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                  jobData.status === 'CLOSED' ? 'bg-red-100 text-red-800 border-red-200' :
                  'bg-gray-100 text-gray-800 border-gray-200'
                }`}>
                  {jobData.status === 'ACTIVE' ? 'Đã đăng' :
                   jobData.status === 'PENDING' ? 'Chờ duyệt' :
                   jobData.status === 'CLOSED' ? 'Đã đóng' :
                   jobData.status}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Form Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* General Error Message */}
              {errors.find(e => e.field === 'general') && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <XMarkIcon className="h-5 w-5 text-red-400 mr-2" />
                    <span className="text-red-800 text-sm">
                      {errors.find(e => e.field === 'general')?.message}
                    </span>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-green-400 mr-2" />
                    <span className="text-green-800 text-sm">{success}</span>
                  </div>
                </div>
              )}

              {/* Basic Information */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BriefcaseIcon className="h-5 w-5 mr-2 text-emerald-600" />
                  Thông tin cơ bản
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Job Title */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tiêu đề công việc *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                        errors.find(e => e.field === 'title') ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Ví dụ: Senior Frontend Developer"
                    />
                    {errors.find(e => e.field === 'title') && (
                      <p className="text-red-600 text-sm mt-1">{errors.find(e => e.field === 'title')?.message}</p>
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPinIcon className="h-4 w-4 inline mr-1" />
                      Địa điểm làm việc *
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                        errors.find(e => e.field === 'location') ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Ví dụ: Hà Nội, Hồ Chí Minh"
                    />
                    {errors.find(e => e.field === 'location') && (
                      <p className="text-red-600 text-sm mt-1">{errors.find(e => e.field === 'location')?.message}</p>
                    )}
                  </div>

                  {/* Salary */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <BanknotesIcon className="h-4 w-4 inline mr-1" />
                      Mức lương *
                    </label>
                    <input
                      type="text"
                      value={formData.salary}
                      onChange={(e) => handleInputChange('salary', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                        errors.find(e => e.field === 'salary') ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Ví dụ: 15-25 triệu VND"
                    />
                    {errors.find(e => e.field === 'salary') && (
                      <p className="text-red-600 text-sm mt-1">{errors.find(e => e.field === 'salary')?.message}</p>
                    )}
                  </div>

                  {/* Working Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <ClockIcon className="h-4 w-4 inline mr-1" />
                      Thời gian làm việc
                    </label>
                    <input
                      type="text"
                      value={formData.workingTime}
                      onChange={(e) => handleInputChange('workingTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      placeholder="Ví dụ: Thứ 2 - Thứ 6, 8:00 - 17:00"
                    />
                  </div>

                  {/* Experience Required */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <AcademicCapIcon className="h-4 w-4 inline mr-1" />
                      Kinh nghiệm yêu cầu
                    </label>
                    <input
                      type="text"
                      value={formData.experienceRequired}
                      onChange={(e) => handleInputChange('experienceRequired', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      placeholder="Ví dụ: 2-3 năm kinh nghiệm"
                    />
                  </div>

                  {/* Deadline */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <CalendarIcon className="h-4 w-4 inline mr-1" />
                      Hạn nộp hồ sơ *
                    </label>
                    <input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => handleInputChange('deadline', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                        errors.find(e => e.field === 'deadline') ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.find(e => e.field === 'deadline') && (
                      <p className="text-red-600 text-sm mt-1">{errors.find(e => e.field === 'deadline')?.message}</p>
                    )}
                  </div>

                  {/* Hiring Quota */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số lượng tuyển dụng *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.hiringQuota}
                      onChange={(e) => handleInputChange('hiringQuota', parseInt(e.target.value) || 1)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                        errors.find(e => e.field === 'hiringQuota') ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.find(e => e.field === 'hiringQuota') && (
                      <p className="text-red-600 text-sm mt-1">{errors.find(e => e.field === 'hiringQuota')?.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Job Classification */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TagIcon className="h-5 w-5 mr-2 text-emerald-600" />
                  Phân loại công việc
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Job Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loại công việc
                    </label>
                    <select
                      value={formData.jobTypeId}
                      onChange={(e) => handleInputChange('jobTypeId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    >
                      <option value="">Chọn loại công việc</option>
                      {jobTypes.map(type => (
                        <option key={type.id} value={type.id.toString()}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Job Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cấp độ công việc
                    </label>
                    <select
                      value={formData.jobLevelId}
                      onChange={(e) => handleInputChange('jobLevelId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    >
                      <option value="">Chọn cấp độ</option>
                      {jobLevels.map(level => (
                        <option key={level.id} value={level.id.toString()}>
                          {level.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Skills */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kỹ năng yêu cầu
                  </label>
                  
                  {/* Selected Skills */}
                  {selectedSkills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {selectedSkills.map(skill => (
                        <span
                          key={skill.id}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-800"
                        >
                          {skill.name}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill.id)}
                            className="ml-2 text-emerald-600 hover:text-emerald-800"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Skill Selector */}
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleSkillSelect(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  >
                    <option value="">Chọn kỹ năng để thêm</option>
                    {skills
                      .filter(skill => !selectedSkills.find(s => s.id === skill.id))
                      .map(skill => (
                        <option key={skill.id} value={skill.id.toString()}>
                          {skill.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Job Description */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Mô tả chi tiết
                </h2>
                
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mô tả công việc
                    </label>
                    <textarea
                      rows={6}
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
                      placeholder="Mô tả chi tiết về công việc, trách nhiệm và nhiệm vụ..."
                    />
                  </div>

                  {/* Requirements */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yêu cầu công việc
                    </label>
                    <textarea
                      rows={6}
                      value={formData.requirements}
                      onChange={(e) => handleInputChange('requirements', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
                      placeholder="Yêu cầu về kỹ năng, kinh nghiệm, bằng cấp..."
                    />
                  </div>

                  {/* Benefits */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phúc lợi
                    </label>
                    <textarea
                      rows={4}
                      value={formData.benefits}
                      onChange={(e) => handleInputChange('benefits', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
                      placeholder="Các phúc lợi và quyền lợi cho nhân viên..."
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end space-x-4 pt-6">
                <Link
                  to="/employer/jobs"
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </Link>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {submitLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Đang cập nhật...</span>
                    </>
                  ) : (
                    <>
                      <CheckIcon className="h-4 w-4" />
                      <span>Cập nhật tin tuyển dụng</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditJobPage; 
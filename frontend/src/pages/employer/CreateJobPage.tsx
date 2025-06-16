import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  PlusIcon,
  CalendarIcon,
  MapPinIcon,
  BanknotesIcon,
  AcademicCapIcon,
  TagIcon,
  ClockIcon,
  ChevronDownIcon
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
import { jobPostApi, type JobPostCreationRequest } from '../../services/api/jobPostApi';

interface FormData extends Omit<JobPostCreationRequest, 'jobTypeId' | 'jobLevelId' | 'skillIds'> {
  jobTypeId: string;
  jobLevelId: string;
  skillIds: string[];
}

interface FieldError {
  field: string;
  message: string;
}

const CreateJobPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

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
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [jobTypesRes, jobLevelsRes, skillsRes] = await Promise.all([
        jobTypeApi.getAllJobTypes(),
        jobLevelApi.getAllJobLevels(),
        skillApi.getAllSkills()
      ]);

      setJobTypes(jobTypesRes.result);
      setJobLevels(jobLevelsRes.result);
      setSkills(skillsRes.result);
    } catch (error: any) {
      console.error('Error loading data:', error);
      setErrors([{ field: 'general', message: 'Không thể tải dữ liệu. Vui lòng thử lại.' }]);
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

    if (!formData.title.trim()) newErrors.push({ field: 'title', message: 'Tiêu đề công việc là bắt buộc' });
    if (!formData.description.trim()) newErrors.push({ field: 'description', message: 'Mô tả công việc là bắt buộc' });
    if (!formData.requirements.trim()) newErrors.push({ field: 'requirements', message: 'Yêu cầu công việc là bắt buộc' });
    if (!formData.benefits.trim()) newErrors.push({ field: 'benefits', message: 'Phúc lợi là bắt buộc' });
    if (!formData.location.trim()) newErrors.push({ field: 'location', message: 'Địa điểm làm việc là bắt buộc' });
    if (!formData.workingTime.trim()) newErrors.push({ field: 'workingTime', message: 'Thời gian làm việc là bắt buộc' });
    if (!formData.salary.trim()) newErrors.push({ field: 'salary', message: 'Mức lương là bắt buộc' });
    if (!formData.experienceRequired.trim()) newErrors.push({ field: 'experienceRequired', message: 'Kinh nghiệm yêu cầu là bắt buộc' });
    if (!formData.deadline) newErrors.push({ field: 'deadline', message: 'Hạn nộp hồ sơ là bắt buộc' });
    if (formData.hiringQuota < 1) newErrors.push({ field: 'hiringQuota', message: 'Số lượng tuyển dụng phải lớn hơn 0' });
    if (!formData.jobTypeId) newErrors.push({ field: 'jobTypeId', message: 'Loại công việc là bắt buộc' });
    if (!formData.jobLevelId) newErrors.push({ field: 'jobLevelId', message: 'Cấp độ công việc là bắt buộc' });

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

    setSubmitLoading(true);
    setErrors([]);
    setSuccess('');
    
    try {
      const requestData: JobPostCreationRequest = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        requirements: formData.requirements.trim(),
        benefits: formData.benefits.trim(),
        location: formData.location.trim(),
        workingTime: formData.workingTime.trim(),
        salary: formData.salary.trim(),
        experienceRequired: formData.experienceRequired.trim(),
        deadline: formData.deadline,
        hiringQuota: formData.hiringQuota,
        jobTypeId: parseInt(formData.jobTypeId),
        jobLevelId: parseInt(formData.jobLevelId),
        skillIds: formData.skillIds.length > 0 ? formData.skillIds.map(id => parseInt(id)) : undefined
      };

      console.log('Creating job post with data:', requestData);
      
      const response = await jobPostApi.createJobPost(requestData);
      console.log('Job post created successfully:', response);

      setSuccess('Tạo tin tuyển dụng thành công!');
      
      // Redirect sau 2 giây
      setTimeout(() => {
        navigate('/employer/jobs');
      }, 2000);
      
    } catch (error: any) {
      console.error('Error creating job post:', error);
      console.error('Error response:', error.response?.data);
      
      let errorMessage = 'Có lỗi xảy ra khi tạo tin tuyển dụng';
      
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
    { icon: HomeIcon, label: 'Tổng quan', active: false, href: '/employer/dashboard' },
    { icon: BriefcaseIcon, label: 'Tin nhắn', href: '/employer/messages' },
    { icon: BuildingOfficeIcon, label: 'Hồ sơ công ty', href: '/employer/company' },
    { icon: UserGroupIcon, label: 'Tất cả ứng viên', href: '/employer/candidates' },
    { icon: BriefcaseIcon, label: 'Danh sách công việc', active: true, href: '/employer/jobs' },
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
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
              <a
                key={index}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.active
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-medium text-sm">
                {user?.fullname?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.fullname || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
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
          <div className="px-6 py-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              {/* Company Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm text-gray-600">Company</span>
                  <span className="text-orange-600 font-medium">VNG</span>
                  <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                </button>
              </div>

              {/* Header Actions */}
              <div className="flex items-center space-x-4">
                <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
                  Đăng việc làm
                </button>
              </div>
            </div>
          </div>

          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tạo tin tuyển dụng mới</h1>
                <p className="text-gray-600 mt-1">Điền thông tin chi tiết để đăng tin tuyển dụng</p>
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
                    <p className="text-red-800">{errors.find(e => e.field === 'general')?.message}</p>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-green-400 mr-2" />
                    <p className="text-green-800">{success}</p>
                  </div>
                </div>
              )}

              {/* Basic Information */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <BriefcaseIcon className="h-5 w-5 text-emerald-600 mr-2" />
                  Thông tin cơ bản
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tiêu đề công việc <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.find(e => e.field === 'title') ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="VD: Senior Frontend Developer"
                    />
                    {errors.find(e => e.field === 'title') && <p className="text-red-500 text-sm mt-1">{errors.find(e => e.field === 'title')?.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loại công việc <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.jobTypeId}
                      onChange={(e) => handleInputChange('jobTypeId', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.find(e => e.field === 'jobTypeId') ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Chọn loại công việc</option>
                      {jobTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                    {errors.find(e => e.field === 'jobTypeId') && <p className="text-red-500 text-sm mt-1">{errors.find(e => e.field === 'jobTypeId')?.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cấp độ công việc <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.jobLevelId}
                      onChange={(e) => handleInputChange('jobLevelId', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.find(e => e.field === 'jobLevelId') ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Chọn cấp độ</option>
                      {jobLevels.map(level => (
                        <option key={level.id} value={level.id}>{level.name}</option>
                      ))}
                    </select>
                    {errors.find(e => e.field === 'jobLevelId') && <p className="text-red-500 text-sm mt-1">{errors.find(e => e.field === 'jobLevelId')?.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPinIcon className="h-4 w-4 inline mr-1" />
                      Địa điểm làm việc <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.find(e => e.field === 'location') ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="VD: Hà Nội, Hồ Chí Minh"
                    />
                    {errors.find(e => e.field === 'location') && <p className="text-red-500 text-sm mt-1">{errors.find(e => e.field === 'location')?.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <BanknotesIcon className="h-4 w-4 inline mr-1" />
                      Mức lương <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.salary}
                      onChange={(e) => handleInputChange('salary', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.find(e => e.field === 'salary') ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="VD: 15-25 triệu VNĐ"
                    />
                    {errors.find(e => e.field === 'salary') && <p className="text-red-500 text-sm mt-1">{errors.find(e => e.field === 'salary')?.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <ClockIcon className="h-4 w-4 inline mr-1" />
                      Thời gian làm việc <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.workingTime}
                      onChange={(e) => handleInputChange('workingTime', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.find(e => e.field === 'workingTime') ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="VD: 8:00 - 17:00, Thứ 2 - Thứ 6"
                    />
                    {errors.find(e => e.field === 'workingTime') && <p className="text-red-500 text-sm mt-1">{errors.find(e => e.field === 'workingTime')?.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <AcademicCapIcon className="h-4 w-4 inline mr-1" />
                      Kinh nghiệm yêu cầu <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.experienceRequired}
                      onChange={(e) => handleInputChange('experienceRequired', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.find(e => e.field === 'experienceRequired') ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="VD: 2-3 năm kinh nghiệm"
                    />
                    {errors.find(e => e.field === 'experienceRequired') && <p className="text-red-500 text-sm mt-1">{errors.find(e => e.field === 'experienceRequired')?.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <CalendarIcon className="h-4 w-4 inline mr-1" />
                      Hạn nộp hồ sơ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => handleInputChange('deadline', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.find(e => e.field === 'deadline') ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.find(e => e.field === 'deadline') && <p className="text-red-500 text-sm mt-1">{errors.find(e => e.field === 'deadline')?.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <UserGroupIcon className="h-4 w-4 inline mr-1" />
                      Số lượng tuyển dụng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.hiringQuota}
                      onChange={(e) => handleInputChange('hiringQuota', parseInt(e.target.value) || 1)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.find(e => e.field === 'hiringQuota') ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.find(e => e.field === 'hiringQuota') && <p className="text-red-500 text-sm mt-1">{errors.find(e => e.field === 'hiringQuota')?.message}</p>}
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <TagIcon className="h-5 w-5 text-emerald-600 mr-2" />
                  Kỹ năng yêu cầu
                </h3>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn kỹ năng
                  </label>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleSkillSelect(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Chọn kỹ năng...</option>
                    {skills
                      .filter(skill => !selectedSkills.find(s => s.id === skill.id))
                      .map(skill => (
                        <option key={skill.id} value={skill.id}>{skill.name}</option>
                      ))}
                  </select>
                </div>

                {/* Selected Skills */}
                {selectedSkills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedSkills.map(skill => (
                      <span
                        key={skill.id}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800"
                      >
                        {skill.name}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill.id)}
                          className="ml-2 text-emerald-600 hover:text-emerald-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Detailed Information */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Thông tin chi tiết</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mô tả công việc <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={6}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.find(e => e.field === 'description') ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Mô tả chi tiết về công việc, trách nhiệm, nhiệm vụ..."
                    />
                    {errors.find(e => e.field === 'description') && <p className="text-red-500 text-sm mt-1">{errors.find(e => e.field === 'description')?.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yêu cầu công việc <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.requirements}
                      onChange={(e) => handleInputChange('requirements', e.target.value)}
                      rows={6}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.find(e => e.field === 'requirements') ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Các yêu cầu về kỹ năng, kinh nghiệm, bằng cấp..."
                    />
                    {errors.find(e => e.field === 'requirements') && <p className="text-red-500 text-sm mt-1">{errors.find(e => e.field === 'requirements')?.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phúc lợi <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.benefits}
                      onChange={(e) => handleInputChange('benefits', e.target.value)}
                      rows={6}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.find(e => e.field === 'benefits') ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Các phúc lợi, quyền lợi cho nhân viên..."
                    />
                    {errors.find(e => e.field === 'benefits') && <p className="text-red-500 text-sm mt-1">{errors.find(e => e.field === 'benefits')?.message}</p>}
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/employer/jobs')}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {submitLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang tạo...
                    </>
                  ) : (
                    <>
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Tạo tin tuyển dụng
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

export default CreateJobPage; 
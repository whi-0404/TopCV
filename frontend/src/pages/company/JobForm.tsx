import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import jobService, { 
  JobType, 
  JobLevel, 
  Skill, 
  JobPost, 
  JobPostCreationRequest, 
  JobPostUpdateRequest 
} from '../../services/jobService';
import companyService from '../../services/companyService';

const JobForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  
  // Form state
  const [formData, setFormData] = useState<JobPostCreationRequest | JobPostUpdateRequest>({
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
    jobTypeId: 0,
    jobLevelId: 0,
    skillIds: []
  });
  
  // Options for select fields
  const [jobTypes, setJobTypes] = useState<JobType[]>([]);
  const [jobLevels, setJobLevels] = useState<JobLevel[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  
  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [hasCompany, setHasCompany] = useState(true);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Kiểm tra xem người dùng đã có công ty chưa
        try {
          await companyService.getMyCompany();
          setHasCompany(true);
        } catch (err: any) {
          console.error('Không tìm thấy thông tin công ty:', err);
          setHasCompany(false);
          setError('Bạn cần tạo hồ sơ công ty trước khi đăng tin tuyển dụng');
          return;
        }
        
        // Load options data
        const [typesData, levelsData, skillsData] = await Promise.all([
          jobService.getJobTypes(),
          jobService.getJobLevels(),
          jobService.getSkills()
        ]);
        
        setJobTypes(typesData);
        setJobLevels(levelsData);
        setSkills(skillsData);
        
        // If edit mode, load job data
        if (isEditMode && id) {
          const jobData = await jobService.getJobById(parseInt(id));
          
          setFormData({
            title: jobData.title,
            description: jobData.description || '',
            requirements: jobData.requirements || '',
            benefits: jobData.benefits || '',
            location: jobData.location || '',
            workingTime: jobData.workingTime || '',
            salary: jobData.salary || '',
            experienceRequired: jobData.experienceRequired || '',
            deadline: jobData.deadline || '',
            hiringQuota: jobData.hiringQuota || 1,
            jobTypeId: jobData.jobType?.id || 0,
            jobLevelId: jobData.jobLevel?.id || 0,
            skillIds: jobData.skills?.map(skill => skill.id) || []
          });
        }
      } catch (err: any) {
        console.error('Lỗi khi tải dữ liệu:', err);
        setError(err.message || 'Không thể tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [id, isEditMode]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'hiringQuota' ? parseInt(value) : value
    }));
  };
  
  const handleSkillChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value));
    setFormData(prev => ({
      ...prev,
      skillIds: selectedOptions
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hasCompany) {
      navigate('/company/profile');
      return;
    }
    
    try {
      setIsSaving(true);
      setError('');
      setSuccess('');
      
      if (isEditMode && id) {
        await jobService.updateJobPost(parseInt(id), formData as JobPostUpdateRequest);
        setSuccess('Cập nhật tin tuyển dụng thành công!');
      } else {
        const requiredFields = ['title', 'deadline', 'hiringQuota', 'jobTypeId', 'jobLevelId'];
        const missingFields = requiredFields.filter(field => !formData[field as keyof JobPostCreationRequest]);
        
        if (missingFields.length > 0) {
          setError(`Vui lòng điền đầy đủ thông tin: ${missingFields.join(', ')}`);
          return;
        }
        
        await jobService.createJobPost(formData as JobPostCreationRequest);
        setSuccess('Đăng tin tuyển dụng thành công!');
        
        // Reset form after successful creation
        if (!isEditMode) {
          setFormData({
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
            jobTypeId: 0,
            jobLevelId: 0,
            skillIds: []
          });
        }
      }
      
      // Navigate back to jobs list after short delay
      setTimeout(() => {
        navigate('/company/jobs');
      }, 2000);
    } catch (err: any) {
      console.error('Lỗi khi lưu tin tuyển dụng:', err);
      setError(err.message || 'Không thể lưu tin tuyển dụng. Vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
      </div>
    );
  }
  
  if (!hasCompany) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Chưa có thông tin công ty</h3>
          <p className="mt-1 text-sm text-gray-500">
            Bạn cần tạo hồ sơ công ty trước khi đăng tin tuyển dụng.
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/company/profile')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Tạo hồ sơ công ty
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          {isEditMode ? 'Chỉnh sửa tin tuyển dụng' : 'Đăng tin tuyển dụng mới'}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {isEditMode 
            ? 'Cập nhật thông tin tin tuyển dụng của bạn' 
            : 'Điền đầy đủ thông tin để đăng tin tuyển dụng mới'}
        </p>
      </div>
      
      {error && (
        <div className="m-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}
      
      {success && (
        <div className="m-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-green-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-green-800">{success}</p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Tiêu đề */}
          <div className="col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Ví dụ: Senior Frontend Developer"
              required
            />
          </div>
          
          {/* Mô tả */}
          <div className="col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Mô tả công việc
            </label>
            <textarea
              name="description"
              id="description"
              rows={5}
              value={formData.description}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Mô tả chi tiết về công việc, trách nhiệm, nhiệm vụ..."
            />
          </div>
          
          {/* Yêu cầu */}
          <div className="col-span-2">
            <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">
              Yêu cầu công việc
            </label>
            <textarea
              name="requirements"
              id="requirements"
              rows={4}
              value={formData.requirements}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Các yêu cầu về kỹ năng, kinh nghiệm, bằng cấp..."
            />
          </div>
          
          {/* Quyền lợi */}
          <div className="col-span-2">
            <label htmlFor="benefits" className="block text-sm font-medium text-gray-700">
              Quyền lợi
            </label>
            <textarea
              name="benefits"
              id="benefits"
              rows={4}
              value={formData.benefits}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Các quyền lợi, phúc lợi dành cho nhân viên..."
            />
          </div>
          
          {/* Địa điểm */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Địa điểm làm việc
            </label>
            <input
              type="text"
              name="location"
              id="location"
              value={formData.location}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Ví dụ: TP.HCM, Hà Nội..."
            />
          </div>
          
          {/* Thời gian làm việc */}
          <div>
            <label htmlFor="workingTime" className="block text-sm font-medium text-gray-700">
              Thời gian làm việc
            </label>
            <input
              type="text"
              name="workingTime"
              id="workingTime"
              value={formData.workingTime}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Ví dụ: Thứ 2-6, 9AM-6PM"
            />
          </div>
          
          {/* Mức lương */}
          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
              Mức lương
            </label>
            <input
              type="text"
              name="salary"
              id="salary"
              value={formData.salary}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Ví dụ: 15-25 triệu VND, Thỏa thuận..."
            />
          </div>
          
          {/* Yêu cầu kinh nghiệm */}
          <div>
            <label htmlFor="experienceRequired" className="block text-sm font-medium text-gray-700">
              Yêu cầu kinh nghiệm
            </label>
            <input
              type="text"
              name="experienceRequired"
              id="experienceRequired"
              value={formData.experienceRequired}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Ví dụ: 2+ năm, Không yêu cầu..."
            />
          </div>
          
          {/* Hạn nộp hồ sơ */}
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
              Hạn nộp hồ sơ <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="deadline"
              id="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          
          {/* Số lượng cần tuyển */}
          <div>
            <label htmlFor="hiringQuota" className="block text-sm font-medium text-gray-700">
              Số lượng cần tuyển <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="hiringQuota"
              id="hiringQuota"
              min="1"
              value={formData.hiringQuota}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          
          {/* Loại công việc */}
          <div>
            <label htmlFor="jobTypeId" className="block text-sm font-medium text-gray-700">
              Loại công việc <span className="text-red-500">*</span>
            </label>
            <select
              name="jobTypeId"
              id="jobTypeId"
              value={formData.jobTypeId}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">-- Chọn loại công việc --</option>
              {jobTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Cấp bậc */}
          <div>
            <label htmlFor="jobLevelId" className="block text-sm font-medium text-gray-700">
              Cấp bậc <span className="text-red-500">*</span>
            </label>
            <select
              name="jobLevelId"
              id="jobLevelId"
              value={formData.jobLevelId}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">-- Chọn cấp bậc --</option>
              {jobLevels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Kỹ năng */}
          <div className="col-span-2">
            <label htmlFor="skillIds" className="block text-sm font-medium text-gray-700">
              Kỹ năng yêu cầu
            </label>
            <select
              name="skillIds"
              id="skillIds"
              multiple
              value={(formData.skillIds || []).map(id => id.toString())}
              onChange={handleSkillChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              size={5}
            >
              {skills.map((skill) => (
                <option key={skill.id} value={skill.id}>
                  {skill.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">Giữ Ctrl để chọn nhiều kỹ năng</p>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/company/jobs')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 ${
              isSaving ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Đang lưu...
              </>
            ) : (
              isEditMode ? 'Cập nhật' : 'Đăng tin'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobForm;
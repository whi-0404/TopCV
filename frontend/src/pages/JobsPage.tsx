import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { 
  jobPostApi, 
  type JobPostDashboardResponse, 
  type JobPostSearchRequest,
  type PageResponse 
} from '../services/api/jobPostApi';
import { 
  jobTypeApi, 
  jobLevelApi, 
  skillApi,
  type JobTypeResponse,
  type JobLevelResponse,
  type SkillResponse
} from '../services/api/jobTypeLevelApi';

const JobsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedFilters, setExpandedFilters] = useState({
    jobType: true,
    category: true,
    experience: true
  });
  
  // API Data States
  const [jobs, setJobs] = useState<JobPostDashboardResponse[]>([]);
  const [jobTypes, setJobTypes] = useState<JobTypeResponse[]>([]);
  const [jobLevels, setJobLevels] = useState<JobLevelResponse[]>([]);
  const [skills, setSkills] = useState<SkillResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  
  // Filter states
  const [selectedJobTypes, setSelectedJobTypes] = useState<number[]>([]);
  const [selectedJobLevels, setSelectedJobLevels] = useState<number[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  
  const jobsPerPage = 10;

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Search jobs when filters change
  useEffect(() => {
    searchJobs();
  }, [
    searchTerm, 
    selectedLocation, 
    selectedJobTypes, 
    selectedJobLevels, 
    selectedSkills, 
    sortBy,
    sortDirection,
    currentPage
  ]);

  const loadInitialData = async () => {
    try {
      const [jobTypesRes, jobLevelsRes, skillsRes] = await Promise.all([
        jobTypeApi.getAllJobTypes(),
        jobLevelApi.getAllJobLevels(),
        skillApi.getAllSkills()
      ]);
      
      if (jobTypesRes.code === 1000) setJobTypes(jobTypesRes.result);
      if (jobLevelsRes.code === 1000) setJobLevels(jobLevelsRes.result);
      if (skillsRes.code === 1000) setSkills(skillsRes.result);
    } catch (error) {
      console.error('Error loading initial data:', error);
      setError('Không thể tải dữ liệu ban đầu');
    }
  };

  const searchJobs = async () => {
    setLoading(true);
    try {
      const searchRequest: JobPostSearchRequest = {
        keyword: searchTerm || undefined,
        location: selectedLocation || undefined,
        jobTypeIds: selectedJobTypes.length > 0 ? selectedJobTypes : undefined,
        jobLevelIds: selectedJobLevels.length > 0 ? selectedJobLevels : undefined,
        skillIds: selectedSkills.length > 0 ? selectedSkills : undefined,
        sortBy,
        sortDirection
      };

      const response = await jobPostApi.searchJobPosts({
        ...searchRequest,
        page: currentPage,
        size: jobsPerPage
      });

      if (response.code === 1000 && response.result) {
        const jobsData = response.result.data || [];
        setJobs(jobsData);
        setTotalPages(response.result.totalPages || 1);
        setTotalElements(response.result.totalElements || 0);
        setError('');
      } else {
        setError('Không thể tải danh sách công việc');
        setJobs([]);
      }
    } catch (error: any) {
      console.error('Error searching jobs:', error);
      
      // Try fallback for 400 errors (bad request) or when filters are active
      const hasActiveFiltersNow = selectedJobTypes.length > 0 || 
                                  selectedJobLevels.length > 0 || 
                                  selectedSkills.length > 0 || 
                                  searchTerm !== '' ||
                                  selectedLocation !== '';
      
      if (error.response?.status === 400 && hasActiveFiltersNow) {
        const fallbackSuccess = await loadBasicJobs();
        if (fallbackSuccess) {
          setError('Một số bộ lọc không khả dụng. Hiển thị kết quả cơ bản.');
          return;
        }
      }
      
      // More specific error messages
      let errorMessage = 'Không thể tải danh sách công việc';
      if (error.response?.status === 400) {
        errorMessage = 'Thông số tìm kiếm không hợp lệ. Vui lòng thử lại.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Lỗi server. Vui lòng thử lại sau.';
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Không thể kết nối tới server. Vui lòng kiểm tra kết nối mạng.';
      }
      
      setError(errorMessage);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Fallback function to load basic jobs without complex filters
  const loadBasicJobs = async () => {
    try {
      const response = await jobPostApi.searchJobPosts({
        page: currentPage,
        size: jobsPerPage,
        sortBy: 'createdAt',
        sortDirection: 'desc'
      });

      if (response.code === 1000 && response.result) {
        const jobsData = response.result.data || [];
        setJobs(jobsData);
        setTotalPages(response.result.totalPages || 1);
        setTotalElements(response.result.totalElements || 0);
        return true;
      }
    } catch (error) {
      console.error('Fallback failed:', error);
      return false;
    }
    return false;
  };

  const handleSearch = () => {
    setCurrentPage(1);
    searchJobs();
  };

  const toggleFilter = (filterName: keyof typeof expandedFilters) => {
    setExpandedFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  const clearAllFilters = () => {
    setSelectedJobTypes([]);
    setSelectedJobLevels([]);
    setSelectedSkills([]);
    setSearchTerm('');
    setSelectedLocation('');
    setCurrentPage(1);
  };

  const hasActiveFilters = () => {
    return selectedJobTypes.length > 0 || 
           selectedJobLevels.length > 0 || 
           selectedSkills.length > 0 || 
           searchTerm !== '' ||
           selectedLocation !== '';
  };

  const handleJobTypeChange = (jobTypeId: number, checked: boolean) => {
    setSelectedJobTypes(prev => 
      checked 
        ? [...prev, jobTypeId]
        : prev.filter(id => id !== jobTypeId)
    );
    setCurrentPage(1);
  };

  const handleJobLevelChange = (jobLevelId: number, checked: boolean) => {
    setSelectedJobLevels(prev => 
      checked 
        ? [...prev, jobLevelId]
        : prev.filter(id => id !== jobLevelId)
    );
    setCurrentPage(1);
  };

  const handleSkillChange = (skillId: number, checked: boolean) => {
    setSelectedSkills(prev => 
      checked 
        ? [...prev, skillId]
        : prev.filter(id => id !== skillId)
    );
    setCurrentPage(1);
  };

  const handleApplyClick = (job: JobPostDashboardResponse) => {
    if (!user) {
      // Redirect to login if not authenticated
      navigate('/auth/user/login', { 
        state: { from: `/jobs/${job.id}` } 
      });
      return;
    }

    if (user.role !== 'USER') {
      alert('Chỉ ứng viên mới có thể ứng tuyển việc làm');
      return;
    }

    // Navigate to job detail page where they can apply
    navigate(`/jobs/${job.id}`);
  };

  const FilterSection: React.FC<{ title: string; filterKey: keyof typeof expandedFilters; children: React.ReactNode }> = 
    ({ title, filterKey, children }) => (
    <div className="border-b border-gray-200 pb-4 mb-4">
      <button
        onClick={() => toggleFilter(filterKey)}
        className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
      >
        {title}
        {expandedFilters[filterKey] ? 
          <ChevronUpIcon className="h-4 w-4" /> : 
          <ChevronDownIcon className="h-4 w-4" />
        }
      </button>
      {expandedFilters[filterKey] && children}
    </div>
  );

  const JobCard: React.FC<{ job: JobPostDashboardResponse }> = ({ job }) => {
    // Helper functions to format data properly
    const formatSalary = (salary?: string | null) => {
      if (!salary || salary.trim() === '' || salary.toLowerCase() === 'null' || salary.toLowerCase() === 'undefined') {
        return 'Thỏa thuận';
      }
      
      // Try to format Vietnamese currency if it's a number
      if (!isNaN(Number(salary))) {
        const amount = Number(salary);
        if (amount >= 1000000) {
          return `${(amount / 1000000).toFixed(0)} triệu VNĐ`;
        } else if (amount >= 1000) {
          return `${(amount / 1000).toFixed(0)}K VNĐ`;
        } else {
          return `${amount.toLocaleString('vi-VN')} VNĐ`;
        }
      }
      
      // Return as is if it's already formatted string
      return salary;
    };

    const formatAppliedCount = (count?: number | null) => {
      if (count === undefined || count === null || count < 0) {
        return '0 ứng viên';
      }
      return `${count} ứng viên`;
    };

    const formatDeadline = (deadline?: string | null) => {
      if (!deadline || deadline.trim() === '') {
        return 'Hạn: Không xác định';
      }
      try {
        // Handle LocalDate format from backend (yyyy-mm-dd)
        let date: Date;
        
        // Backend returns LocalDate as "yyyy-mm-dd" string
        if (deadline.includes('-') && deadline.length === 10) {
          date = new Date(deadline + 'T00:00:00');
        } else {
          date = new Date(deadline);
        }
        
        if (isNaN(date.getTime())) {
          return 'Hạn: Không xác định';
        }
        
        // Calculate days remaining
        const now = new Date();
        const diffTime = date.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
          return 'Hạn: Đã hết hạn';
        } else if (diffDays === 0) {
          return 'Hạn: Hôm nay';
        } else if (diffDays === 1) {
          return 'Hạn: Ngày mai';
        } else if (diffDays <= 7) {
          return `Hạn: ${diffDays} ngày nữa`;
        } else {
          return `Hạn: ${date.toLocaleDateString('vi-VN')}`;
        }
      } catch (error) {
        return 'Hạn: Không xác định';
      }
    };

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4 flex-1">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                <Link 
                  to={`/jobs/${job.id}`}
                  className="hover:text-emerald-600 transition-colors"
                >
                  {job.title}
                </Link>
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {job.companyName || 'Công ty'} • {job.location || 'Địa điểm chưa xác định'}
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {job.type && (
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
                    {job.type.name}
                  </span>
                )}
                {job.level && (
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                    {job.level.name}
                  </span>
                )}
                {job.experienceLevel && (
                  <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                    {job.experienceLevel}
                  </span>
                )}
              </div>
              <div className="flex items-center text-sm text-gray-500 flex-wrap gap-4">
                <div className="flex items-center">
                  <CurrencyDollarIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span>{formatSalary(job.salary)}</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span>{formatAppliedCount(job.appliedCount)}</span>
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span>{formatDeadline(job.deadline)}</span>
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={() => handleApplyClick(job)}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex-shrink-0 flex items-center space-x-2"
          >
            <PaperAirplaneIcon className="h-4 w-4" />
            <span>Ứng tuyển</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Tìm kiếm <span className="text-emerald-600">Công việc mơ ước</span>
              </h1>
              <p className="text-lg text-gray-600">
                Tìm các công việc mà bạn mong muốn làm việc
              </p>
            </div>
            
            <div className="flex gap-4 max-w-4xl mx-auto">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Vị trí tuyển dụng, tên công ty"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>
              <div className="relative">
                <MapPinIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Địa điểm"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none min-w-[200px]"
                />
              </div>
              <button 
                onClick={handleSearch}
                className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
              >
                Tìm kiếm
              </button>
            </div>
            
            <div className="mt-4 text-center text-sm text-gray-500">
              Phổ biến: React, Node.js, Python, Java, Frontend, Backend
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div className="flex gap-8">
            <div className="w-64 flex-shrink-0">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Bộ lọc</h3>
                  {hasActiveFilters() && (
                    <button
                      onClick={clearAllFilters}
                      className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      Xóa tất cả
                    </button>
                  )}
                </div>
                
                {/* Active Filters Summary */}
                {hasActiveFilters() && (
                  <div className="mb-4 p-3 bg-emerald-50 rounded-lg">
                    <div className="text-xs text-emerald-700 font-medium mb-2">Đang áp dụng:</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedJobTypes.length > 0 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-700">
                          {selectedJobTypes.length} loại CV
                        </span>
                      )}
                      {selectedJobLevels.length > 0 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                          {selectedJobLevels.length} cấp độ
                        </span>
                      )}
                      {selectedSkills.length > 0 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700">
                          {selectedSkills.length} kỹ năng
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                <FilterSection title="Loại công việc" filterKey="jobType">
                  <div className="space-y-2">
                    {jobTypes.map((type) => (
                      <label key={type.id} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                        <input 
                          type="checkbox" 
                          checked={selectedJobTypes.includes(type.id)}
                          onChange={(e) => handleJobTypeChange(type.id, e.target.checked)}
                          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" 
                        />
                        <span className="ml-2 text-sm text-gray-700">{type.name}</span>
                        {type.description && (
                          <span className="ml-1 text-xs text-gray-400">({type.description})</span>
                        )}
                      </label>
                    ))}
                  </div>
                </FilterSection>

                <FilterSection title="Cấp độ" filterKey="category">
                  <div className="space-y-2">
                    {jobLevels.map((level) => (
                      <label key={level.id} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                        <input 
                          type="checkbox" 
                          checked={selectedJobLevels.includes(level.id)}
                          onChange={(e) => handleJobLevelChange(level.id, e.target.checked)}
                          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" 
                        />
                        <span className="ml-2 text-sm text-gray-700">{level.name}</span>
                        {level.description && (
                          <span className="ml-1 text-xs text-gray-400">({level.description})</span>
                        )}
                      </label>
                    ))}
                  </div>
                </FilterSection>

                <FilterSection title="Kỹ năng" filterKey="experience">
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {skills.map((skill) => (
                      <label key={skill.id} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                        <input 
                          type="checkbox" 
                          checked={selectedSkills.includes(skill.id)}
                          onChange={(e) => handleSkillChange(skill.id, e.target.checked)}
                          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" 
                        />
                        <span className="ml-2 text-sm text-gray-700">{skill.name}</span>
                        {skill.description && (
                          <span className="ml-1 text-xs text-gray-400">({skill.description})</span>
                        )}
                      </label>
                    ))}
                  </div>
                </FilterSection>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Tất cả công việc</h2>
                  <p className="text-gray-600">Hiển thị {totalElements} kết quả</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Sắp xếp theo:</span>
                  <select 
                    value={`${sortBy}-${sortDirection}`}
                    onChange={(e) => {
                      const [newSortBy, newSortDirection] = e.target.value.split('-');
                      setSortBy(newSortBy);
                      setSortDirection(newSortDirection);
                      setCurrentPage(1);
                    }}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  >
                    <option value="createdAt-desc">Mới nhất</option>
                    <option value="createdAt-asc">Cũ nhất</option>
                    <option value="title-asc">Tên A-Z</option>
                    <option value="title-desc">Tên Z-A</option>
                    <option value="deadline-asc">Hạn nộp gần nhất</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Đang tải...</p>
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Không tìm thấy công việc nào phù hợp</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-8">
                    {jobs.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded-md font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                      >
                        <ChevronLeftIcon className="h-4 w-4" />
                      </button>
                      
                      {[...Array(Math.min(5, totalPages))].map((_, index) => {
                        const pageNum = index + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-1 rounded-md font-medium ${
                              currentPage === pageNum
                                ? 'bg-emerald-600 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded-md font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                      >
                        <ChevronRightIcon className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default JobsPage; 
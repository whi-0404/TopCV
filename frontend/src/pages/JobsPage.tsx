import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { Link } from 'react-router-dom';
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronRightIcon,
  ChevronLeftIcon
} from '@heroicons/react/24/outline';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedFilters, setExpandedFilters] = useState({
    jobType: true,
    category: true,
    experience: true,
    salary: true
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
  const [selectedSalaryRange, setSelectedSalaryRange] = useState('');
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
    selectedSalaryRange,
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
      
      setJobTypes(jobTypesRes.result);
      setJobLevels(jobLevelsRes.result);
      setSkills(skillsRes.result);
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
        salaryRange: selectedSalaryRange || undefined,
        sortBy,
        sortDirection
      };

      const response = await jobPostApi.searchJobPosts({
        ...searchRequest,
        page: currentPage,
        size: jobsPerPage
      });

      console.log('API Response:', response);
      console.log('Jobs data:', response.result.data);
      
      // Debug first job to see structure
      if (response.result.data && response.result.data.length > 0) {
        console.log('First job structure:', response.result.data[0]);
        console.log('First job salary:', response.result.data[0].salary);
        console.log('First job appliedCount:', response.result.data[0].appliedCount);
        console.log('First job deadline:', response.result.data[0].deadline);
      }

      // Ensure we have valid data
      const jobsData = response.result.data || [];
      console.log('Processing jobs:', jobsData.length, 'jobs');

      setJobs(jobsData);
      setTotalPages(response.result.totalPages || 1);
      setTotalElements(response.result.totalElements || 0);
      setError('');
    } catch (error: any) {
      console.error('Error searching jobs:', error);
      setError('Không thể tải danh sách công việc');
      setJobs([]);
    } finally {
      setLoading(false);
    }
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
        const date = new Date(deadline);
        if (isNaN(date.getTime())) {
          return 'Hạn: Không xác định';
        }
        return `Hạn: ${date.toLocaleDateString('vi-VN')}`;
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
          <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex-shrink-0">
            Ứng tuyển
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
                <h3 className="font-semibold text-gray-900 mb-4">Bộ lọc</h3>
                
                <FilterSection title="Loại công việc" filterKey="jobType">
                  <div className="space-y-2">
                    {jobTypes.map((type) => (
                      <label key={type.id} className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={selectedJobTypes.includes(type.id)}
                          onChange={(e) => handleJobTypeChange(type.id, e.target.checked)}
                          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" 
                        />
                        <span className="ml-2 text-sm text-gray-700">{type.name}</span>
                      </label>
                    ))}
                  </div>
                </FilterSection>

                <FilterSection title="Cấp độ" filterKey="category">
                  <div className="space-y-2">
                    {jobLevels.map((level) => (
                      <label key={level.id} className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={selectedJobLevels.includes(level.id)}
                          onChange={(e) => handleJobLevelChange(level.id, e.target.checked)}
                          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" 
                        />
                        <span className="ml-2 text-sm text-gray-700">{level.name}</span>
                      </label>
                    ))}
                  </div>
                </FilterSection>

                <FilterSection title="Kỹ năng" filterKey="experience">
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {skills.map((skill) => (
                      <label key={skill.id} className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={selectedSkills.includes(skill.id)}
                          onChange={(e) => handleSkillChange(skill.id, e.target.checked)}
                          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" 
                        />
                        <span className="ml-2 text-sm text-gray-700">{skill.name}</span>
                      </label>
                    ))}
                  </div>
                </FilterSection>

                <FilterSection title="Mức lương" filterKey="salary">
                  <div className="space-y-2">
                    {['Dưới 10 triệu', '10-20 triệu', '20-30 triệu', '30-50 triệu', 'Trên 50 triệu'].map((salary) => (
                      <label key={salary} className="flex items-center">
                        <input 
                          type="radio" 
                          name="salary"
                          value={salary}
                          checked={selectedSalaryRange === salary}
                          onChange={(e) => setSelectedSalaryRange(e.target.value)}
                          className="border-gray-300 text-emerald-600 focus:ring-emerald-500" 
                        />
                        <span className="ml-2 text-sm text-gray-700">{salary}</span>
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
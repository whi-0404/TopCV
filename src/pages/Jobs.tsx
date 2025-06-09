import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import jobService, { JobPost, JobType, JobLevel, JobSearchRequest } from '../services/jobService';

const Jobs = () => {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [jobTypes, setJobTypes] = useState<JobType[]>([]);
  const [jobLevels, setJobLevels] = useState<JobLevel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 12;

  const locations = ['all', 'TP.HCM', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng'];

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const [typesData, levelsData] = await Promise.all([
          jobService.getJobTypes(),
          jobService.getJobLevels()
        ]);
        
        setJobTypes(typesData);
        setJobLevels(levelsData);
        setError('');
      } catch (err: any) {
        console.error('Failed to load initial data:', err);
        setError('Không thể tải dữ liệu ban đầu. Vui lòng thử lại.');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Search jobs when filters change
  useEffect(() => {
    const searchJobs = async () => {
      try {
        setIsLoading(true);
        
        const searchParams: JobSearchRequest = {
          keyword: searchTerm || undefined,
          location: selectedLocation !== 'all' ? selectedLocation : undefined,
          jobTypeIds: selectedType !== 'all' ? [parseInt(selectedType)] : undefined,
          jobLevelIds: selectedLevel !== 'all' ? [parseInt(selectedLevel)] : undefined,
          sortBy: 'createdAt',
          sortDirection: 'desc'
        };

        const response = await jobService.searchJobs(searchParams, currentPage, pageSize);
        
        setJobs(response.Data);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
        setError('');
      } catch (err: any) {
        console.error('Failed to search jobs:', err);
        setError('Không thể tìm kiếm việc làm. Vui lòng thử lại.');
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    };

    searchJobs();
  }, [searchTerm, selectedLocation, selectedType, selectedLevel, currentPage]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleQuickSearch = (keyword: string) => {
    setSearchTerm(keyword);
    setCurrentPage(1);
  };

  const JobCard = ({ job, featured = false }: { job: JobPost; featured?: boolean }) => (
    <Link to={`/jobs/${job.id}`} className="block">
      <div className={`bg-white rounded-lg border p-6 hover:shadow-lg transition-all ${
        featured ? 'border-emerald-500 shadow-md' : 'border-gray-200 hover:border-emerald-500'
      }`}>
        {featured && (
          <div className="flex items-center mb-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              Nổi bật
            </span>
          </div>
        )}
        
        <div className="flex items-start gap-4">
          <img 
            src={jobService.getCompanyLogoUrl(job.company.logo)} 
            alt={job.company.name} 
            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 hover:text-emerald-600 transition-colors">
                {job.title}
              </h3>
              <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                {jobService.formatDate(job.createdAt)}
              </span>
            </div>
            
            <p className="text-gray-600 font-medium mb-2">{job.company.name}</p>
            
            {job.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {job.description.substring(0, 150)}...
              </p>
            )}
            
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {job.location || 'Không xác định'}
              </div>
              
              {job.jobType && (
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {job.jobType.name}
                </div>
              )}
              
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                {jobService.formatSalary(job.salary)}
              </div>
              
              {job.jobLevel && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  job.jobLevel.name.toLowerCase().includes('senior') ? 'bg-purple-100 text-purple-800' :
                  job.jobLevel.name.toLowerCase().includes('mid') ? 'bg-blue-100 text-blue-800' :
                  job.jobLevel.name.toLowerCase().includes('junior') || job.jobLevel.name.toLowerCase().includes('fresher') ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {job.jobLevel.name}
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap gap-1">
              {job.skills?.slice(0, 3).map((skill) => (
                <span 
                  key={skill.id} 
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                >
                  {skill.name}
                </span>
              ))}
              {job.skills && job.skills.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                  +{job.skills.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Có lỗi xảy ra</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tìm kiếm <span className="text-emerald-500">việc làm IT</span> mơ ước
          </h1>
          <p className="text-gray-600">Khám phá hàng nghìn cơ hội nghề nghiệp tại các công ty công nghệ hàng đầu</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <form onSubmit={handleSearchSubmit} className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Tìm kiếm theo vị trí, công ty, kỹ năng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg ${viewMode === 'list' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg ${viewMode === 'grid' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </form>

          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Địa điểm</label>
              <select
                value={selectedLocation}
                onChange={(e) => {
                  setSelectedLocation(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              >
                {locations.map(location => (
                  <option key={location} value={location}>
                    {location === 'all' ? 'Tất cả địa điểm' : location}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loại hình</label>
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              >
                <option value="all">Tất cả loại hình</option>
                {jobTypes.map(type => (
                  <option key={type.id} value={type.id.toString()}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cấp độ</label>
              <select
                value={selectedLevel}
                onChange={(e) => {
                  setSelectedLevel(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              >
                <option value="all">Tất cả cấp độ</option>
                {jobLevels.map(level => (
                  <option key={level.id} value={level.id.toString()}>
                    {level.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <span className="text-sm text-gray-500">Từ khóa phổ biến:</span>
            {['React', 'Node.js', 'Python', 'Java', 'DevOps'].map((keyword) => (
              <button
                key={keyword}
                onClick={() => handleQuickSearch(keyword)}
                className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mr-3"></div>
            <span className="text-gray-600">Đang tìm kiếm việc làm...</span>
          </div>
        )}

        {/* Results Header */}
        {!isLoading && (
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {totalElements} việc làm được tìm thấy
            </h2>
          </div>
        )}

        {/* Jobs List/Grid */}
        {!isLoading && jobs.length > 0 && (
          <>
            {viewMode === 'list' ? (
              <div className="space-y-6">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const page = Math.max(1, currentPage - 2) + i;
                  if (page > totalPages) return null;
                  
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-8 h-8 rounded ${
                        page === currentPage ? 'bg-emerald-600 text-white' : 'hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}

        {/* No Results */}
        {!isLoading && jobs.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy việc làm</h3>
            <p className="mt-1 text-sm text-gray-500">
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs; 
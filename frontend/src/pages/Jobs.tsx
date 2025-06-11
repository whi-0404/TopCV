import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import jobService, { JobPost, JobPostDashboard, JobType, JobLevel, JobSearchRequest } from '../services/jobService';
import JobCard from '../components/job/JobCard';

// Constants moved outside component to prevent re-creation
const PAGE_SIZE = 12;
const LOCATIONS = ['all', 'TP.HCM', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng'];

const Jobs = () => {
  // Sử dụng JobPostDashboard làm type chính vì đó là response từ getDashboardJobs
  const [jobs, setJobs] = useState<JobPostDashboard[]>([]);
  const [jobTypes, setJobTypes] = useState<JobType[]>([]);
  const [jobLevels, setJobLevels] = useState<JobLevel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [debugInfo, setDebugInfo] = useState<any>(null);
  
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

  // Load initial data (job types và levels)
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        console.log('🔄 Đang tải dữ liệu ban đầu...');
        setDebugInfo((prev: any) => ({...prev, step: 'Loading initial data...'}));
        
        const [typesData, levelsData] = await Promise.all([
          jobService.getJobTypes(),
          jobService.getJobLevels()
        ]);
        
        console.log('✅ Dữ liệu loại công việc:', typesData);
        console.log('✅ Dữ liệu cấp bậc:', levelsData);
        
        setJobTypes(typesData);
        setJobLevels(levelsData);
        setError('');
        setDebugInfo((prev: any) => ({
          ...prev, 
          initialDataLoaded: true,
          jobTypesCount: typesData.length,
          jobLevelsCount: levelsData.length
        }));
      } catch (err: any) {
        console.error('❌ Lỗi khi tải dữ liệu ban đầu:', err);
        setError('Không thể tải dữ liệu ban đầu. Vui lòng thử lại.');
        setDebugInfo((prev: any) => ({...prev, initialDataError: err.message}));
      }
    };

    loadInitialData();
  }, []);

  // Memoize hasSearchFilters để tránh re-computation
  const hasSearchFilters = useMemo(() => {
    return searchTerm.trim() !== '' || 
           selectedLocation !== 'all' || 
           selectedType !== 'all' || 
           selectedLevel !== 'all';
  }, [searchTerm, selectedLocation, selectedType, selectedLevel]);

  // Load jobs - optimization để tránh vòng lặp
  useEffect(() => {
    const loadJobs = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        console.log('=== 🔄 JOBS PAGE: Bắt đầu tải công việc ===');
        console.log('📋 Tham số hiện tại:', { 
          searchTerm, 
          selectedLocation, 
          selectedType, 
          selectedLevel, 
          currentPage,
          pageSize: PAGE_SIZE 
        });
        
        // Optimize debug info updates - chỉ update một lần
        const debugUpdate = {
          loadingStep: hasSearchFilters ? 'Using search API...' : 'Using dashboard API...',
          currentParams: { searchTerm, selectedLocation, selectedType, selectedLevel, currentPage }
        };
        setDebugInfo((prev: any) => ({ ...prev, ...debugUpdate }));

        let response: any;
        
        if (hasSearchFilters) {
          // Sử dụng search API khi có filters
          const searchParams: JobSearchRequest = {
            keyword: searchTerm.trim() || undefined,
            location: selectedLocation !== 'all' ? selectedLocation : undefined,
            jobTypeIds: selectedType !== 'all' ? [parseInt(selectedType)] : undefined,
            jobLevelIds: selectedLevel !== 'all' ? [parseInt(selectedLevel)] : undefined,
            sortBy: 'createdAt',
            sortDirection: 'desc',
            page: currentPage,
            size: PAGE_SIZE
          };

          console.log('🔍 Gọi jobService.searchJobs với params:', searchParams);
          const searchResponse = await jobService.searchJobs(searchParams);
          
          // Chuyển đổi JobPost sang JobPostDashboard format để consistent
          const convertedJobs: JobPostDashboard[] = searchResponse.Data.map(job => ({
            id: job.id,
            title: job.title,
            description: job.description,
            location: job.location,
            salary: job.salary,
            deadline: job.deadline,
            appliedCount: job.appliedCount,
            hiringQuota: job.hiringQuota,
            status: job.status,
            createdAt: job.createdAt,
            company: job.company,
            jobType: job.jobType,
            skills: job.skills
          }));

          response = {
            Data: convertedJobs,
            totalPages: searchResponse.totalPages,
            pageSize: searchResponse.pageSize,
            totalElements: searchResponse.totalElements
          };
        } else {
          // Tự động gọi getDashboardJobs khi không có filters
          console.log('🏠 Gọi jobService.getDashboardJobs (trang chủ)');
          response = await jobService.getDashboardJobs(currentPage, PAGE_SIZE);
        }
        
        console.log('=== ✅ JOBS PAGE: Nhận được phản hồi ===');
        console.log('📊 Response data:', response);
        console.log('📝 Dữ liệu công việc:', response.Data);
        console.log('🔢 Tổng số công việc:', response.totalElements);
        
        // Cập nhật state
        setJobs(response.Data || []);
        setTotalPages(response.totalPages || 1);
        setTotalElements(response.totalElements || 0);
        
        // Final debug update
        setDebugInfo((prev: any) => ({
          ...prev,
          loadingStep: 'Completed',
          responseData: {
            jobsCount: response.Data?.length || 0,
            totalPages: response.totalPages,
            totalElements: response.totalElements
          }
        }));
        
        console.log('=== 🎯 JOBS PAGE: Đã cập nhật state ===');
        console.log('📌 Số lượng jobs hiển thị:', response.Data?.length || 0);
        console.log('📄 Trang hiện tại:', currentPage, '/', response.totalPages || 1);
        
      } catch (err: any) {
        console.error('=== ❌ JOBS PAGE: Lỗi tải công việc ===');
        console.error('🚨 Chi tiết lỗi:', err);
        setError('Không thể tải danh sách việc làm. Vui lòng thử lại.');
        setJobs([]);
        setTotalElements(0);
        setTotalPages(1);
        setDebugInfo((prev: any) => ({
          ...prev,
          loadingStep: 'Error',
          error: err.message
        }));
      } finally {
        setIsLoading(false);
      }
    };

    loadJobs();
    // Fixed dependencies - removed pageSize which was causing infinite loop
  }, [searchTerm, selectedLocation, selectedType, selectedLevel, currentPage, hasSearchFilters]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset về trang đầu khi search
  };

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleQuickSearch = useCallback((keyword: string) => {
    setSearchTerm(keyword);
    setCurrentPage(1);
  }, []);

  // Clear all filters và quay về dashboard view
  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedLocation('all');
    setSelectedType('all');
    setSelectedLevel('all');
    setCurrentPage(1);
  }, []);

  // Debug toggle
  const [showDebug, setShowDebug] = useState(false);

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Có lỗi xảy ra</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
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
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                title="Xem dạng danh sách"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                title="Xem dạng lưới"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </form>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Địa điểm</label>
              <select
                value={selectedLocation}
                onChange={(e) => {
                  setSelectedLocation(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              >
                {LOCATIONS.map((location: string) => (
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
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
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
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              >
                <option value="all">Tất cả cấp độ</option>
                {jobLevels.map(level => (
                  <option key={level.id} value={level.id.toString()}>
                    {level.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear filters button */}
            {(searchTerm || selectedLocation !== 'all' || selectedType !== 'all' || selectedLevel !== 'all') && (
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>

          {/* Quick search keywords */}
          <div className="flex gap-2 flex-wrap">
            <span className="text-sm text-gray-500 py-1">Từ khóa phổ biến:</span>
            {['React', 'Node.js', 'Python', 'Java', 'DevOps'].map((keyword) => (
              <button
                key={keyword}
                type="button"
                onClick={() => handleQuickSearch(keyword)}
                className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline py-1 transition-colors"
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
              {totalElements > 0 ? (
                <>
                  <span className="text-emerald-600">{totalElements}</span> việc làm được tìm thấy
                </>
              ) : (
                'Không tìm thấy việc làm'
              )}
            </h2>
            {totalElements > 0 && (
              <p className="text-sm text-gray-500">
                Trang {currentPage} / {totalPages}
              </p>
            )}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Trang trước"
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
                      className={`w-10 h-10 rounded-lg transition-colors ${
                        page === currentPage 
                          ? 'bg-emerald-600 text-white' 
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Trang sau"
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
        {!isLoading && jobs.length === 0 && !error && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy việc làm</h3>
            <p className="text-gray-500 mb-4">
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để tìm thấy nhiều kết quả hơn.
            </p>
            {(searchTerm || selectedLocation !== 'all' || selectedType !== 'all' || selectedLevel !== 'all') && (
              <button
                onClick={handleClearFilters}
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Xóa tất cả bộ lọc
              </button>
            )}
          </div>
        )}

        {/* Debug Panel */}
        <div className="mt-8">
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors"
          >
            {showDebug ? 'Ẩn Debug Info' : 'Hiện Debug Info'}
          </button>
          
          {showDebug && (
            <div className="mt-4 bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Debug Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Environment:</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>API Base URL: {process.env.REACT_APP_API_URL || 'http://localhost:8080/TopCV'}</li>
                    <li>Node ENV: {process.env.NODE_ENV}</li>
                    <li>Jobs Count: {jobs.length}</li>
                    <li>Job Types: {jobTypes.length}</li>
                    <li>Job Levels: {jobLevels.length}</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">State:</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>Loading: {isLoading.toString()}</li>
                    <li>Error: {error || 'None'}</li>
                    <li>Current Page: {currentPage}</li>
                    <li>Total Pages: {totalPages}</li>
                    <li>Total Elements: {totalElements}</li>
                  </ul>
                </div>
              </div>
              
              {debugInfo && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700 mb-2">Debug Data:</h4>
                  <pre className="bg-white p-3 rounded text-xs overflow-auto max-h-64">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs; 
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import companyService, { CompanyProfile } from '../services/companyService';
import { apiUtils } from '../services';

const Companies = () => {
  const [companies, setCompanies] = useState<CompanyProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 12;

  const locations = ['all', 'TP.HCM', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng'];
  const sizeOptions = [
    { value: 'all', label: 'Tất cả quy mô' },
    { value: '1-10', label: '1-10 nhân viên' },
    { value: '11-50', label: '11-50 nhân viên' },
    { value: '51-100', label: '51-100 nhân viên' },
    { value: '101-500', label: '101-500 nhân viên' },
    { value: '501-1000', label: '501-1000 nhân viên' },
    { value: '1000+', label: '1000+ nhân viên' }
  ];

  // Search companies when filters change
  useEffect(() => {
    const searchCompanies = async () => {
      try {
        setIsLoading(true);
        console.log('=== COMPANIES PAGE: Starting search ===');
        console.log('Search params:', { searchTerm, selectedLocation, selectedSize, currentPage });
        
        console.log('Searching companies with keyword:', searchTerm);
        
        // Use searchCompanies if there's a search term, otherwise use getCompanies
        const response = searchTerm.trim() 
          ? await companyService.searchCompanies(searchTerm, currentPage, pageSize)
          : await companyService.getCompanies(currentPage, pageSize);
        
        console.log('=== COMPANIES PAGE: Response received ===');
        console.log('Response:', response);
        console.log('Companies data:', response.Data);
        console.log('Total elements:', response.totalElements);
        
        setCompanies(response.Data || []);
        setTotalPages(response.totalPages || 1);
        setTotalElements(response.totalElements || 0);
        setError('');
        
        console.log('=== COMPANIES PAGE: State updated ===');
        console.log('Companies count:', response.Data?.length || 0);
      } catch (err: any) {
        console.error('=== COMPANIES PAGE: Error occurred ===');
        console.error('Failed to search companies:', err);
        setError('Không thể tìm kiếm công ty. Vui lòng thử lại.');
        setCompanies([]);
      } finally {
        setIsLoading(false);
      }
    };

    searchCompanies();
  }, [searchTerm, selectedLocation, selectedSize, selectedCategory, currentPage]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
      <svg
        key={i}
          className={`w-4 h-4 ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`} 
        fill="currentColor"
        viewBox="0 0 20 20"
      >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>
      );
    }
    return stars;
  };

  const getCompanyRating = (reviewStats?: { averageRating: number; totalReviews: number }): number => {
    return reviewStats?.averageRating || 0;
  };

  const formatEmployeeRange = (range?: string): string => {
    if (!range) return 'Không xác định';
    return range;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Lỗi</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Khám phá các công ty hàng đầu</h1>
          <p className="text-lg text-gray-600">Tìm hiểu về các công ty và văn hóa làm việc tại đây</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <form onSubmit={handleSearchSubmit} className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Tìm kiếm công ty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Tìm kiếm
            </button>
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
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
                <option value="all">Tất cả địa điểm</option>
                {locations.slice(1).map(location => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quy mô</label>
              <select
                value={selectedSize}
                onChange={(e) => {
                  setSelectedSize(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              >
                <option value="all">Tất cả quy mô</option>
                {sizeOptions.slice(1).map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mr-3"></div>
            <span className="text-gray-600">Đang tìm kiếm công ty...</span>
          </div>
        )}

        {/* Results Header */}
        {!isLoading && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
              {totalElements} công ty được tìm thấy
          </h2>
        </div>
        )}

        {/* Companies Grid/List */}
        {!isLoading && companies && companies.length > 0 && (
          <>
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies.map((company) => (
              <Link 
                key={company.id}
                to={`/companies/${company.id}`}
                className="block bg-white rounded-lg border border-gray-200 p-6 hover:border-emerald-500 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                      <img 
                        src={apiUtils.formatFileUrl(company.logo, 'company-logo')} 
                        alt={company.name} 
                        className="w-16 h-16 rounded-lg object-cover" 
                      />
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 text-sm rounded-full font-medium">
                          {company.jobCount || 0} việc làm
                    </span>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{company.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {apiUtils.truncateText(company.description, 120) || 'Chưa có mô tả công ty'}
                    </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                        {company.address || 'Chưa cập nhật địa chỉ'}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                        {formatEmployeeRange(company.employeeRange)}
                  </div>
                  <div className="flex items-center gap-1">
                        {renderStars(getCompanyRating(company.reviewStats))}
                        <span className="text-sm text-gray-600 ml-1">
                          {getCompanyRating(company.reviewStats).toFixed(1)}
                        </span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                      {company.categories?.slice(0, 3).map((category) => (
                    <span 
                          key={category.id} 
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                    >
                          {category.name}
                        </span>
                      )) || []}
                      {company.categories && company.categories.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{company.categories.length - 3}
                    </span>
                      )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
                {companies.map((company) => (
              <Link 
                key={company.id}
                to={`/companies/${company.id}`}
                className="block bg-white rounded-lg border border-gray-200 p-6 hover:border-emerald-500 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-6">
                      <img 
                        src={apiUtils.formatFileUrl(company.logo, 'company-logo')} 
                        alt={company.name} 
                        className="w-20 h-20 rounded-lg object-cover flex-shrink-0" 
                      />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{company.name}</h3>
                      <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 text-sm rounded-full font-medium">
                            {company.jobCount || 0} việc làm
                      </span>
                    </div>
                    
                        <p className="text-gray-600 mb-3">
                          {apiUtils.truncateText(company.description, 200) || 'Chưa có mô tả công ty'}
                        </p>
                    
                    <div className="flex items-center gap-6 mb-3">
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                            {company.address || 'Chưa cập nhật địa chỉ'}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                            {formatEmployeeRange(company.employeeRange)}
                      </div>
                      <div className="flex items-center gap-1">
                            {renderStars(getCompanyRating(company.reviewStats))}
                            <span className="text-sm text-gray-600 ml-1">
                              {getCompanyRating(company.reviewStats).toFixed(1)}
                            </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                          {company.categories?.map((category) => (
                        <span 
                              key={category.id} 
                          className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded"
                        >
                              {category.name}
                        </span>
                          )) || []}
                    </div>
                  </div>
                </div>
              </Link>
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
        {!isLoading && companies && companies.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy công ty</h3>
            <p className="mt-1 text-sm text-gray-500">
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies; 
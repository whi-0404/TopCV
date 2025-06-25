import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { Link } from 'react-router-dom';
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  UsersIcon,
  ChevronRightIcon,
  ChevronLeftIcon
} from '@heroicons/react/24/outline';
import { 
  companyApi, 
  type CompanyDashboardResponse, 
  type CompanySearchRequest,
  type PageResponse 
} from '../services/api/companyApi';

const CompaniesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const companiesPerPage = 12;

  // API Data States
  const [companies, setCompanies] = useState<CompanyDashboardResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Filter states
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedEmployeeRange, setSelectedEmployeeRange] = useState('');
  const [sortBy, setSortBy] = useState('followerCount');
  const [sortDirection, setSortDirection] = useState('desc');

  // Load companies on component mount and when filters change
  useEffect(() => {
    searchCompanies();
  }, [
    searchTerm,
    selectedLocation,
    selectedEmployeeRange,
    sortBy,
    sortDirection,
    currentPage
  ]);

  const searchCompanies = async () => {
    setLoading(true);
    try {
      const searchRequest: CompanySearchRequest = {
        keyword: searchTerm || undefined,
        location: selectedLocation || undefined,
        employeeRange: selectedEmployeeRange || undefined,
        sortBy,
        sortDirection
      };

      const response = await companyApi.searchCompanies({
        ...searchRequest,
        page: currentPage,
        size: companiesPerPage
      });

      setCompanies(response.result.data || []);
      setTotalPages(response.result.totalPages);
      setTotalElements(response.result.totalElements);
      setError('');
    } catch (error: any) {
      console.error('Error searching companies:', error);
      setError('Không thể tải danh sách công ty');
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    searchCompanies();
  };

  const CompanyCard: React.FC<{ company: CompanyDashboardResponse }> = ({ company }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        {/* Removed company logo */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                <Link 
                  to={`/companies/${company.id}`}
                  className="hover:text-emerald-600 transition-colors"
                >
                  {company.name}
                </Link>
              </h3>
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <UsersIcon className="h-4 w-4 mr-1" />
                <span>{company.jobCount} việc làm</span>
              </div>
              <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                {company.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {company.categories.slice(0, 2).map((category) => (
                    <span key={category.id} className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
                      {category.name}
                    </span>
                  ))}
                  {company.categories.length > 2 && (
                    <span className="bg-gray-50 text-gray-700 px-2 py-1 rounded-full text-xs">
                      +{company.categories.length - 2} more
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-900">{company.jobCount} Jobs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Tìm kiếm <span className="text-emerald-600">Công ty mơ ước</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Tìm các công ty mà bạn mong muốn làm việc
              </p>
              
              {/* Search Bar */}
              <div className="max-w-4xl mx-auto">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tên công ty, mô tả"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-lg"
                    />
                  </div>
                  <div className="relative">
                    <MapPinIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Địa điểm"
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none min-w-[200px]"
                    />
                  </div>
                  <button 
                    onClick={handleSearch}
                    className="bg-emerald-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                  >
                    Tìm kiếm
                  </button>
                </div>
                
                {/* Additional Filters */}
                <div className="mt-4 flex justify-center gap-4">
                  <select
                    value={selectedEmployeeRange}
                    onChange={(e) => setSelectedEmployeeRange(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  >
                    <option value="">Tất cả quy mô</option>
                    <option value="1-10">1-10 nhân viên</option>
                    <option value="11-50">11-50 nhân viên</option>
                    <option value="51-200">51-200 nhân viên</option>
                    <option value="201-500">201-500 nhân viên</option>
                    <option value="500+">500+ nhân viên</option>
                  </select>
                  
                  <select
                    value={`${sortBy}-${sortDirection}`}
                    onChange={(e) => {
                      const [newSortBy, newSortDirection] = e.target.value.split('-');
                      setSortBy(newSortBy);
                      setSortDirection(newSortDirection);
                      setCurrentPage(1);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  >
                    <option value="followerCount-desc">Phổ biến nhất</option>
                    <option value="jobCount-desc">Nhiều việc làm nhất</option>
                    <option value="name-asc">Tên A-Z</option>
                    <option value="name-desc">Tên Z-A</option>
                  </select>
                </div>
                
                <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm text-gray-500">
                  <span>Phổ biến:</span>
                  <button 
                    onClick={() => {setSearchTerm('FPT'); setCurrentPage(1);}}
                    className="text-emerald-600 hover:text-emerald-700"
                  >
                    FPT
                  </button>
                  <span>,</span>
                  <button 
                    onClick={() => {setSearchTerm('Viettel'); setCurrentPage(1);}}
                    className="text-emerald-600 hover:text-emerald-700"
                  >
                    Viettel
                  </button>
                  <span>,</span>
                  <button 
                    onClick={() => {setSearchTerm('VNG'); setCurrentPage(1);}}
                    className="text-emerald-600 hover:text-emerald-700"
                  >
                    VNG
                  </button>
                  <span>,</span>
                  <button 
                    onClick={() => {setSearchTerm('Tiki'); setCurrentPage(1);}}
                    className="text-emerald-600 hover:text-emerald-700"
                  >
                    Tiki
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Công ty IT</h2>
            <p className="text-gray-600">
              Hiển thị {totalElements} công ty • Trang {currentPage} / {totalPages}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Đang tải...</p>
            </div>
          ) : companies.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Không tìm thấy công ty nào phù hợp</p>
            </div>
          ) : (
            <>
              {/* Companies Grid */}
              <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {companies.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
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

                  {totalPages > 5 && (
                    <>
                      <span className="px-2 text-gray-500">...</span>
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className={`px-3 py-1 rounded-md font-medium ${
                          currentPage === totalPages
                            ? 'bg-emerald-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CompaniesPage; 
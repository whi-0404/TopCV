import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import {
  BuildingOfficeIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  TrashIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  MapPinIcon,
  UsersIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';
import { companyApi, type CompanyDashboardResponse } from '../../services/api';

interface PageResponse<T> {
  data: T[];
  pageSize: number;
  totalPages: number;
  totalElements: number;
}

const CompaniesManagementPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<CompanyDashboardResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [employeeRangeFilter, setEmployeeRangeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedCompanies, setSelectedCompanies] = useState<number[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const pageSize = 20;

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchCompanies();
    }
  }, [user, currentPage, searchKeyword, locationFilter, employeeRangeFilter, statusFilter]);

  const fetchCompanies = async () => {
    setLoading(true);
    setError('');
    try {
      const searchParams = {
        keyword: searchKeyword.trim() || undefined,
        location: locationFilter.trim() || undefined,
        employeeRange: employeeRangeFilter !== 'ALL' ? employeeRangeFilter : undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        page: currentPage,
        size: pageSize,
        sortBy: 'followerCount',
        sortDirection: 'desc'
      };

      const response = await companyApi.searchCompanies(searchParams);
      
      setCompanies(response.result.data || []);
      setTotalPages(response.result.totalPages);
      setTotalElements(response.result.totalElements);
    } catch (error: any) {
      console.error('Error fetching companies:', error);
      setError('Không thể tải danh sách công ty');
    }
    setLoading(false);
  };

  const handleActivateCompany = async (companyId: number) => {
    setActionLoading(`activate-${companyId}`);
    try {
      await companyApi.activateCompany(companyId);
      await fetchCompanies(); // Refresh data
    } catch (error: any) {
      console.error('Error activating company:', error);
      setError('Không thể kích hoạt công ty');
    }
    setActionLoading(null);
  };

  const handleDeactivateCompany = async (companyId: number) => {
    setActionLoading(`deactivate-${companyId}`);
    try {
      await companyApi.deactivateCompany(companyId);
      await fetchCompanies(); // Refresh data
    } catch (error: any) {
      console.error('Error deactivating company:', error);
      setError('Không thể vô hiệu hóa công ty');
    }
    setActionLoading(null);
  };

  const handleDeleteCompany = async (companyId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa công ty này không? Hành động này không thể hoàn tác.')) {
      return;
    }
    
    setActionLoading(`delete-${companyId}`);
    try {
      await companyApi.deleteCompany(companyId);
      await fetchCompanies(); // Refresh data
    } catch (error: any) {
      console.error('Error deleting company:', error);
      setError('Không thể xóa công ty');
    }
    setActionLoading(null);
  };

  const handleSelectCompany = (companyId: number) => {
    setSelectedCompanies(prev => 
      prev.includes(companyId) 
        ? prev.filter(id => id !== companyId)
        : [...prev, companyId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCompanies.length === companies.length) {
      setSelectedCompanies([]);
    } else {
      setSelectedCompanies(companies.map(company => company.id));
    }
  };

  const handleBulkAction = async (action: 'activate' | 'deactivate' | 'delete') => {
    if (selectedCompanies.length === 0) return;

    const confirmMessage = action === 'delete' 
      ? `Bạn có chắc chắn muốn xóa ${selectedCompanies.length} công ty đã chọn không?`
      : `Bạn có chắc chắn muốn ${action === 'activate' ? 'kích hoạt' : 'vô hiệu hóa'} ${selectedCompanies.length} công ty đã chọn không?`;

    if (!window.confirm(confirmMessage)) return;

    setActionLoading(`bulk-${action}`);
    try {
      for (const companyId of selectedCompanies) {
        if (action === 'activate') {
          await companyApi.activateCompany(companyId);
        } else if (action === 'deactivate') {
          await companyApi.deactivateCompany(companyId);
        } else if (action === 'delete') {
          await companyApi.deleteCompany(companyId);
        }
      }
      setSelectedCompanies([]);
      await fetchCompanies();
    } catch (error: any) {
      console.error(`Error in bulk ${action}:`, error);
      setError(`Không thể thực hiện hành động hàng loạt`);
    }
    setActionLoading(null);
  };

  const getEmployeeRangeDisplay = (range: string) => {
    switch (range) {
      case '1-10': return '1-10 nhân viên';
      case '11-50': return '11-50 nhân viên';
      case '51-200': return '51-200 nhân viên';
      case '201-500': return '201-500 nhân viên';
      case '500+': return '500+ nhân viên';
      default: return range;
    }
  };

  if (!user || user.role !== 'ADMIN') {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Không có quyền truy cập</h1>
            <p className="text-gray-600">Bạn không có quyền truy cập trang này.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Quản lý công ty</h1>
                <p className="text-gray-600 mt-1">
                  Tổng cộng {totalElements} công ty
                </p>
              </div>
              {selectedCompanies.length > 0 && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleBulkAction('activate')}
                    disabled={actionLoading !== null}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    Kích hoạt ({selectedCompanies.length})
                  </button>
                  <button
                    onClick={() => handleBulkAction('deactivate')}
                    disabled={actionLoading !== null}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50"
                  >
                    Vô hiệu hóa ({selectedCompanies.length})
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    disabled={actionLoading !== null}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    Xóa ({selectedCompanies.length})
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tìm kiếm công ty
                </label>
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="Tìm theo tên công ty..."
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa điểm
                </label>
                <input
                  type="text"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  placeholder="Nhập địa điểm..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quy mô
                </label>
                <select
                  value={employeeRangeFilter}
                  onChange={(e) => setEmployeeRangeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ALL">Tất cả quy mô</option>
                  <option value="1-10">1-10 nhân viên</option>
                  <option value="11-50">11-50 nhân viên</option>
                  <option value="51-200">51-200 nhân viên</option>
                  <option value="201-500">201-500 nhân viên</option>
                  <option value="500+">500+ nhân viên</option>
                </select>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {loading && (
            <div className="bg-blue-50 border border-blue-200 text-blue-600 px-4 py-3 rounded-lg mb-6">
              Đang tải danh sách công ty...
            </div>
          )}

          {/* Companies Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={companies.length > 0 && selectedCompanies.length === companies.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Công ty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Thông tin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Danh mục
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Việc làm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {companies.map((company) => (
                  <tr key={company.id} className={selectedCompanies.includes(company.id) ? 'bg-blue-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedCompanies.includes(company.id)}
                        onChange={() => handleSelectCompany(company.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                          {company.logo ? (
                            <img 
                              src={company.logo} 
                              alt={company.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <BuildingOfficeIcon className="h-8 w-8 text-gray-500" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {company.name}
                          </div>
                          <div className="text-sm text-gray-500">ID: {company.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div className="max-w-xs truncate" title={company.description}>
                          {company.description || 'Chưa có mô tả'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {company.categories?.slice(0, 2).map((category) => (
                          <span 
                            key={category.id}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {category.name}
                          </span>
                        ))}
                        {company.categories?.length > 2 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            +{company.categories.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <BriefcaseIcon className="h-4 w-4 mr-1" />
                          <span>{company.jobCount || 0} việc làm</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <div className="flex space-x-1">
                        <button
                          onClick={() => navigate(`/companies/${company.id}`)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="Xem chi tiết"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => handleActivateCompany(company.id)}
                          disabled={actionLoading === `activate-${company.id}`}
                          className="text-green-600 hover:text-green-800 p-1 disabled:opacity-50"
                          title="Kích hoạt"
                        >
                          <ShieldCheckIcon className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDeactivateCompany(company.id)}
                          disabled={actionLoading === `deactivate-${company.id}`}
                          className="text-yellow-600 hover:text-yellow-800 p-1 disabled:opacity-50"
                          title="Vô hiệu hóa"
                        >
                          <ShieldExclamationIcon className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDeleteCompany(company.id)}
                          disabled={actionLoading === `delete-${company.id}`}
                          className="text-red-600 hover:text-red-800 p-1 disabled:opacity-50"
                          title="Xóa"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!loading && companies.length === 0 && (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy công ty</h3>
              <p className="text-gray-600">
                {searchKeyword || locationFilter || employeeRangeFilter !== 'ALL'
                  ? 'Không có công ty nào phù hợp với bộ lọc hiện tại.'
                  : 'Chưa có công ty nào trong hệ thống.'}
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow mt-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Hiển thị <span className="font-medium">{((currentPage - 1) * pageSize) + 1}</span> đến{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * pageSize, totalElements)}
                    </span>{' '}
                    trong tổng số <span className="font-medium">{totalElements}</span> kết quả
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Trước
                    </button>
                    
                    {/* Page numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = Math.max(1, currentPage - 2) + i;
                      if (pageNum > totalPages) return null;
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === pageNum
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Sau
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CompaniesManagementPage; 
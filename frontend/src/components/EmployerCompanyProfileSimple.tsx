import React, { useState, useEffect } from 'react';
import { companyService, type CompanyProfile, type CompanyUpdateRequest } from '@/services';

export {};

/**
 * Simple Employer Company Profile component để test API
 * Fix cho issue khi employer chưa có company
 */
const EmployerCompanyProfileSimple: React.FC = () => {
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasCompany, setHasCompany] = useState(false);

  // Load company data khi component mount
  useEffect(() => {
    loadCompanyData();
  }, []);

  const loadCompanyData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const companyData = await companyService.getMyCompany();
      
      if (companyData) {
        setCompany(companyData);
        setHasCompany(true);
        console.log('✅ Company loaded:', companyData);
      } else {
        setCompany(null);
        setHasCompany(false);
        console.log('ℹ️ No company found - employer needs to create one');
      }
      
    } catch (err: any) {
      setError(`Lỗi khi tải thông tin công ty: ${err.message}`);
      console.error('❌ Error loading company data:', err);
      setHasCompany(false);
    } finally {
      setLoading(false);
    }
  };

  const createTestCompany = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const testCompanyData = {
        name: `Test Company ${Date.now()}`,
        description: 'Đây là công ty test được tạo để kiểm tra API',
        website: 'https://example.com',
        address: 'Hà Nội, Việt Nam',
        employeeRange: '11-50',
        categoryIds: [1] // Assuming category ID 1 exists
      };
      
      const createdCompany = await companyService.createCompany(testCompanyData);
      setCompany(createdCompany);
      setHasCompany(true);
      
      console.log('✅ Company created successfully:', createdCompany);
      
    } catch (err: any) {
      setError(`Không thể tạo công ty: ${err.message}`);
      console.error('❌ Error creating company:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateTestCompany = async () => {
    if (!company) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const updateData = {
        name: company.name,
        description: `${company.description} - Updated at ${new Date().toLocaleString()}`,
        website: company.website,
        address: company.address,
        employeeRange: company.employeeRange,
        categoryIds: company.categories?.map(cat => cat.id) || []
      };
      
      const updatedCompany = await companyService.updateMyCompany(updateData);
      setCompany(updatedCompany);
      
      console.log('✅ Company updated successfully:', updatedCompany);
      
    } catch (err: any) {
      setError(`Không thể cập nhật công ty: ${err.message}`);
      console.error('❌ Error updating company:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="text-lg">🔄 Đang tải thông tin công ty...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg">
        <div className="border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            🏢 Employer Company Profile Test
          </h1>
        </div>

        <div className="p-6">
          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-red-800 font-medium">❌ Lỗi</div>
              <div className="text-red-600 mt-1">{error}</div>
              <button
                onClick={loadCompanyData}
                className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                🔄 Thử lại
              </button>
            </div>
          )}

          {/* Company Status */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">📊 Trạng thái Company</h2>
            <div className={`p-4 rounded-lg border ${hasCompany ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
              <div className={`font-medium ${hasCompany ? 'text-green-800' : 'text-yellow-800'}`}>
                {hasCompany ? '✅ Employer đã có company' : '⚠️ Employer chưa có company'}
              </div>
              <div className={`text-sm mt-1 ${hasCompany ? 'text-green-600' : 'text-yellow-600'}`}>
                {hasCompany ? 
                  'API getMyCompany() trả về dữ liệu company' : 
                  'API getMyCompany() trả về null - cần tạo company mới'
                }
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mb-6 space-x-3">
            <button
              onClick={loadCompanyData}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              🔄 Reload Company Data
            </button>
            
            {!hasCompany && (
              <button
                onClick={createTestCompany}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                ➕ Tạo Test Company
              </button>
            )}
            
            {hasCompany && (
              <button
                onClick={updateTestCompany}
                disabled={loading}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
              >
                ✏️ Update Company
              </button>
            )}
          </div>

          {/* Company Info Display */}
          {hasCompany && company && (
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold mb-4">🏢 Thông tin Company</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">ID</label>
                  <div className="text-gray-900">{company.id}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tên công ty</label>
                  <div className="text-gray-900 font-semibold">{company.name}</div>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                  <div className="text-gray-900">{company.description || 'Chưa có mô tả'}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Website</label>
                  <div className="text-blue-600">
                    {company.website ? (
                      <a href={company.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {company.website}
                      </a>
                    ) : (
                      'Chưa cập nhật'
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                  <div className="text-gray-900">{company.address || 'Chưa cập nhật'}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quy mô</label>
                  <div className="text-gray-900">{company.employeeRange || 'Chưa cập nhật'}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Followers</label>
                  <div className="text-green-600 font-bold">{company.followerCount || 0}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Job Count</label>
                  <div className="text-blue-600 font-bold">{company.jobCount || 0}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Average Rating</label>
                  <div className="text-purple-600 font-bold">
                    {company.reviewStats?.averageRating?.toFixed(1) || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Categories */}
              {company.categories && company.categories.length > 0 && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
                  <div className="flex flex-wrap gap-2">
                    {company.categories.map(category => (
                      <span
                        key={category.id}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Debug Info */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h2 className="text-lg font-semibold mb-3">🔧 Debug Info</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="text-xs text-gray-600 overflow-auto max-h-96">
                {JSON.stringify({
                  hasCompany,
                  company,
                  error,
                  loading
                }, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerCompanyProfileSimple; 
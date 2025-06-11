import React, { useState, useEffect } from 'react';
import { companyService, type CompanyProfile, type CompanyUpdateRequest } from '@/services';

/**
 * Component test cho Employer Company Profile Management
 * Sử dụng các API mới đã được integrate:
 * - GET /employers/my-company
 * - PUT /employers/my-company
 */
const EmployerCompanyProfile: React.FC = () => {
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<CompanyUpdateRequest>({
    name: '',
    description: '',
    website: '',
    address: '',
    employeeRange: '',
    categoryIds: []
  });

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
        setCreating(false);
        
        // Set form data
        setFormData({
          name: companyData.name,
          description: companyData.description || '',
          website: companyData.website || '',
          address: companyData.address || '',
          employeeRange: companyData.employeeRange || '',
          categoryIds: companyData.categories?.map(cat => cat.id) || []
        });
      } else {
        // Company doesn't exist, set to creation mode
        setCompany(null);
        setCreating(true);
        setFormData({
          name: '',
          description: '',
          website: '',
          address: '',
          employeeRange: '',
          categoryIds: []
        });
      }
      
    } catch (err: any) {
      setError(`Không thể tải thông tin công ty: ${err.message}`);
      console.error('Error loading company data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let result: CompanyProfile;
      
      if (creating) {
        // Create new company - ensure name is provided
        if (!formData.name || formData.name.trim() === '') {
          throw new Error('Tên công ty là bắt buộc');
        }
        
        const createData = {
          name: formData.name,
          description: formData.description,
          website: formData.website,
          address: formData.address,
          employeeRange: formData.employeeRange,
          categoryIds: formData.categoryIds
        };
        
        result = await companyService.createCompany(createData);
        setCreating(false);
        console.log('✅ Company created successfully:', result);
      } else {
        // Update existing company
        result = await companyService.updateMyCompany(formData);
        setEditing(false);
        console.log('✅ Company updated successfully:', result);
      }
      
      setCompany(result);
      
    } catch (err: any) {
      const action = creating ? 'tạo' : 'cập nhật';
      setError(`Không thể ${action} thông tin công ty: ${err.message}`);
      console.error(`Error ${creating ? 'creating' : 'updating'} company:`, err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (company) {
      setFormData({
        name: company.name,
        description: company.description || '',
        website: company.website || '',
        address: company.address || '',
        employeeRange: company.employeeRange || '',
        categoryIds: company.categories?.map(cat => cat.id) || []
      });
    }
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Đang tải thông tin công ty...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800 font-medium">Lỗi</div>
        <div className="text-red-600 mt-1">{error}</div>
        <button
          onClick={loadCompanyData}
          className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (!company && !creating) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="text-yellow-800">Không tìm thấy thông tin công ty</div>
        <button
          onClick={() => setCreating(true)}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Tạo thông tin công ty
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              {creating ? 'Tạo thông tin công ty' : 'Thông tin công ty'}
            </h1>
            {!editing && !creating ? (
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Chỉnh sửa
              </button>
            ) : (
              <div className="space-x-2">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Đang lưu...' : (creating ? 'Tạo công ty' : 'Lưu')}
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Hủy
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên công ty
            </label>
            {editing || creating ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập tên công ty"
                required
              />
            ) : (
              <div className="text-lg font-semibold text-gray-900">{company?.name || 'Chưa cập nhật'}</div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả công ty
            </label>
            {editing || creating ? (
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Mô tả về công ty"
              />
            ) : (
              <div className="text-gray-700 whitespace-pre-wrap">
                {company?.description || 'Chưa có mô tả'}
              </div>
            )}
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            {editing ? (
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com"
              />
            ) : (
              <div className="text-blue-600">
                {company?.website ? (
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {company.website}
                  </a>
                ) : (
                  'Chưa cập nhật'
                )}
              </div>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ
            </label>
            {editing ? (
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Địa chỉ công ty"
              />
            ) : (
              <div className="text-gray-700">{company?.address || 'Chưa cập nhật'}</div>
            )}
          </div>

          {/* Employee Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quy mô nhân viên
            </label>
            {editing ? (
              <select
                value={formData.employeeRange}
                onChange={(e) => setFormData(prev => ({ ...prev, employeeRange: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Chọn quy mô</option>
                <option value="1-10">1-10 nhân viên</option>
                <option value="11-50">11-50 nhân viên</option>
                <option value="51-100">51-100 nhân viên</option>
                <option value="101-500">101-500 nhân viên</option>
                <option value="501-1000">501-1000 nhân viên</option>
                <option value="1000+">1000+ nhân viên</option>
              </select>
            ) : (
              <div className="text-gray-700">
                {companyService.formatEmployeeRange(company?.employeeRange)}
              </div>
            )}
          </div>

          {/* Statistics */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Thống kê</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{company?.jobCount || 0}</div>
                <div className="text-sm text-gray-500">Tin tuyển dụng</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{company?.followerCount || 0}</div>
                <div className="text-sm text-gray-500">Người theo dõi</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {company?.reviewStats?.averageRating?.toFixed(1) || 'N/A'}
                </div>
                <div className="text-sm text-gray-500">Đánh giá trung bình</div>
              </div>
            </div>
          </div>

          {/* Categories */}
          {company?.categories && company.categories.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Lĩnh vực hoạt động</h3>
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
      </div>

      {/* Debug Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Debug - API Test Results:</h4>
        <pre className="text-xs text-gray-600 overflow-auto">
          {JSON.stringify({ company, formData }, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default EmployerCompanyProfile; 
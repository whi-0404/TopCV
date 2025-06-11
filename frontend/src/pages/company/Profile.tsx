import React, { useState, useEffect } from 'react';
import companyService, { CompanyProfile as ApiCompanyProfile, CompanyUpdateRequest, CompanyCreationRequest, CompanyCategory } from '../../services/companyService';
import { useNavigate } from 'react-router-dom';

interface SimplifiedCompanyProfile {
  name: string;
  logo: string;
  website: string;
  address: string;
  description: string;
  employeeRange: string;
  // Display only fields from API
  followerCount: number;
  jobCount: number;
  rating: number;
  categories: string;
  categoryIds: number[];
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [apiCompanyData, setApiCompanyData] = useState<ApiCompanyProfile | null>(null);
  const [categories, setCategories] = useState<CompanyCategory[]>([]);
  
  const [companyData, setCompanyData] = useState<SimplifiedCompanyProfile>({
    name: '',
    logo: '/images/default-company-logo.png',
    website: '',
    address: '',
    description: '',
    employeeRange: '',
    followerCount: 0,
    jobCount: 0,
    rating: 0,
    categories: '',
    categoryIds: []
  });

  // Fetch company categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await companyService.getCompanyCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error('Failed to fetch company categories:', err);
      }
    };

    fetchCategories();
  }, []);

  // Fetch company profile data on component mount
  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        setIsLoading(true);
        const profile = await companyService.getMyCompany();
        
        if (profile) {
          setApiCompanyData(profile);
          
          // Update companyData with API data
          setCompanyData({
            name: profile.name || '',
            logo: companyService.getLogoUrl(profile.logo),
            website: profile.website || '',
            address: profile.address || '',
            description: profile.description || '',
            employeeRange: profile.employeeRange || '',
            followerCount: profile.followerCount || 0,
            jobCount: profile.jobCount || 0,
            rating: profile.reviewStats?.averageRating || 0,
            categories: companyService.getCategoriesString(profile.categories),
            categoryIds: profile.categories?.map(cat => cat.id) || []
          });
          
          setError('');
        } else {
          // No company exists yet
          setError('Bạn chưa có hồ sơ công ty. Vui lòng tạo mới.');
        }
      } catch (err: any) {
        console.error('Failed to fetch company profile:', err);
        if (err.message?.includes('Company not exists') || err.message?.includes('COMPANY_NOT_EXISTED')) {
          setError('Bạn chưa có hồ sơ công ty. Vui lòng tạo mới.');
        } else {
          setError('Không thể tải thông tin công ty. Vui lòng thử lại.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyProfile();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setCompanyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCategoryChange = (categoryId: number, isChecked: boolean) => {
    setCompanyData(prev => {
      const updatedCategoryIds = isChecked
        ? [...prev.categoryIds, categoryId]
        : prev.categoryIds.filter(id => id !== categoryId);
      
      return {
        ...prev,
        categoryIds: updatedCategoryIds
      };
    });
  };

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!companyData.name.trim()) {
        setError('Tên công ty không được để trống.');
        return;
      }

      setIsSaving(true);
      setError('');
      
      let updatedProfile: ApiCompanyProfile;
      
      if (apiCompanyData) {
        // Update existing company
        const updateData: CompanyUpdateRequest = {
          name: companyData.name,
          description: companyData.description,
          website: companyData.website,
          address: companyData.address,
          employeeRange: companyData.employeeRange,
          categoryIds: companyData.categoryIds
        };

        console.log('Updating company with data:', updateData);
        updatedProfile = await companyService.updateMyCompany(updateData);
      } else {
        // Create new company
        const createData: CompanyCreationRequest = {
          name: companyData.name || 'Tên công ty mới',
          description: companyData.description,
          website: companyData.website,
          address: companyData.address,
          employeeRange: companyData.employeeRange || '1-10',
          categoryIds: companyData.categoryIds.length > 0 ? companyData.categoryIds : [1] // Default category ID
        };

        console.log('Creating company with data:', createData);
        updatedProfile = await companyService.createCompany(createData);
      }
      
      setApiCompanyData(updatedProfile);
      setIsEditing(false);
      setSuccessMessage('Cập nhật thông tin công ty thành công!');
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
      
      // Reload page after 2 seconds to reflect changes
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (err: any) {
      console.error('Failed to save company profile:', err);
      
      // Hiển thị thông báo lỗi chi tiết
      if (err.message) {
        setError(err.message);
      } else {
        setError('Không thể lưu thông tin công ty. Vui lòng thử lại.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (apiCompanyData) {
      // Reset to original data
      setCompanyData({
        name: apiCompanyData.name || '',
        logo: companyService.getLogoUrl(apiCompanyData.logo),
        website: apiCompanyData.website || '',
        address: apiCompanyData.address || '',
        description: apiCompanyData.description || '',
        employeeRange: apiCompanyData.employeeRange || '',
        followerCount: apiCompanyData.followerCount || 0,
        jobCount: apiCompanyData.jobCount || 0,
        rating: apiCompanyData.reviewStats?.averageRating || 0,
        categories: companyService.getCategoriesString(apiCompanyData.categories),
        categoryIds: apiCompanyData.categories?.map(cat => cat.id) || []
      });
    }
    setIsEditing(false);
  };

  // Show loading spinner
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600">Đang tải thông tin công ty...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Hồ sơ công ty</h1>
            <p className="text-gray-600">Quản lý thông tin công ty của bạn</p>
          </div>
          <div className="flex space-x-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {apiCompanyData ? 'Chỉnh sửa' : 'Tạo hồ sơ công ty'}
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isSaving}
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  disabled={isSaving}
                >
                  {isSaving && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  )}
                  {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.08 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-red-800">{error}</p>
          </div>
          {!apiCompanyData && (
            <div className="mt-3">
              <button
                onClick={() => navigate('/company/create-company')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Tạo hồ sơ công ty mới
              </button>
            </div>
          )}
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-green-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-green-800">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Company Profile Form */}
      <div className="bg-white shadow-sm rounded-lg">
        {/* Header with Logo */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="mr-4">
              <img
                src={companyData.logo}
                alt={companyData.name}
                className="w-16 h-16 object-contain border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{companyData.name || 'Tên công ty'}</h2>
              <p className="text-sm text-gray-500">{companyData.categories || 'Chưa phân loại'}</p>
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên công ty {isEditing && <span className="text-red-500">*</span>}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={companyData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Nhập tên công ty"
                    required
                  />
                ) : (
                  <p className="text-gray-900">{companyData.name || 'Chưa cập nhật'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                {isEditing ? (
                  <input
                    type="url"
                    value={companyData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="https://example.com"
                  />
                ) : (
                  <p className="text-gray-900">
                    {companyData.website ? (
                      <a
                        href={companyService.formatWebsiteUrl(companyData.website)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {companyData.website}
                      </a>
                    ) : (
                      'Chưa cập nhật'
                    )}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={companyData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Nhập địa chỉ công ty"
                  />
                ) : (
                  <p className="text-gray-900">{companyData.address || 'Chưa cập nhật'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quy mô công ty</label>
                {isEditing ? (
                  <select
                    value={companyData.employeeRange}
                    onChange={(e) => handleInputChange('employeeRange', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">-- Chọn quy mô --</option>
                    {companyService.getEmployeeRangeOptions().map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-900">{companyData.employeeRange || 'Chưa cập nhật'}</p>
                )}
              </div>
            </div>

            {/* Stats and Categories */}
            <div className="space-y-4">
              {!isEditing && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số việc làm đang tuyển</label>
                    <p className="text-gray-900">{companyData.jobCount}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Người theo dõi</label>
                    <p className="text-gray-900">{companyService.formatFollowerCount(companyData.followerCount)}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đánh giá</label>
                    <div className="flex items-center">
                      <div className="flex items-center mr-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-5 h-5 ${
                              star <= Math.round(companyData.rating) ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-gray-900">{companyData.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </>
              )}

              {isEditing && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lĩnh vực hoạt động</label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`category-${category.id}`}
                          checked={companyData.categoryIds.includes(category.id)}
                          onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`category-${category.id}`} className="ml-2 text-sm text-gray-700">
                          {category.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả công ty</label>
            {isEditing ? (
              <textarea
                value={companyData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={5}
                placeholder="Mô tả về công ty của bạn"
              />
            ) : (
              <div className="prose prose-sm max-w-none text-gray-900">
                {companyData.description ? (
                  <p className="whitespace-pre-line">{companyData.description}</p>
                ) : (
                  <p className="text-gray-500 italic">Chưa có mô tả</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 
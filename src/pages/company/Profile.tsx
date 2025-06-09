import React, { useState, useEffect } from 'react';
import companyService, { CompanyProfile as ApiCompanyProfile, CompanyUpdateRequest } from '../../services/companyService';

interface CompanyProfile {
  name: string;
  logo: string;
  industry: string;
  size: string;
  founded: string;
  website: string;
  address: string;
  description: string;
  mission: string;
  vision: string;
  benefits: string[];
  socialLinks: {
    facebook: string;
    linkedin: string;
    twitter: string;
  };
  // Additional fields from API
  followerCount: number;
  jobCount: number;
  employeeRange: string;
  rating: number;
  categories: string;
}

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [apiCompanyData, setApiCompanyData] = useState<ApiCompanyProfile | null>(null);
  
  // Initialize with empty data instead of mock data
  const [companyData, setCompanyData] = useState<CompanyProfile>({
    name: '',
    logo: '/images/default-company-logo.png',
    industry: '',
    size: '',
    founded: '',
    website: '',
    address: '',
    description: '',
    mission: '',
    vision: '',
    benefits: [],
    socialLinks: {
      facebook: '',
      linkedin: '',
      twitter: ''
    },
    followerCount: 0,
    jobCount: 0,
    employeeRange: '',
    rating: 0,
    categories: ''
  });

  const [newBenefit, setNewBenefit] = useState('');

  // Fetch company profile data on component mount
  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        setIsLoading(true);
        const profile = await companyService.getMyCompany();
        setApiCompanyData(profile);
        
        // Update companyData with API data
        setCompanyData(prev => ({
          ...prev,
          name: profile.name || '',
          logo: companyService.getLogoUrl(profile.logo),
          size: companyService.formatEmployeeRange(profile.employeeRange),
          website: profile.website || '',
          address: profile.address || '',
          description: profile.description || '',
          industry: companyService.getCategoriesString(profile.categories),
          // Keep mock data for fields not available in API
          founded: prev.founded,
          mission: prev.mission,
          vision: prev.vision,
          benefits: prev.benefits,
          socialLinks: prev.socialLinks,
          followerCount: profile.followerCount || 0,
          jobCount: profile.jobCount || 0,
          employeeRange: profile.employeeRange || '',
          rating: profile.reviewStats?.averageRating || 0,
          categories: companyService.getCategoriesString(profile.categories)
        }));
        
        setError('');
      } catch (err: any) {
        console.error('Failed to fetch company profile:', err);
        setError('Không thể tải thông tin công ty. Vui lòng thử lại.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyProfile();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('socialLinks.')) {
      const socialField = field.split('.')[1];
      setCompanyData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialField]: value
        }
      }));
    } else {
      setCompanyData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const addBenefit = () => {
    if (newBenefit.trim() && !companyData.benefits.includes(newBenefit.trim())) {
      setCompanyData(prev => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()]
      }));
      setNewBenefit('');
    }
  };

  const removeBenefit = (benefitToRemove: string) => {
    setCompanyData(prev => ({
      ...prev,
      benefits: prev.benefits.filter(benefit => benefit !== benefitToRemove)
    }));
  };

  const handleSave = async () => {
    if (!apiCompanyData) return;
    
    try {
      setIsSaving(true);
      
      const updateData: CompanyUpdateRequest = {
        name: companyData.name,
        description: companyData.description,
        website: companyData.website,
        address: companyData.address,
        employeeRange: companyData.employeeRange,
        // Convert categories string back to categoryIds if needed
        // TODO: Add category selection UI to get actual categoryIds
      };
      
      const updatedProfile = await companyService.updateMyCompany(updateData);
      setApiCompanyData(updatedProfile);
      
      setIsEditing(false);
      setError('');
      setSuccessMessage('Cập nhật thông tin công ty thành công!');
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
      
    } catch (err: any) {
      console.error('Failed to update company profile:', err);
      setError('Không thể cập nhật thông tin công ty. Vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data if needed
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
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Hồ sơ công ty</h1>
            <p className="text-gray-600">Quản lý thông tin và hình ảnh công ty</p>
          </div>
          <div className="flex space-x-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Chỉnh sửa
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Lưu thay đổi
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
        </div>
      )}

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

      <div className="space-y-6">
        {/* Company Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start space-x-6">
            <div className="relative">
              <img
                src={companyData.logo}
                alt={companyData.name}
                className="w-24 h-24 rounded-lg object-cover border-4 border-gray-200"
              />
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              )}
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{companyData.name}</h1>
                  <p className="text-gray-600 mb-2">{companyData.industry}</p>
                  <p className="text-gray-500 text-sm">{companyData.address}</p>
                </div>
                
                <div className="flex space-x-2">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Chỉnh sửa
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        {isSaving ? 'Đang lưu...' : 'Lưu'}
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Hủy
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Company Stats */}
              <div className="flex space-x-6 mt-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{companyService.formatFollowerCount(companyData.followerCount)}</div>
                  <div className="text-sm text-gray-500">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{companyData.jobCount}</div>
                  <div className="text-sm text-gray-500">Việc làm</div>
                </div>
                {companyData.rating > 0 && (
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <span className="text-2xl font-bold text-yellow-600">{companyData.rating.toFixed(1)}</span>
                      <svg className="w-5 h-5 text-yellow-400 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div className="text-sm text-gray-500">Đánh giá</div>
                  </div>
                )}
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-700">{companyData.size}</div>
                  <div className="text-sm text-gray-500">Quy mô</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cơ bản</h2>
          
          <div className="flex items-start space-x-6 mb-6">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src={companyData.logo}
                  alt="Company Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditing && (
                <button className="mt-2 text-sm text-blue-600 hover:text-blue-700">
                  Thay đổi logo
                </button>
              )}
            </div>
            
            {/* Company Name */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên công ty
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={companyData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
              ) : (
                <p className="text-xl font-semibold text-gray-900">{companyData.name}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lĩnh vực
              </label>
              {isEditing ? (
                <select
                  value={companyData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                >
                  <option value="Công nghệ thông tin">Công nghệ thông tin</option>
                  <option value="Tài chính/Ngân hàng">Tài chính/Ngân hàng</option>
                  <option value="Sản xuất">Sản xuất</option>
                  <option value="Dịch vụ">Dịch vụ</option>
                  <option value="Giáo dục">Giáo dục</option>
                  <option value="Y tế">Y tế</option>
                </select>
              ) : (
                <p className="text-gray-900">{companyData.industry}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quy mô
              </label>
              {isEditing ? (
                <select
                  value={companyData.size}
                  onChange={(e) => handleInputChange('size', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                >
                  <option value="1-10 nhân viên">1-10 nhân viên</option>
                  <option value="11-50 nhân viên">11-50 nhân viên</option>
                  <option value="51-100 nhân viên">51-100 nhân viên</option>
                  <option value="100-500 nhân viên">100-500 nhân viên</option>
                  <option value="500+ nhân viên">500+ nhân viên</option>
                </select>
              ) : (
                <p className="text-gray-900">{companyData.size}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Năm thành lập
              </label>
              {isEditing ? (
                <input
                  type="number"
                  value={companyData.founded}
                  onChange={(e) => handleInputChange('founded', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900">{companyData.founded}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              {isEditing ? (
                <input
                  type="url"
                  value={companyData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
              ) : (
                <a href={companyData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                  {companyData.website}
                </a>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ
            </label>
            {isEditing ? (
              <textarea
                value={companyData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900">{companyData.address}</p>
            )}
          </div>
        </div>

        {/* Company Description */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Giới thiệu công ty</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả công ty
              </label>
              {isEditing ? (
                <textarea
                  value={companyData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900 leading-relaxed">{companyData.description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sứ mệnh
              </label>
              {isEditing ? (
                <textarea
                  value={companyData.mission}
                  onChange={(e) => handleInputChange('mission', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900 leading-relaxed">{companyData.mission}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tầm nhìn
              </label>
              {isEditing ? (
                <textarea
                  value={companyData.vision}
                  onChange={(e) => handleInputChange('vision', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900 leading-relaxed">{companyData.vision}</p>
              )}
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Phúc lợi nhân viên</h2>
          
          {isEditing && (
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                placeholder="Thêm phúc lợi mới..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
              />
              <button
                onClick={addBenefit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Thêm
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {companyData.benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-900">{benefit}</span>
                </div>
                {isEditing && (
                  <button
                    onClick={() => removeBenefit(benefit)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Mạng xã hội</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facebook
              </label>
              {isEditing ? (
                <input
                  type="url"
                  value={companyData.socialLinks.facebook}
                  onChange={(e) => handleInputChange('socialLinks.facebook', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
              ) : (
                companyData.socialLinks.facebook ? (
                  <a href={companyData.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                    {companyData.socialLinks.facebook}
                  </a>
                ) : (
                  <p className="text-gray-500">Chưa cập nhật</p>
                )
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn
              </label>
              {isEditing ? (
                <input
                  type="url"
                  value={companyData.socialLinks.linkedin}
                  onChange={(e) => handleInputChange('socialLinks.linkedin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
              ) : (
                companyData.socialLinks.linkedin ? (
                  <a href={companyData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                    {companyData.socialLinks.linkedin}
                  </a>
                ) : (
                  <p className="text-gray-500">Chưa cập nhật</p>
                )
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twitter
              </label>
              {isEditing ? (
                <input
                  type="url"
                  value={companyData.socialLinks.twitter}
                  onChange={(e) => handleInputChange('socialLinks.twitter', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
              ) : (
                companyData.socialLinks.twitter ? (
                  <a href={companyData.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                    {companyData.socialLinks.twitter}
                  </a>
                ) : (
                  <p className="text-gray-500">Chưa cập nhật</p>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 
import React, { useState } from 'react';

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
}

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [companyData, setCompanyData] = useState<CompanyProfile>({
    name: 'TechCorp Vietnam',
    logo: 'https://via.placeholder.com/120x120',
    industry: 'Công nghệ thông tin',
    size: '100-500 nhân viên',
    founded: '2015',
    website: 'https://techcorp.vn',
    address: 'Tầng 10, Tòa nhà ABC, 123 Nguyễn Huệ, Quận 1, TP.HCM',
    description: 'TechCorp là một công ty công nghệ hàng đầu tại Việt Nam, chuyên phát triển các giải pháp phần mềm và ứng dụng di động. Chúng tôi cam kết mang đến những sản phẩm chất lượng cao và dịch vụ tốt nhất cho khách hàng.',
    mission: 'Tạo ra những giải pháp công nghệ tiên tiến, góp phần số hóa và hiện đại hóa doanh nghiệp Việt Nam.',
    vision: 'Trở thành công ty công nghệ số 1 Đông Nam Á về chất lượng sản phẩm và dịch vụ.',
    benefits: [
      'Lương thưởng cạnh tranh',
      'Bảo hiểm sức khỏe cao cấp',
      'Môi trường làm việc năng động',
      'Cơ hội thăng tiến rõ ràng',
      'Đào tạo và phát triển kỹ năng',
      'Du lịch công ty hàng năm'
    ],
    socialLinks: {
      facebook: 'https://facebook.com/techcorp',
      linkedin: 'https://linkedin.com/company/techcorp',
      twitter: 'https://twitter.com/techcorp'
    }
  });

  const [newBenefit, setNewBenefit] = useState('');

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

  const handleSave = () => {
    console.log('Saving company profile:', companyData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data if needed
  };

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

      <div className="space-y-6">
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
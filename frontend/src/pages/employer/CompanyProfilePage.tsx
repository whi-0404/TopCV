import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  BuildingOfficeIcon,
  GlobeAltIcon,
  UsersIcon,
  MapPinIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  CameraIcon,
  HomeIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  PhoneIcon,
  EnvelopeIcon,
  BuildingOffice2Icon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { 
  companyApi, 
  employerApi, 
  type CompanyResponse,
  type CompanyUpdateRequest,
  type FileUploadResponse
} from '../../services/api';

const CompanyProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [company, setCompany] = useState<CompanyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [formData, setFormData] = useState<CompanyUpdateRequest>({});
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth/employer/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const sidebarItems = [
    { icon: HomeIcon, label: 'Tổng quan', href: '/employer/dashboard' },
    { icon: BriefcaseIcon, label: 'Danh sách công việc', href: '/employer/jobs' },
    { icon: UsersIcon, label: 'Tất cả ứng viên', href: '/employer/candidates' },
    { icon: BuildingOfficeIcon, label: 'Hồ sơ công ty', active: true, href: '/employer/company' },
    { icon: Cog6ToothIcon, label: 'Cài đặt', href: '/employer/settings' },
    { icon: QuestionMarkCircleIcon, label: 'Trợ giúp', href: '/employer/help' }
  ];

  useEffect(() => {
    if (!user || user.role !== 'EMPLOYER') {
      navigate('/auth/employer/login');
      return;
    }
    
    fetchCompanyProfile();
  }, [user, navigate]);

  const fetchCompanyProfile = async () => {
    setLoading(true);
    try {
      // Use the new getMyCompany API endpoint
      console.log('Fetching company profile...');
      const response = await companyApi.getMyCompany();
      console.log('Company profile fetched:', response);
      
      const companyData = response.result;
      setCompany(companyData);
      setFormData({
        name: companyData.name,
        description: companyData.description,
        logo: companyData.logo,
        website: companyData.website,
        employeeRange: companyData.employeeRange,
        address: companyData.address
      });
      setError(''); // Clear any previous errors
    } catch (error: any) {
      console.error('Error fetching company:', error);
      if (error.response?.status === 404 || error.response?.data?.code === 1602) {
        console.log('Company not found, showing create form');
        setError('Chưa có thông tin công ty. Vui lòng tạo thông tin công ty trước.');
      } else {
        const errorMessage = error.response?.data?.message || error.message || 'Không thể tải thông tin công ty';
        setError('Không thể tải thông tin công ty: ' + errorMessage);
      }
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!company) return;
    
    setSaveLoading(true);
    try {
      const response = await companyApi.updateCompany(company.id, formData);
      setCompany(response.result);
      setEditing(false);
      alert('Cập nhật thông tin công ty thành công!');
    } catch (error: any) {
      alert('Lỗi khi cập nhật thông tin: ' + (error.response?.data?.message || error.message));
    }
    setSaveLoading(false);
  };

  const handleCancel = () => {
    if (company) {
      setFormData({
        name: company.name,
        description: company.description,
        logo: company.logo,
        website: company.website,
        employeeRange: company.employeeRange,
        address: company.address
      });
    }
    setEditing(false);
  };

  const handleCreateCompany = async () => {
    // Validate required fields
    if (!formData.name || formData.name.trim() === '') {
      alert('Vui lòng nhập tên công ty');
      return;
    }

    setSaveLoading(true);
    try {
      const requestData = {
        name: formData.name.trim(),
        description: formData.description || '',
        logo: formData.logo,
        website: formData.website,
        employeeRange: formData.employeeRange,
        address: formData.address
      };
      
      console.log('Creating company with data:', requestData);
      
      const response = await companyApi.createCompany(requestData);
      console.log('Company created successfully:', response);
      
      setCompany(response.result);
      setShowCreateForm(false);
      setError('');
      setFormData({}); // Clear form data
      alert('Tạo thông tin công ty thành công!');
    } catch (error: any) {
      console.error('Error creating company:', error);
      let errorMessage = 'Có lỗi xảy ra khi tạo công ty';
      
      if (error.response?.data?.code === 1606) {
        errorMessage = 'Bạn đã có công ty rồi. Không thể tạo thêm công ty mới.';
      } else if (error.response?.data?.code === 1601) {
        errorMessage = 'Tên công ty đã tồn tại. Vui lòng chọn tên khác.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert('Lỗi khi tạo công ty: ' + errorMessage);
    }
    setSaveLoading(false);
  };

  const handleLogoUpload = async (file: File) => {
    if (!company) {
      alert('Chưa có thông tin công ty');
      return;
    }

    setUploadingLogo(true);
    try {
      console.log('Uploading logo for company:', company.id);
      
      const response = await companyApi.uploadLogo(company.id, file);
      console.log('Logo uploaded successfully:', response);
      
      // Update company state with new logo
      setCompany(prev => prev ? {
        ...prev,
        logo: response.result.filePath
      } : null);
      
      alert('Tải lên logo thành công!');
    } catch (error: any) {
      console.error('Error uploading logo:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi tải lên logo';
      alert('Lỗi khi tải lên logo: ' + errorMessage);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      alert('Chỉ hỗ trợ file ảnh định dạng JPG, PNG, SVG');
      return;
    }

    // Validate file size (2MB max)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      alert('Kích thước file không được vượt quá 2MB');
      return;
    }

    setLogoFile(file);
    handleLogoUpload(file);
  };

  if (!user || user.role !== 'EMPLOYER') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Không có quyền truy cập</h1>
          <p className="text-gray-600">Bạn không có quyền truy cập trang này.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Fixed width và full height */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col fixed h-full z-10">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-xl font-bold text-gray-900">TopJob</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {sidebarItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    item.active
                      ? 'bg-emerald-50 text-emerald-700 border-r-2 border-emerald-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="flex-1">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile - Sticky at bottom */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <img
              src={user?.avt || `https://via.placeholder.com/40x40?text=${user?.fullname?.charAt(0) || 'E'}`}
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.fullname || 'Nhà tuyển dụng'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || 'email@example.com'}
              </p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header - 2 hàng như thiết kế */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          {/* Hàng 1: Company VNG + nút Đăng việc làm */}
          <div className="px-6 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
              {/* Company Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                <span className="text-sm text-gray-600">Company</span>
                  <span className="text-orange-600 font-medium">{company?.name || 'VNG'}</span>
                <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                </button>
                
                {/* Dropdown Menu */}
                {showCompanyDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                    <div className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold">{company?.name?.charAt(0) || 'V'}</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{company?.name || 'VNG Corporation'}</h3>
                          <p className="text-sm text-gray-500">Công ty hiện tại</p>
                        </div>
                      </div>
                      <div className="border-t border-gray-200 pt-3">
                        <Link
                          to="/employer/company"
                          className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                          onClick={() => setShowCompanyDropdown(false)}
                        >
                          Xem hồ sơ công ty
                        </Link>
                        <Link
                          to="/employer/settings"
                          className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                          onClick={() => setShowCompanyDropdown(false)}
                        >
                          Cài đặt công ty
                        </Link>
                        <button 
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                          onClick={() => setShowCompanyDropdown(false)}
                        >
                          Chuyển đổi công ty
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Post Job Button */}
              <Link
                to="/employer/jobs/create"
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
              >
                Đăng việc làm
              </Link>
            </div>
          </div>
          
          {/* Hàng 2: Title + Edit buttons */}
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Thông tin công ty</h1>
                <p className="text-gray-600 mt-1">Quản lý thông tin công ty của bạn</p>
            </div>
              {company && !editing ? (
                <button 
                  onClick={() => setEditing(true)}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 flex items-center space-x-2 z-20 shadow-lg"
                >
                  <PencilIcon className="h-5 w-5" />
                  <span>Chỉnh sửa</span>
                </button>
              ) : editing ? (
                <div className="flex space-x-2 z-20">
                  <button
                    onClick={handleCancel}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 flex items-center space-x-2 shadow-lg"
                  >
                    <XMarkIcon className="h-5 w-5" />
                    <span>Hủy</span>
                  </button>
            <button 
                    onClick={handleSave}
                    disabled={saveLoading}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 flex items-center space-x-2 shadow-lg"
            >
                    <CheckIcon className="h-5 w-5" />
                    <span>{saveLoading ? 'Đang lưu...' : 'Lưu'}</span>
            </button>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {loading && (
              <div className="bg-blue-50 border border-blue-200 text-blue-600 px-4 py-3 rounded-lg mb-6">
                Đang tải thông tin công ty...
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {company && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Company Card */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-center">
                      <div className="relative inline-block">
                        <div className="w-24 h-24 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                          {company.logo ? (
                            <>
                              <img
                                src={`http://localhost:8080/TopCV/uploads/${company.logo}`}
                                alt="Company Logo"
                                className="w-24 h-24 rounded-lg object-cover"
                                onLoad={() => console.log('Logo loaded successfully:', company.logo)}
                                onError={(e) => {
                                  console.error('Logo failed to load:', company.logo);
                                  console.error('Full URL:', `http://localhost:8080/TopCV/uploads/${company.logo}`);
                                  // Hide image and show fallback
                                  e.currentTarget.style.display = 'none';
                                  const fallback = document.getElementById('logo-fallback');
                                  if (fallback) {
                                    fallback.style.display = 'flex';
                                  }
                                }}
                              />
                              <div 
                                id="logo-fallback"
                                className="absolute inset-0 bg-emerald-100 rounded-lg flex items-center justify-center" 
                                style={{ display: 'none' }}
                              >
                                <BuildingOfficeIcon className="h-12 w-12 text-emerald-600" />
                              </div>
                            </>
                          ) : (
                            <BuildingOfficeIcon className="h-12 w-12 text-emerald-600" />
                          )}
                        </div>
                        <label htmlFor="logo-upload" className="absolute bottom-4 right-4 bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 cursor-pointer transition-colors">
                          {uploadingLogo ? (
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                          ) : (
                            <CameraIcon className="h-4 w-4" />
                          )}
                        </label>
                        <input
                          id="logo-upload"
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/svg+xml"
                          onChange={handleLogoChange}
                          className="hidden"
                          disabled={uploadingLogo}
                        />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{company.name}</h3>
                      <p className="text-gray-600 mt-2 text-sm line-clamp-3">{company.description}</p>
                    </div>

                    {/* Company Stats */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Tin tuyển dụng</span>
                          <span className="text-sm font-medium text-gray-900">{company.jobCount}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Người theo dõi</span>
                          <span className="text-sm font-medium text-gray-900">{company.followerCount}</span>
                      </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Quy mô</span>
                          <span className="text-sm font-medium text-gray-900">{company.employeeRange || 'Chưa cập nhật'}</span>
                      </div>
                      </div>
                    </div>

                    {/* Categories */}
                    {company.categories && company.categories.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Lĩnh vực</h4>
                        <div className="flex flex-wrap gap-2">
                          {company.categories.map((category) => (
                            <span 
                              key={category.id}
                              className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-0.5 rounded"
                            >
                              {category.name}
                            </span>
                          ))}
              </div>
            </div>
                    )}
                  </div>
                </div>

                {/* Company Details */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-6">Thông tin chi tiết</h4>
                    
                    <div className="space-y-6">
                      {/* Company Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tên công ty *
                        </label>
                        {editing ? (
                          <input
                            type="text"
                            value={formData.name || ''}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="Nhập tên công ty"
                            required
                          />
                        ) : (
                          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                            <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                            <span className="text-gray-900">{company.name}</span>
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
                            value={formData.website || ''}
                            onChange={(e) => setFormData({...formData, website: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="https://example.com"
                          />
                        ) : (
                          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                            <GlobeAltIcon className="h-5 w-5 text-gray-400" />
                            {company.website ? (
                              <a 
                                href={company.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-600 hover:text-emerald-700"
                              >
                                {company.website}
                              </a>
                            ) : (
                              <span className="text-gray-500">Chưa cập nhật</span>
                            )}
                      </div>
                        )}
                      </div>

                      {/* Employee Range */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quy mô nhân sự
                        </label>
                        {editing ? (
                          <select
                            value={formData.employeeRange || ''}
                            onChange={(e) => setFormData({...formData, employeeRange: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          >
                            <option value="">Chọn quy mô</option>
                            <option value="1-10">1-10 nhân viên</option>
                            <option value="11-50">11-50 nhân viên</option>
                            <option value="51-200">51-200 nhân viên</option>
                            <option value="201-500">201-500 nhân viên</option>
                            <option value="501-1000">501-1000 nhân viên</option>
                            <option value="1000+">Hơn 1000 nhân viên</option>
                          </select>
                        ) : (
                          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                            <UsersIcon className="h-5 w-5 text-gray-400" />
                            <span className="text-gray-900">{company.employeeRange || 'Chưa cập nhật'}</span>
                      </div>
                        )}
                      </div>

                      {/* Address */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Địa chỉ
                        </label>
                        {editing ? (
                          <textarea
                            value={formData.address || ''}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="Nhập địa chỉ công ty"
                          />
                        ) : (
                          <div className="flex items-start space-x-2 p-3 bg-gray-50 rounded-lg">
                            <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                            <span className="text-gray-900">{company.address || 'Chưa cập nhật'}</span>
                      </div>
                        )}
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mô tả công ty
                        </label>
                        {editing ? (
                          <textarea
                            value={formData.description || ''}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            rows={5}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="Nhập mô tả về công ty"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-gray-900 whitespace-pre-wrap">{company.description}</p>
                      </div>
                        )}
                  </div>
                </div>
              </div>

                  {/* Review Stats */}
                  {company.reviewStats && (
                    <div className="bg-white rounded-lg shadow p-6 mt-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Đánh giá từ nhân viên</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-emerald-600">{company.reviewStats.averageRating}</div>
                          <div className="text-sm text-gray-600">Điểm trung bình</div>
                    </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{company.reviewStats.totalReviews}</div>
                          <div className="text-sm text-gray-600">Lượt đánh giá</div>
                    </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{company.reviewStats.recommendationRate}%</div>
                          <div className="text-sm text-gray-600">Tỷ lệ khuyến nghị</div>
                      </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!loading && !company && (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có thông tin công ty</h3>
                <p className="text-gray-600 mb-6">
                  Để quản lý tin tuyển dụng, bạn cần thiết lập thông tin công ty trước.
                </p>
                
                {!showCreateForm ? (
                  <button 
                    onClick={() => setShowCreateForm(true)}
                    className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700"
                  >
                    Tạo thông tin công ty
                  </button>
                ) : (
                  <div className="max-w-2xl mx-auto text-left">
                    <h4 className="text-lg font-semibold text-gray-900 mb-6">Thông tin công ty</h4>
                    
                    <div className="space-y-6">
                      {/* Company Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tên công ty *
                        </label>
                        <input
                          type="text"
                          value={formData.name || ''}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="Nhập tên công ty"
                          required
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mô tả công ty
                        </label>
                        <textarea
                          value={formData.description || ''}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="Nhập mô tả về công ty"
                        />
                      </div>

                      {/* Website */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Website
                        </label>
                        <input
                          type="url"
                          value={formData.website || ''}
                          onChange={(e) => setFormData({...formData, website: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="https://example.com"
                        />
                      </div>

                      {/* Employee Range */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quy mô nhân sự
                        </label>
                        <select
                          value={formData.employeeRange || ''}
                          onChange={(e) => setFormData({...formData, employeeRange: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        >
                          <option value="">Chọn quy mô</option>
                          <option value="1-10">1-10 nhân viên</option>
                          <option value="11-50">11-50 nhân viên</option>
                          <option value="51-200">51-200 nhân viên</option>
                          <option value="201-500">201-500 nhân viên</option>
                          <option value="501-1000">501-1000 nhân viên</option>
                          <option value="1000+">Hơn 1000 nhân viên</option>
                        </select>
                      </div>

                      {/* Address */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Địa chỉ
                        </label>
                        <textarea
                          value={formData.address || ''}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="Nhập địa chỉ công ty"
                        />
                      </div>

                      {/* Buttons */}
                      <div className="flex space-x-4 justify-center">
                        <button
                          onClick={() => {
                            setShowCreateForm(false);
                            setFormData({});
                          }}
                          className="bg-gray-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700"
                        >
                          Hủy
                        </button>
                        <button
                          onClick={handleCreateCompany}
                          disabled={saveLoading || !formData.name}
                          className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50"
                        >
                          {saveLoading ? 'Đang tạo...' : 'Tạo công ty'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfilePage; 
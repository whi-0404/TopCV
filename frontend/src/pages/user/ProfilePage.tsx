import React, { useState, useEffect } from 'react';
import { 
  HomeIcon,
  UserIcon,
  BriefcaseIcon,
  HeartIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  PencilIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { userApi, type UserResponse, type UserUpdateRequest } from '../../services/api';

const ProfilePage: React.FC = () => {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [formData, setFormData] = useState<UserUpdateRequest>({});

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await userApi.getMyInfo();
      setUserProfile(response.result);
      setFormData({
        userName: response.result.userName,
        fullName: response.result.fullname,
        phone: response.result.phone,
        address: response.result.address,
        dob: response.result.dob
      });
    } catch (error: any) {
      setError('Không thể tải thông tin cá nhân');
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      // Format date to LocalDateTime format for backend
      const formattedData = {
        ...formData,
        dob: formData.dob ? (
          // Nếu đã có datetime format thì giữ nguyên, không thì thêm time
          formData.dob.includes('T') ? formData.dob : `${formData.dob}T00:00:00`
        ) : undefined
      };
      
      console.log('Sending update data:', formattedData);
      
      const response = await userApi.updateProfile(formattedData);
      setUserProfile(response.result);
      
      // Update auth context
      const updatedUser = {
        ...user!,
        userName: response.result.userName,
        fullname: response.result.fullname,
        phone: response.result.phone,
        address: response.result.address,
        dob: response.result.dob
      };
      setUser(updatedUser);
      
      setIsEditing(false);
      alert('Cập nhật thông tin thành công!');
    } catch (error: any) {
      console.error('Update profile error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra';
      alert('Lỗi khi cập nhật thông tin: ' + errorMessage);
    }
    setSaveLoading(false);
  };

  const handleCancel = () => {
    setFormData({
      userName: userProfile?.userName,
      fullName: userProfile?.fullname,
      phone: userProfile?.phone,
      address: userProfile?.address,
      dob: userProfile?.dob
    });
    setIsEditing(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Chưa cập nhật';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const sidebarItems = [
    { icon: HomeIcon, label: 'Tổng quan', active: false, href: '/user/dashboard' },
    { icon: BriefcaseIcon, label: 'Công việc đã ứng tuyển', href: '/user/applications' },
    { icon: HeartIcon, label: 'Công việc yêu thích', href: '/user/favorites' },
    { icon: UserCircleIcon, label: 'Trang cá nhân', active: true, href: '/user/profile' },
    { icon: Cog6ToothIcon, label: 'Cài đặt', href: '/user/settings' },
    { icon: QuestionMarkCircleIcon, label: 'Trợ giúp', href: '/user/help' }
  ];

  if (!user || user.role !== 'USER') {
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
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
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
        <nav className="flex-1 p-4">
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
        <div className="sticky bottom-0 bg-white p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              {userProfile?.avt ? (
                <img src={userProfile.avt} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <UserIcon className="h-6 w-6 text-emerald-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userProfile?.fullname || user?.fullname}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {userProfile?.email || user?.email}
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
      <div className="flex-1">
        {/* Header with background */}
        <div className="relative h-48 bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-400">
          <div className="absolute top-6 right-6 z-10">
                         <Link
               to="/"
               className="px-4 py-2 border border-white text-white rounded-lg text-sm font-medium hover:bg-white hover:text-gray-900 transition-colors"
             >
               Quay lại trang chủ
             </Link>
          </div>
          <div className="absolute bottom-6 left-6 z-20">
            {!isEditing ? (
            <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-lg"
            >
              <PencilIcon className="h-4 w-4" />
              <span>Chỉnh sửa</span>
            </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors shadow-lg"
                >
                  <XMarkIcon className="h-4 w-4" />
                  <span>Hủy</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={saveLoading}
                  className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-lg"
                >
                  <CheckIcon className="h-4 w-4" />
                  <span>{saveLoading ? 'Đang lưu...' : 'Lưu'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="px-8 pb-8">
          {/* Profile Header */}
          <div className="relative -mt-16 mb-8 z-10">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {loading && (
                <div className="bg-blue-50 border border-blue-200 text-blue-600 px-4 py-3 rounded-lg mb-6">
                  Đang tải thông tin cá nhân...
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              {userProfile && (
              <div className="flex items-start space-x-6">
                <div className="relative">
                    <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center">
                      {userProfile.avt ? (
                        <img
                          src={userProfile.avt}
                          alt="Avatar"
                          className="w-32 h-32 rounded-full object-cover border-4 border-white"
                        />
                      ) : (
                        <UserIcon className="h-16 w-16 text-emerald-600" />
                      )}
                    </div>
                    {userProfile.isEmailVerified && (
                    <div className="absolute bottom-2 right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                      <h1 className="text-2xl font-bold text-gray-900">{userProfile.fullname}</h1>
                    <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
                      ĐANG TÌM VIỆC
                    </button>
                  </div>
                    <p className="text-gray-600 mb-2">{userProfile.email}</p>
                  <div className="flex items-center space-x-1 text-gray-500 mb-4">
                    <MapPinIcon className="h-4 w-4" />
                      <span>{userProfile.address || 'Chưa cập nhật địa chỉ'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {userProfile && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Profile Details */}
              <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-6">Thông tin chi tiết</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Username */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên đăng nhập
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.userName || ''}
                          onChange={(e) => setFormData({...formData, userName: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="Nhập tên đăng nhập"
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                          <UserIcon className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-900">{userProfile.userName || 'Chưa cập nhật'}</span>
                        </div>
                      )}
              </div>

                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Họ và tên
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.fullName || ''}
                          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="Nhập họ và tên"
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                          <UserIcon className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-900">{userProfile.fullname}</span>
                        </div>
                      )}
              </div>

                    {/* Email (read-only) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-900">{userProfile.email}</span>
              </div>
            </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={formData.phone || ''}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="Nhập số điện thoại"
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                          <PhoneIcon className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-900">{userProfile.phone || 'Chưa cập nhật'}</span>
                        </div>
                      )}
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày sinh
                      </label>
                      {isEditing ? (
                        <input
                          type="date"
                          value={formData.dob ? (
                            formData.dob.includes('T') ? formData.dob.split('T')[0] : formData.dob
                          ) : ''}
                          onChange={(e) => setFormData({...formData, dob: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                          <CalendarIcon className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-900">{formatDate(userProfile.dob)}</span>
                        </div>
                      )}
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Địa chỉ
                      </label>
                      {isEditing ? (
                        <textarea
                          value={formData.address || ''}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="Nhập địa chỉ"
                        />
                      ) : (
                        <div className="flex items-start space-x-2 p-3 bg-gray-50 rounded-lg">
                          <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                          <span className="text-gray-900">{userProfile.address || 'Chưa cập nhật'}</span>
                  </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Account Status */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Trạng thái tài khoản</h4>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Email xác thực</span>
                      <span className={`text-sm font-medium ${
                        userProfile.isEmailVerified ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {userProfile.isEmailVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Tài khoản</span>
                      <span className={`text-sm font-medium ${
                        userProfile.isActive ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {userProfile.isActive ? 'Hoạt động' : 'Bị khóa'}
                      </span>
                    </div>
                  </div>
                    </div>

                {/* Account Information */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Thông tin tài khoản</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-600">Ngày tạo tài khoản:</span>
                      <div className="font-medium text-gray-900">
                        {new Date(userProfile.createdAt).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Cập nhật lần cuối:</span>
                      <div className="font-medium text-gray-900">
                        {new Date(userProfile.updatedAt).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
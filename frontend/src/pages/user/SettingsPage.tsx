import React, { useState, useEffect } from 'react';
import { 
  HomeIcon,
  BriefcaseIcon,
  HeartIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  EyeIcon,
  KeyIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  userApi,
  type UserResponse,
  type ChangePasswordRequest
} from '../../services/api';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // API Data States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState<UserResponse | null>(null);
  
  // Password Change States
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Settings States
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    jobAlerts: true,
    marketingEmails: false
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowCompanyContact: true
  });

  const sidebarItems = [
    { icon: HomeIcon, label: 'Tổng quan', active: false, href: '/user/dashboard' },
    { icon: BriefcaseIcon, label: 'Công việc đã ứng tuyển', href: '/user/applications' },
    { icon: HeartIcon, label: 'Công việc yêu thích', href: '/user/favorites' },
    { icon: UserCircleIcon, label: 'Trang cá nhân', href: '/user/profile' },
    { icon: Cog6ToothIcon, label: 'Cài đặt', active: true, href: '/user/settings' },
    { icon: QuestionMarkCircleIcon, label: 'Trợ giúp', href: '/user/help' }
  ];

  useEffect(() => {
    if (!user || user.role !== 'USER') {
      navigate('/auth/login');
      return;
    }
    
    fetchUserInfo();
  }, [user, navigate]);

  const fetchUserInfo = async () => {
    setLoading(true);
    try {
      const response = await userApi.getMyInfo();
      if (response.code === 1000 && response.result) {
        setUserInfo(response.result);
      }
    } catch (err) {
      console.error('Error fetching user info:', err);
      setError('Không thể tải thông tin người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setPasswordError('');
    setPasswordSuccess(false);
    
    // Validation
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('Vui lòng điền đầy đủ thông tin');
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Mật khẩu mới và xác nhận không khớp');
      return;
    }
    
    if (passwordForm.newPassword.length < 8) {
      setPasswordError('Mật khẩu phải có ít nhất 8 ký tự');
      return;
    }
    
    setPasswordLoading(true);
    
    try {
      const changePasswordData: ChangePasswordRequest = {
        oldPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      };
      
      const response = await userApi.changePassword(changePasswordData);
      
      if (response.code === 1000) {
        setPasswordSuccess(true);
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setTimeout(() => setPasswordSuccess(false), 3000);
      }
    } catch (error: any) {
      console.error('Error changing password:', error);
      if (error.response?.data?.message) {
        setPasswordError(error.response.data.message);
      } else {
        setPasswordError('Không thể thay đổi mật khẩu. Vui lòng thử lại.');
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    // TODO: Call API to save notification preferences
  };

  const handlePrivacyChange = (key: string, value: string | boolean) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
    // TODO: Call API to save privacy preferences
  };

  const handlePasswordFormChange = (field: string, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
    setPasswordError(''); // Clear error when user starts typing
  };

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
            <img
              src={userInfo?.avt || `https://via.placeholder.com/40x40?text=${userInfo?.fullname?.charAt(0) || 'U'}`}
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userInfo?.fullname || 'Người dùng'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {userInfo?.email || 'email@example.com'}
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
      <div className="flex-1 p-8">
        {/* Loading State */}
        {loading && (
          <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-600 px-4 py-3 rounded-lg">
            Đang tải dữ liệu...
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cài đặt</h1>
            <p className="text-gray-600 mt-1">Quản lý tài khoản và tùy chọn ứng dụng của bạn</p>
          </div>
          <Link
            to="/"
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Quay lại trang chủ
          </Link>
        </div>

        <div className="max-w-4xl space-y-6">
          {/* Change Password */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <KeyIcon className="h-6 w-6 text-emerald-600" />
              <h2 className="text-lg font-semibold text-gray-900">Đổi mật khẩu</h2>
            </div>

            {/* Password Success Message */}
            {passwordSuccess && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg flex items-center">
                <CheckIcon className="h-5 w-5 mr-2" />
                Mật khẩu đã được cập nhật thành công!
              </div>
            )}

            {/* Password Error Message */}
            {passwordError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {passwordError}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => handlePasswordFormChange('currentPassword', e.target.value)}
                  placeholder="Nhập mật khẩu hiện tại"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  disabled={passwordLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => handlePasswordFormChange('newPassword', e.target.value)}
                  placeholder="Nhập mật khẩu mới"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  disabled={passwordLoading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => handlePasswordFormChange('confirmPassword', e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  disabled={passwordLoading}
                />
            </div>
            <div className="mt-6 flex justify-end">
                <button 
                  type="submit"
                  disabled={passwordLoading}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {passwordLoading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
              </button>
            </div>
            </form>
          </div>

          {/* Security */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <ShieldCheckIcon className="h-6 w-6 text-emerald-600" />
              <h2 className="text-lg font-semibold text-gray-900">Bảo mật</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <KeyIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <h3 className="font-medium text-gray-900">Đổi mật khẩu</h3>
                    <p className="text-sm text-gray-500">Cập nhật mật khẩu để bảo mật tài khoản</p>
                  </div>
                </div>
                <button className="px-3 py-1 text-emerald-600 hover:bg-emerald-50 rounded text-sm font-medium">
                  Thay đổi
                </button>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <DevicePhoneMobileIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <h3 className="font-medium text-gray-900">Xác thực 2 yếu tố</h3>
                    <p className="text-sm text-gray-500">Thêm lớp bảo mật bổ sung cho tài khoản</p>
                  </div>
                </div>
                <button className="px-3 py-1 text-emerald-600 hover:bg-emerald-50 rounded text-sm font-medium">
                  Kích hoạt
                </button>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-3">
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <h3 className="font-medium text-gray-900">Phiên đăng nhập</h3>
                    <p className="text-sm text-gray-500">Xem và quản lý các phiên đăng nhập</p>
                  </div>
                </div>
                <button className="px-3 py-1 text-emerald-600 hover:bg-emerald-50 rounded text-sm font-medium">
                  Quản lý
                </button>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <BellIcon className="h-6 w-6 text-emerald-600" />
              <h2 className="text-lg font-semibold text-gray-900">Thông báo</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Email thông báo</h3>
                  <p className="text-sm text-gray-500">Nhận thông báo qua email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={(e) => handleNotificationChange('email', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Thông báo đẩy</h3>
                  <p className="text-sm text-gray-500">Nhận thông báo trên trình duyệt</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.push}
                    onChange={(e) => handleNotificationChange('push', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">SMS</h3>
                  <p className="text-sm text-gray-500">Nhận tin nhắn thông báo</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.sms}
                    onChange={(e) => handleNotificationChange('sms', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Thông báo việc làm</h3>
                  <p className="text-sm text-gray-500">Cơ hội việc làm phù hợp</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.jobAlerts}
                    onChange={(e) => handleNotificationChange('jobAlerts', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Email marketing</h3>
                  <p className="text-sm text-gray-500">Tin tức và khuyến mãi</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.marketingEmails}
                    onChange={(e) => handleNotificationChange('marketingEmails', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <EyeIcon className="h-6 w-6 text-emerald-600" />
              <h2 className="text-lg font-semibold text-gray-900">Quyền riêng tư</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hiển thị hồ sơ
                </label>
                <select
                  value={privacy.profileVisibility}
                  onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                >
                  <option value="public">Công khai</option>
                  <option value="limited">Hạn chế</option>
                  <option value="private">Riêng tư</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Hiển thị email</h3>
                  <p className="text-sm text-gray-500">Cho phép nhà tuyển dụng xem email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacy.showEmail}
                    onChange={(e) => handlePrivacyChange('showEmail', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Hiển thị số điện thoại</h3>
                  <p className="text-sm text-gray-500">Cho phép nhà tuyển dụng xem SĐT</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacy.showPhone}
                    onChange={(e) => handlePrivacyChange('showPhone', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Cho phép công ty liên hệ</h3>
                  <p className="text-sm text-gray-500">Nhận lời mời từ nhà tuyển dụng</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacy.allowCompanyContact}
                    onChange={(e) => handlePrivacyChange('allowCompanyContact', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Language & Region */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <GlobeAltIcon className="h-6 w-6 text-emerald-600" />
              <h2 className="text-lg font-semibold text-gray-900">Ngôn ngữ & Khu vực</h2>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngôn ngữ hiển thị
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                  <option>Tiếng Việt</option>
                  <option>English</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Múi giờ
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                  <option>GMT+7 (Việt Nam)</option>
                  <option>GMT+0 (UTC)</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                Lưu cài đặt
              </button>
            </div>
          </div>

          {/* Delete Account */}
          <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-sm">⚠</span>
              </div>
              <h2 className="text-lg font-semibold text-red-900">Khu vực nguy hiểm</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Xóa tài khoản sẽ loại bỏ vĩnh viễn tất cả dữ liệu của bạn. Hành động này không thể hoàn tác.
            </p>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Xóa tài khoản
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
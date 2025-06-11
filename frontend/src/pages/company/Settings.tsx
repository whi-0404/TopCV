import React, { useState } from 'react';

const Settings: React.FC = () => {
  const [notifications, setNotifications] = useState({
    newApplication: true,
    candidateMessage: true,
    jobExpiring: true,
    weeklyReport: false,
    monthlyReport: true,
  });

  const [recruitment, setRecruitment] = useState({
    autoReply: true,
    requireCoverLetter: false,
    allowMultipleApplications: true,
    showSalary: true,
    showCompanyInfo: true,
  });

  const [billing, setBilling] = useState({
    plan: 'premium',
    nextBillingDate: '2025-02-20',
    autoRenew: true,
  });

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleRecruitmentChange = (key: keyof typeof recruitment) => {
    setRecruitment(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleBillingChange = (key: keyof typeof billing, value: any) => {
    setBilling(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Cài đặt công ty</h1>
        <p className="text-gray-600">Quản lý cài đặt tài khoản và tuyển dụng</p>
      </div>

      <div className="space-y-6">
        {/* Account Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin tài khoản</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email đăng nhập
              </label>
              <input
                type="email"
                defaultValue="hr@techcorp.vn"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Người liên hệ
              </label>
              <input
                type="text"
                defaultValue="Nguyễn Văn A"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại
              </label>
              <input
                type="tel"
                defaultValue="0123456789"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chức vụ
              </label>
              <input
                type="text"
                defaultValue="HR Manager"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="mt-6">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Cập nhật thông tin
            </button>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Đổi mật khẩu</h2>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu hiện tại
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu mới
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Xác nhận mật khẩu mới
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Đổi mật khẩu
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Cài đặt thông báo</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Ứng viên mới ứng tuyển</p>
                <p className="text-sm text-gray-500">Nhận thông báo khi có ứng viên ứng tuyển</p>
              </div>
              <button
                onClick={() => handleNotificationChange('newApplication')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.newApplication ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.newApplication ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Tin nhắn từ ứng viên</p>
                <p className="text-sm text-gray-500">Nhận thông báo khi ứng viên gửi tin nhắn</p>
              </div>
              <button
                onClick={() => handleNotificationChange('candidateMessage')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.candidateMessage ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.candidateMessage ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Tin tuyển dụng sắp hết hạn</p>
                <p className="text-sm text-gray-500">Nhận thông báo trước 3 ngày khi tin hết hạn</p>
              </div>
              <button
                onClick={() => handleNotificationChange('jobExpiring')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.jobExpiring ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.jobExpiring ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Báo cáo hàng tuần</p>
                <p className="text-sm text-gray-500">Nhận báo cáo thống kê hàng tuần</p>
              </div>
              <button
                onClick={() => handleNotificationChange('weeklyReport')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.weeklyReport ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.weeklyReport ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Báo cáo hàng tháng</p>
                <p className="text-sm text-gray-500">Nhận báo cáo chi tiết hàng tháng</p>
              </div>
              <button
                onClick={() => handleNotificationChange('monthlyReport')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.monthlyReport ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.monthlyReport ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Recruitment Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Cài đặt tuyển dụng</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Trả lời tự động</p>
                <p className="text-sm text-gray-500">Gửi email xác nhận khi nhận được đơn ứng tuyển</p>
              </div>
              <button
                onClick={() => handleRecruitmentChange('autoReply')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  recruitment.autoReply ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    recruitment.autoReply ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Yêu cầu thư xin việc</p>
                <p className="text-sm text-gray-500">Bắt buộc ứng viên phải có thư xin việc</p>
              </div>
              <button
                onClick={() => handleRecruitmentChange('requireCoverLetter')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  recruitment.requireCoverLetter ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    recruitment.requireCoverLetter ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Cho phép ứng tuyển nhiều lần</p>
                <p className="text-sm text-gray-500">Ứng viên có thể ứng tuyển lại sau khi bị từ chối</p>
              </div>
              <button
                onClick={() => handleRecruitmentChange('allowMultipleApplications')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  recruitment.allowMultipleApplications ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    recruitment.allowMultipleApplications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Hiển thị mức lương</p>
                <p className="text-sm text-gray-500">Cho phép hiển thị mức lương trong tin tuyển dụng</p>
              </div>
              <button
                onClick={() => handleRecruitmentChange('showSalary')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  recruitment.showSalary ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    recruitment.showSalary ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Hiển thị thông tin công ty</p>
                <p className="text-sm text-gray-500">Cho phép ứng viên xem thông tin chi tiết công ty</p>
              </div>
              <button
                onClick={() => handleRecruitmentChange('showCompanyInfo')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  recruitment.showCompanyInfo ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    recruitment.showCompanyInfo ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Billing Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Thanh toán & Gói dịch vụ</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-3">Gói hiện tại</h3>
              <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-blue-900">Gói Premium</h4>
                    <p className="text-sm text-blue-700">50 tin tuyển dụng/tháng, Hỗ trợ 24/7</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-900">999,000₫</p>
                    <p className="text-sm text-blue-700">/ tháng</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày thanh toán tiếp theo
                </label>
                <input
                  type="date"
                  value={billing.nextBillingDate}
                  onChange={(e) => handleBillingChange('nextBillingDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  disabled
                />
              </div>

              <div className="flex items-center">
                <div>
                  <p className="text-sm font-medium text-gray-700">Tự động gia hạn</p>
                  <p className="text-sm text-gray-500">Tự động thanh toán khi hết hạn</p>
                </div>
                <button
                  onClick={() => handleBillingChange('autoRenew', !billing.autoRenew)}
                  className={`ml-4 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    billing.autoRenew ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      billing.autoRenew ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Nâng cấp gói
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                Xem lịch sử thanh toán
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-red-200">
          <h2 className="text-lg font-semibold text-red-900 mb-4">Khu vực nguy hiểm</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-2">Hủy gói dịch vụ</h3>
              <p className="text-sm text-gray-600 mb-4">
                Hủy gói dịch vụ hiện tại. Bạn vẫn có thể sử dụng dịch vụ đến hết kỳ đã thanh toán.
              </p>
              <button className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 transition-colors">
                Hủy gói dịch vụ
              </button>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-md font-medium text-gray-900 mb-2">Xóa tài khoản</h3>
              <p className="text-sm text-gray-600 mb-4">
                Xóa vĩnh viễn tài khoản và tất cả dữ liệu liên quan. Hành động này không thể hoàn tác.
              </p>
              <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                Xóa tài khoản
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 
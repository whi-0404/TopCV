import React from 'react';
import { Link } from 'react-router-dom';

const CompanyDashboard: React.FC = () => {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 6);

  // Dữ liệu mẫu cho thống kê
  const stats = [
    {
      id: 1,
      name: 'Số ứng viên mới',
      value: '36',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      bgColor: 'bg-emerald-600',
    },
    {
      id: 2,
      name: 'Lịch phỏng vấn hôm nay',
      value: '3',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      bgColor: 'bg-blue-600',
    },
    {
      id: 3,
      name: 'Tin nhắn đã nhận',
      value: '24',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      bgColor: 'bg-orange-500',
    },
  ];

  // Dữ liệu mẫu cho công việc đang tuyển
  const openJobs = [
    {
      id: 1,
      title: 'Frontend Developer',
      location: 'Hà Nội',
      type: 'Full-Time',
      applicants: 15,
      capacity: 20,
      tags: ['React', 'TypeScript'],
    },
    {
      id: 2,
      title: 'Backend Developer',
      location: 'TP.HCM',
      type: 'Full-Time',
      applicants: 8,
      capacity: 10,
      tags: ['Node.js', 'MongoDB'],
    },
    {
      id: 3,
      title: 'UI/UX Designer',
      location: 'Remote',
      type: 'Part-Time',
      applicants: 12,
      capacity: 15,
      tags: ['Figma', 'Adobe XD'],
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Xin chào, Công ty ABC</h1>
          <div className="text-sm text-gray-500">
            {startDate.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric' })} - {endDate.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric' })}
          </div>
        </div>
        <div>
          <Link 
            to="/company/jobs/new" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Đăng việc làm mới
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex items-center">
                <div className={`${stat.bgColor} rounded-md p-3 mr-4`}>
                  {stat.icon}
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.name}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Jobs */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Công việc đang tuyển</h2>
            <Link to="/company/jobs" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Xem tất cả
            </Link>
          </div>
          
          <div className="space-y-4">
            {openJobs.map((job) => (
              <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-600">{job.location} • {job.type}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {job.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Ứng viên</div>
                    <div className="text-lg font-medium">
                      {job.applicants}/{job.capacity}
                    </div>
                    <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(job.applicants / job.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Thao tác nhanh</h3>
          <div className="space-y-3">
            <Link
              to="/company/jobs/new"
              className="flex items-center p-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <svg className="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Đăng tin tuyển dụng mới
            </Link>
            <Link
              to="/company/candidates"
              className="flex items-center p-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <svg className="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Xem danh sách ứng viên
            </Link>
            <Link
              to="/company/messages"
              className="flex items-center p-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <svg className="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Kiểm tra tin nhắn mới
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Thống kê nhanh</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Tổng tin đăng</span>
              <span className="text-sm font-medium">12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Tin đang hoạt động</span>
              <span className="text-sm font-medium">8</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Tổng ứng viên</span>
              <span className="text-sm font-medium">156</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Ứng viên mới tuần này</span>
              <span className="text-sm font-medium text-green-600">+23</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard; 
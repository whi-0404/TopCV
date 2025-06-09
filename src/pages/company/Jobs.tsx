import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CompanyJobs: React.FC = () => {
  const [filter, setFilter] = useState('all');

  const jobs = [
    {
      id: 1,
      title: 'Frontend Developer',
      location: 'Hà Nội',
      type: 'Full-Time',
      salary: '$2000 - $3000',
      applicants: 15,
      status: 'active',
      postedDate: '2025-01-15',
      tags: ['React', 'TypeScript', 'CSS']
    },
    {
      id: 2,
      title: 'Backend Developer',
      location: 'TP.HCM',
      type: 'Full-Time',
      salary: '$2500 - $3500',
      applicants: 8,
      status: 'active',
      postedDate: '2025-01-10',
      tags: ['Node.js', 'MongoDB', 'Express']
    },
    {
      id: 3,
      title: 'UI/UX Designer',
      location: 'Remote',
      type: 'Part-Time',
      salary: '$1500 - $2000',
      applicants: 12,
      status: 'paused',
      postedDate: '2025-01-05',
      tags: ['Figma', 'Adobe XD', 'Sketch']
    },
    {
      id: 4,
      title: 'DevOps Engineer',
      location: 'Đà Nẵng',
      type: 'Full-Time',
      salary: '$3000 - $4000',
      applicants: 5,
      status: 'closed',
      postedDate: '2024-12-20',
      tags: ['AWS', 'Docker', 'Kubernetes']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Đang tuyển';
      case 'paused':
        return 'Tạm dừng';
      case 'closed':
        return 'Đã đóng';
      default:
        return status;
    }
  };

  const filteredJobs = filter === 'all' 
    ? jobs 
    : jobs.filter(job => job.status === filter);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Quản lý tin tuyển dụng</h1>
          <p className="text-gray-600">Quản lý và theo dõi các tin tuyển dụng của công ty</p>
        </div>
        <Link
          to="/company/jobs/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Đăng tin mới
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { key: 'all', label: 'Tất cả', count: jobs.length },
              { key: 'active', label: 'Đang tuyển', count: jobs.filter(j => j.status === 'active').length },
              { key: 'paused', label: 'Tạm dừng', count: jobs.filter(j => j.status === 'paused').length },
              { key: 'closed', label: 'Đã đóng', count: jobs.filter(j => j.status === 'closed').length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  filter === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Jobs List */}
      <div className="bg-white rounded-lg shadow-sm">
        {filteredJobs.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có tin tuyển dụng</h3>
            <p className="mt-1 text-sm text-gray-500">Bắt đầu bằng cách đăng tin tuyển dụng đầu tiên.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredJobs.map((job) => (
              <div key={job.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                        {getStatusText(job.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {job.location} • {job.type} • {job.salary}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {job.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Đăng ngày: {new Date(job.postedDate).toLocaleDateString('vi-VN')} • {job.applicants} ứng viên
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{job.applicants}</div>
                      <div className="text-sm text-gray-500">ứng viên</div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <button className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        Xem ứng viên
                      </button>
                      <button className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        Chỉnh sửa
                      </button>
                    </div>
                    <div className="relative">
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyJobs; 
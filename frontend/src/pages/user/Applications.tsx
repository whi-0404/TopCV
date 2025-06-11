import React, { useState } from 'react';

const Applications: React.FC = () => {
  const [filter, setFilter] = useState('all');

  const applications = [
    {
      id: 1,
      title: 'Frontend Developer',
      company: 'Tech Corp',
      location: 'Hà Nội, Việt Nam',
      type: 'Full-Time',
      appliedDate: '2025-01-15',
      status: 'pending',
      salary: '$2000 - $3000'
    },
    {
      id: 2,
      title: 'React Developer',
      company: 'Startup XYZ',
      location: 'TP.HCM, Việt Nam',
      type: 'Remote',
      appliedDate: '2025-01-10',
      status: 'interview',
      salary: '$1800 - $2500'
    },
    {
      id: 3,
      title: 'Full Stack Developer',
      company: 'BigTech Inc',
      location: 'Đà Nẵng, Việt Nam',
      type: 'Full-Time',
      appliedDate: '2025-01-05',
      status: 'rejected',
      salary: '$2500 - $3500'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'interview':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Đang xem xét';
      case 'interview':
        return 'Phỏng vấn';
      case 'accepted':
        return 'Được chấp nhận';
      case 'rejected':
        return 'Bị từ chối';
      default:
        return status;
    }
  };

  const filteredApplications = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status === filter);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Công việc đã ứng tuyển</h1>
        <p className="text-gray-600">Quản lý và theo dõi trạng thái các đơn ứng tuyển của bạn</p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { key: 'all', label: 'Tất cả', count: applications.length },
              { key: 'pending', label: 'Đang xem xét', count: applications.filter(a => a.status === 'pending').length },
              { key: 'interview', label: 'Phỏng vấn', count: applications.filter(a => a.status === 'interview').length },
              { key: 'accepted', label: 'Được chấp nhận', count: applications.filter(a => a.status === 'accepted').length },
              { key: 'rejected', label: 'Bị từ chối', count: applications.filter(a => a.status === 'rejected').length }
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

      {/* Applications List */}
      <div className="bg-white rounded-lg shadow-sm">
        {filteredApplications.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Không có đơn ứng tuyển</h3>
            <p className="mt-1 text-sm text-gray-500">Bạn chưa ứng tuyển công việc nào.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredApplications.map((application) => (
              <div key={application.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 font-semibold">
                        {application.company.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{application.title}</h3>
                      <p className="text-sm text-gray-600">
                        {application.company} • {application.location} • {application.type}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Lương: {application.salary} • Ứng tuyển: {new Date(application.appliedDate).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                      {getStatusText(application.status)}
                    </span>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
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

export default Applications; 
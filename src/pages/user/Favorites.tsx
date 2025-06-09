import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Favorites: React.FC = () => {
  const [favorites] = useState([
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
      location: 'Hà Nội',
      type: 'Full-time',
      salary: '$3000 - $4000',
      savedDate: '2025-01-20',
      tags: ['React', 'TypeScript', 'Node.js']
    },
    {
      id: 2,
      title: 'Full Stack Developer',
      company: 'StartupXYZ',
      location: 'TP.HCM',
      type: 'Remote',
      salary: '$2500 - $3500',
      savedDate: '2025-01-18',
      tags: ['JavaScript', 'Python', 'AWS']
    },
    {
      id: 3,
      title: 'React Native Developer',
      company: 'MobileFirst',
      location: 'Đà Nẵng',
      type: 'Hybrid',
      salary: '$2000 - $3000',
      savedDate: '2025-01-15',
      tags: ['React Native', 'iOS', 'Android']
    }
  ]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Công việc yêu thích</h1>
        <p className="text-gray-600">Danh sách các công việc bạn đã lưu để xem lại sau</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        {favorites.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có công việc yêu thích</h3>
            <p className="mt-1 text-sm text-gray-500">Bạn chưa lưu công việc nào.</p>
            <div className="mt-6">
              <Link
                to="/jobs"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Tìm kiếm công việc
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {favorites.map((job) => (
              <div key={job.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="h-12 w-12 rounded bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 font-semibold">
                        {job.company.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600 cursor-pointer">
                            {job.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {job.company} • {job.location} • {job.type}
                          </p>
                          <p className="text-sm font-medium text-green-600 mt-1">
                            {job.salary}
                          </p>
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
                          <p className="text-xs text-gray-500 mt-2">
                            Đã lưu: {new Date(job.savedDate).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                      Ứng tuyển
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

export default Favorites; 
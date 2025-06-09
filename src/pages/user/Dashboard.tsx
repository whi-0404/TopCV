import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tổng quan</h1>
        <button 
          onClick={() => navigate('/')} 
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
        >
          Quay lại trang chủ
        </button>
      </div>

      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">Chào bạn, chúc buổi sáng tràn đầy năng lượng nhé!</h2>
        <p className="text-gray-600">Đây là cập nhật về các đơn ứng tuyển việc làm của bạn từ 19/5/2025 đến 25/5/2025</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-gray-700 font-medium mb-2">Tổng ứng tuyển</h3>
            <div className="flex items-end">
              <span className="text-4xl font-bold text-gray-900">45</span>
              <span className="text-gray-500 ml-2 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-gray-700 font-medium mb-2">Đã phỏng vấn</h3>
            <div className="flex items-end">
              <span className="text-4xl font-bold text-gray-900">18</span>
              <span className="text-gray-500 ml-2 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-gray-700 font-medium mb-2">Trạng thái ứng tuyển</h3>
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24">
                <svg viewBox="0 0 36 36" className="w-24 h-24">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                    fill="none" 
                    stroke="#E5E7EB" 
                    strokeWidth="3" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                    fill="none" 
                    stroke="#0EA5E9" 
                    strokeWidth="3" 
                    strokeDasharray="60, 100" />
                </svg>
              </div>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                  <span className="text-sm text-gray-600">60% Không phù hợp</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-gray-300 rounded-full mr-2"></span>
                  <span className="text-sm text-gray-600">40% Đã phỏng vấn</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Công việc đã ứng tuyển gần đây</h2>
          <Link to="/user/applications" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
            Tất cả công việc đã ứng tuyển
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded bg-gray-200 mr-4 flex items-center justify-center">
              <span className="text-gray-500 font-semibold">N</span>
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-medium">Social Media Assistant</h3>
                  <p className="text-sm text-gray-600">Nomad • Paris, Pháp • Full-Time</p>
                </div>
                <div className="mt-2 md:mt-0">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Đang xem xét
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Ngày ứng tuyển: 24-06-2021</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="h-12 w-12 rounded bg-gray-200 mr-4 flex items-center justify-center">
              <span className="text-gray-500 font-semibold">U</span>
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-medium">Frontend Developer</h3>
                  <p className="text-sm text-gray-600">Udacity • New York, USA • Full-Time</p>
                </div>
                <div className="mt-2 md:mt-0">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Đã vào vòng trong
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Ngày ứng tuyển: 23-05-2021</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
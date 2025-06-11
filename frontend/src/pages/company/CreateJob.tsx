import React from 'react';
import JobForm from './JobForm';

const CreateJob: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Tạo tin tuyển dụng mới</h1>
        <p className="text-gray-600">Đăng tin tuyển dụng để tìm kiếm ứng viên phù hợp</p>
      </div>
      
      <JobForm />
    </div>
  );
};

export default CreateJob; 
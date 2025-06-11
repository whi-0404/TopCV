import React from 'react';
import { useParams } from 'react-router-dom';
import JobForm from './JobForm';

const JobEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Chỉnh sửa tin tuyển dụng</h1>
        <p className="text-gray-600">Cập nhật thông tin tin tuyển dụng</p>
      </div>
      
      <JobForm />
    </div>
  );
};

export default JobEdit; 
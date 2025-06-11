import React from 'react';
import { Link } from 'react-router-dom';

interface CreateCompanyPromptProps {
  message?: string;
}

const CreateCompanyPrompt: React.FC<CreateCompanyPromptProps> = ({ 
  message = 'Bạn cần tạo hồ sơ công ty trước khi sử dụng chức năng này.'
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 text-center">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100">
        <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="mt-5 text-lg font-medium text-gray-900">Chưa có hồ sơ công ty</h3>
      <p className="mt-3 text-gray-600">{message}</p>
      <div className="mt-6">
        <Link
          to="/company/create-company"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Tạo hồ sơ công ty ngay
        </Link>
      </div>
    </div>
  );
};

export default CreateCompanyPrompt; 
import React from 'react';
import { Link } from 'react-router-dom';

interface CategoryCardProps {
  icon: React.ReactNode;
  title: string;
  jobCount: number;
  to: string;
}

const CategoryCard = ({ icon, title, jobCount, to }: CategoryCardProps) => {
  return (
    <Link
      to={to}
      className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-start gap-4 border border-gray-100"
    >
      <div className="text-indigo-600 w-12 h-12 flex items-center justify-center rounded-lg bg-indigo-50">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{jobCount} jobs available</p>
      </div>
      <div className="mt-auto">
        <span className="text-indigo-600">→</span>
      </div>
    </Link>
  );
};

export default CategoryCard; 
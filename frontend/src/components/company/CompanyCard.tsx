import React from 'react';
import { Link } from 'react-router-dom';

interface CompanyCardProps {
  id: string;
  name: string;
  logo: string;
  description: string;
  jobCount: number;
  tags: string[];
}

const CompanyCard: React.FC<CompanyCardProps> = ({
  id,
  name,
  logo,
  description,
  jobCount,
  tags,
}) => {
  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <img
            src={logo}
            alt={name}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
            <span className="text-indigo-600">{jobCount} Jobs</span>
          </div>
        </div>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default CompanyCard; 
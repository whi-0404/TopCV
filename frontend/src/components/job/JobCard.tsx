import React from 'react';
import { Link } from 'react-router-dom';

interface JobCardProps {
  id: string;
  company: {
    name: string;
    logo: string;
    location: string;
  };
  title: string;
  type: string;
  tags: string[];
  isFeatured?: boolean;
}

const JobCard = ({ id, company, title, type, tags, isFeatured }: JobCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
          <img src={company.logo} alt={company.name} className="w-8 h-8" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
            {isFeatured && (
              <span className="text-xs text-indigo-600 font-medium px-2.5 py-0.5 rounded-full bg-indigo-50">
                Full Time
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span>{company.name}</span>
            <span>•</span>
            <span>{company.location}</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
        <span className="text-sm text-gray-500">{type}</span>
        <Link
          to={`/jobs/${id}`}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          Apply Now
        </Link>
      </div>
    </div>
  );
};

export default JobCard; 
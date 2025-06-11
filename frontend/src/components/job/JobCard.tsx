import React from 'react';
import { Link } from 'react-router-dom';
import { JobPostDashboard } from '../../services/jobService';

interface JobCardProps {
  job: JobPostDashboard;
  featured?: boolean;
}

const JobCard = ({ job, featured = false }: JobCardProps) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border ${
      featured ? 'border-indigo-500 shadow-md' : 'border-gray-100'
    }`}>
      <div className="flex items-start gap-4">
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">{job.title}</h3>
            {featured && (
              <span className="text-xs text-indigo-600 font-medium px-2.5 py-0.5 rounded-full bg-indigo-50">
                Nổi bật
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span>{job.company.name}</span>
            <span>•</span>
            <span>{job.location || 'Không xác định'}</span>
          </div>
          
          {/* Description (if available) */}
          {job.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {job.description.length > 100 
                ? `${job.description.substring(0, 100)}...`
                : job.description
              }
            </p>
          )}
          
          <div className="flex flex-wrap gap-2 mb-3">
            {job.jobType && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                {job.jobType.name}
              </span>
            )}
            
            {job.skills && job.skills.slice(0, 3).map((skill) => (
              <span
                key={skill.id}
                className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
              >
                {skill.name}
              </span>
            ))}
            
            {job.skills && job.skills.length > 3 && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-600">
                +{job.skills.length - 3}
              </span>
            )}
          </div>
          
          {/* Additional info */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            {job.salary && (
              <div className="flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span>{job.salary}</span>
              </div>
            )}
            
            {job.appliedCount !== undefined && job.hiringQuota !== undefined && (
              <div className="flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>{job.appliedCount}/{job.hiringQuota}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {job.createdAt ? new Date(job.createdAt).toLocaleDateString('vi-VN') : 'Mới đăng'}
        </span>
        <Link
          to={`/jobs/${job.id}`}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          Xem chi tiết
        </Link>
      </div>
    </div>
  );
};

export default JobCard; 
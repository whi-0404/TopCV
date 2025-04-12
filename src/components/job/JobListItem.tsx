import React from 'react';

interface JobListItemProps {
  id: string;
  title: string;
  company: {
    name: string;
    logo: string;
    location: string;
  };
  type: string;
  tags: string[];
  applicants: {
    count: number;
    capacity: number;
  };
}

const JobListItem: React.FC<JobListItemProps> = ({
  id,
  title,
  company,
  type,
  tags,
  applicants,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 flex-shrink-0">
          <img
            src={company.logo}
            alt={company.name}
            className="w-full h-full rounded-lg object-cover"
          />
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{company.name}</span>
                <span>•</span>
                <span>{company.location}</span>
              </div>
            </div>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Apply
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm">
              {type}
            </span>
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full"
                  style={{
                    width: `${(applicants.count / applicants.capacity) * 100}%`,
                  }}
                />
              </div>
              <span className="text-gray-500">
                {applicants.count} applied
              </span>
              <span className="text-gray-400">
                of {applicants.capacity} capacity
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobListItem; 
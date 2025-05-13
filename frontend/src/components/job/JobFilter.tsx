import React from 'react';

interface FilterSection {
  title: string;
  items: {
    label: string;
    count: number;
    value: string;
  }[];
}

const filterSections: FilterSection[] = [
  {
    title: 'Type of Employment',
    items: [
      { label: 'Full-time', count: 3, value: 'full-time' },
      { label: 'Part-Time', count: 5, value: 'part-time' },
      { label: 'Remote', count: 2, value: 'remote' },
      { label: 'Internship', count: 24, value: 'internship' },
      { label: 'Contract', count: 3, value: 'contract' },
    ],
  },
  {
    title: 'Categories',
    items: [
      { label: 'Design', count: 24, value: 'design' },
      { label: 'Sales', count: 3, value: 'sales' },
      { label: 'Marketing', count: 3, value: 'marketing' },
      { label: 'Business', count: 3, value: 'business' },
      { label: 'Human Resource', count: 6, value: 'hr' },
      { label: 'Finance', count: 4, value: 'finance' },
      { label: 'Engineering', count: 4, value: 'engineering' },
      { label: 'Technology', count: 5, value: 'technology' },
    ],
  },
  {
    title: 'Job Level',
    items: [
      { label: 'Entry Level', count: 57, value: 'entry' },
      { label: 'Mid Level', count: 3, value: 'mid' },
      { label: 'Senior Level', count: 5, value: 'senior' },
      { label: 'Director', count: 12, value: 'director' },
      { label: 'VP or Above', count: 8, value: 'vp' },
    ],
  },
  {
    title: 'Salary Range',
    items: [
      { label: '$700 - $1000', count: 4, value: '700-1000' },
      { label: '$100 - $1500', count: 6, value: '1000-1500' },
      { label: '$1500 - $2000', count: 10, value: '1500-2000' },
      { label: '$3000 or above', count: 4, value: '3000-above' },
    ],
  },
];

interface JobFilterProps {
  selectedFilters: string[];
  onFilterChange: (filter: string) => void;
}

const JobFilter: React.FC<JobFilterProps> = ({ selectedFilters, onFilterChange }) => {
  return (
    <div className="space-y-6">
      {filterSections.map((section) => (
        <div key={section.title} className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center justify-between">
            {section.title}
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </h3>
          <div className="space-y-2">
            {section.items.map((item) => (
              <label key={item.value} className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={selectedFilters.includes(item.value)}
                  onChange={() => onFilterChange(item.value)}
                />
                <span className="ml-3 text-sm text-gray-600 flex-1">{item.label}</span>
                <span className="text-sm text-gray-500">({item.count})</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobFilter; 
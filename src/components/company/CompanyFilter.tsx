import React from 'react';

interface FilterOption {
  id: string;
  label: string;
  count: number;
}

interface FilterSection {
  title: string;
  options: FilterOption[];
}

interface CompanyFilterProps {
  selectedFilters: string[];
  onFilterChange: (filterId: string) => void;
}

const CompanyFilter: React.FC<CompanyFilterProps> = ({
  selectedFilters,
  onFilterChange,
}) => {
  const filterSections: FilterSection[] = [
    {
      title: 'Industry',
      options: [
        { id: 'advertising', label: 'Advertising', count: 43 },
        { id: 'business-service', label: 'Business Service', count: 4 },
        { id: 'blockchain', label: 'Blockchain', count: 5 },
        { id: 'cloud', label: 'Cloud', count: 15 },
        { id: 'consumer-tech', label: 'Consumer Tech', count: 5 },
        { id: 'education', label: 'Education', count: 34 },
        { id: 'fintech', label: 'Fintech', count: 45 },
        { id: 'gaming', label: 'Gaming', count: 33 },
        { id: 'food-beverage', label: 'Food & Beverage', count: 5 },
        { id: 'healthcare', label: 'Healthcare', count: 3 },
        { id: 'hosting', label: 'Hosting', count: 5 },
        { id: 'media', label: 'Media', count: 4 },
      ]
    },
    {
      title: 'Company Size',
      options: [
        { id: '1-50', label: '1-50', count: 25 },
        { id: '51-150', label: '51-150', count: 57 },
        { id: '151-250', label: '151-250', count: 45 },
        { id: '251-500', label: '251-500', count: 4 },
        { id: '501-1000', label: '501-1000', count: 43 },
        { id: '1000-above', label: '1000+', count: 23 },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {filterSections.map((section) => (
        <div key={section.title}>
          <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
          <div className="space-y-3">
            {section.options.map((option) => (
              <label
                key={option.id}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  checked={selectedFilters.includes(option.id)}
                  onChange={() => onFilterChange(option.id)}
                />
                <span className="flex-1 text-gray-700 group-hover:text-gray-900">
                  {option.label}
                </span>
                <span className="text-gray-500 text-sm">({option.count})</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CompanyFilter; 
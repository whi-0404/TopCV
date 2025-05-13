import React from 'react';

const SearchBar = () => {
  return (
    <div className="flex w-full max-w-2xl mx-auto">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Job Title, keywords..."
          className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:border-emerald-500"
        />
        <svg
          className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <button className="ml-2 px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
        Search
      </button>
    </div>
  );
};

export default SearchBar; 
import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center">
      <svg
        className="h-8 w-8 text-indigo-600"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
      </svg>
      <span className="ml-2 text-2xl font-bold text-gray-900">JobHuntly</span>
    </div>
  );
};

export default Logo; 
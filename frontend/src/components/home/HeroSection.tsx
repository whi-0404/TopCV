import React, { useState } from 'react';
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline';

const HeroSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Searching for:', searchTerm, 'in', location);
  };

  const popularKeywords = [
    'Java Developer',
    'React Developer', 
    'NodeJS',
    'Python',
    'Data Analyst',
    'Product Manager',
    'UI/UX Designer',
    'DevOps'
  ];

  const locations = [
    'Hồ Chí Minh',
    'Hà Nội', 
    'Đà Nẵng',
    'Cần Thơ',
    'Hải Phòng'
  ];

  return (
    <section className="bg-gradient-to-br from-emerald-50 to-teal-50 pt-16 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Có được công việc mơ ước của bạn
                <span className="block text-emerald-600">
                  với TopJob.
                </span>
              </h1>
              <p className="text-lg text-gray-600">
                Cơ hội không đợi chờ ai - hãy chủ động nắm bắt cơ hội của bạn!
              </p>
            </div>

            {/* Search Form */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Job Search */}
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Nhập tên công việc, vị trí, tên công ty..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-gray-900"
                    />
                  </div>

                  {/* Location Select */}
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-gray-900 appearance-none"
                    >
                      <option value="">Tất cả địa điểm</option>
                      {locations.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition-colors focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  Tìm kiếm
                </button>
              </form>

              {/* Popular Keywords */}
              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-3">Từ khóa phổ biến:</p>
                <div className="flex flex-wrap gap-2">
                  {popularKeywords.map((keyword) => (
                    <button
                      key={keyword}
                      onClick={() => setSearchTerm(keyword)}
                      className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm hover:bg-emerald-100 transition-colors"
                    >
                      {keyword}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">1000+</div>
                <div className="text-sm text-gray-600">Việc làm IT</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">500+</div>
                <div className="text-sm text-gray-600">Công ty hàng đầu</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">10K+</div>
                <div className="text-sm text-gray-600">Ứng viên</div>
              </div>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Main illustration container */}
              <div className="bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute top-4 right-4 w-16 h-16 bg-emerald-100 rounded-full opacity-50"></div>
                <div className="absolute bottom-4 left-4 w-12 h-12 bg-emerald-200 rounded-full opacity-50"></div>
                
                {/* Illustration content */}
                <div className="space-y-6">
                  {/* Team working illustration */}
                  <div className="flex items-center justify-center space-x-4">
                    <div className="flex space-x-2">
                      <div className="w-12 h-16 bg-emerald-100 rounded-lg flex items-end justify-center">
                        <div className="w-8 h-8 bg-emerald-600 rounded-full mb-2"></div>
                      </div>
                      <div className="w-12 h-16 bg-blue-100 rounded-lg flex items-end justify-center">
                        <div className="w-8 h-8 bg-blue-600 rounded-full mb-2"></div>
                      </div>
                    </div>
                    
                    {/* Desk/Computer */}
                    <div className="w-16 h-12 bg-gray-200 rounded-lg relative">
                      <div className="w-12 h-8 bg-gray-800 rounded-sm mx-auto mt-1"></div>
                      <div className="w-2 h-4 bg-gray-600 mx-auto"></div>
                    </div>
                    
                    <div className="w-12 h-16 bg-green-100 rounded-lg flex items-end justify-center">
                      <div className="w-8 h-8 bg-green-600 rounded-full mb-2"></div>
                    </div>
                  </div>

                  {/* Connection lines */}
                  <div className="flex justify-center">
                    <svg className="w-32 h-8" viewBox="0 0 128 32">
                      <path
                        d="M16 16 Q 32 8, 48 16 T 80 16 Q 96 8, 112 16"
                        stroke="#10B981"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray="4,4"
                      />
                    </svg>
                  </div>

                  {/* Plants decoration */}
                  <div className="flex justify-between items-end">
                    <div className="w-8 h-12 bg-emerald-200 rounded-full relative">
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-emerald-400 rounded-full"></div>
                    </div>
                    <div className="w-8 h-12 bg-emerald-200 rounded-full relative">
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-emerald-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-emerald-400 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-emerald-300 rounded-full animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 
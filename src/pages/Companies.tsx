import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Company {
  id: number;
  name: string;
  logo: string;
  description: string;
  jobCount: number;
  tags: string[];
  size: string;
  location: string;
  rating: number;
  founded: string;
  industry: string;
}

const mockCompanies: Company[] = [
  {
    id: 1,
    name: 'TechCorp Vietnam',
    logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120&h=120&fit=crop&crop=entropy&auto=format',
    description: 'Công ty công nghệ hàng đầu tại Việt Nam, chuyên phát triển các giải pháp phần mềm và ứng dụng di động cho doanh nghiệp.',
    jobCount: 15,
    tags: ['React', 'Node.js', 'Python'],
    size: '200-500',
    location: 'TP.HCM',
    rating: 4.8,
    founded: '2015',
    industry: 'Phần mềm'
  },
  {
    id: 2,
    name: 'DataFlow Solutions',
    logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=120&h=120&fit=crop&crop=entropy&auto=format',
    description: 'Chuyên gia về Big Data và AI, cung cấp giải pháp phân tích dữ liệu cho các tập đoàn lớn tại Đông Nam Á.',
    jobCount: 8,
    tags: ['Python', 'Machine Learning', 'AWS'],
    size: '100-200',
    location: 'Hà Nội',
    rating: 4.6,
    founded: '2018',
    industry: 'Data Analytics'
  },
  {
    id: 3,
    name: 'Mobile First Studio',
    logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=120&h=120&fit=crop&crop=entropy&auto=format',
    description: 'Studio phát triển ứng dụng di động đoạt nhiều giải thưởng, tập trung vào UX/UI và hiệu suất cao.',
    jobCount: 12,
    tags: ['React Native', 'Flutter', 'iOS'],
    size: '50-100',
    location: 'Đà Nẵng',
    rating: 4.9,
    founded: '2019',
    industry: 'Mobile Development'
  },
  {
    id: 4,
    name: 'CloudTech Innovations',
    logo: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=120&h=120&fit=crop&crop=entropy&auto=format',
    description: 'Nhà cung cấp dịch vụ cloud computing và DevOps hàng đầu, hỗ trợ chuyển đổi số cho doanh nghiệp.',
    jobCount: 20,
    tags: ['AWS', 'Docker', 'Kubernetes'],
    size: '300-500',
    location: 'TP.HCM',
    rating: 4.7,
    founded: '2016',
    industry: 'Cloud Services'
  },
  {
    id: 5,
    name: 'GameDev Vietnam',
    logo: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=120&h=120&fit=crop&crop=entropy&auto=format',
    description: 'Studio phát triển game indie nổi tiếng với những tựa game mobile được yêu thích tại thị trường Việt Nam.',
    jobCount: 6,
    tags: ['Unity', 'C#', 'Game Design'],
    size: '20-50',
    location: 'TP.HCM',
    rating: 4.5,
    founded: '2020',
    industry: 'Game Development'
  },
  {
    id: 6,
    name: 'FinTech Solutions',
    logo: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=120&h=120&fit=crop&crop=entropy&auto=format',
    description: 'Công ty fintech tiên phong trong việc phát triển các giải pháp thanh toán và quản lý tài chính cá nhân.',
    jobCount: 18,
    tags: ['Java', 'Spring Boot', 'Blockchain'],
    size: '150-300',
    location: 'Hà Nội',
    rating: 4.4,
    founded: '2017',
    industry: 'Financial Technology'
  },
  {
    id: 7,
    name: 'E-commerce Platform',
    logo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=120&h=120&fit=crop&crop=entropy&auto=format',
    description: 'Nền tảng thương mại điện tử hàng đầu với hơn 1 triệu người dùng hoạt động và hệ thống thanh toán an toàn.',
    jobCount: 25,
    tags: ['Vue.js', 'Laravel', 'MySQL'],
    size: '500+',
    location: 'TP.HCM',
    rating: 4.6,
    founded: '2014',
    industry: 'E-commerce'
  },
  {
    id: 8,
    name: 'EdTech Innovations',
    logo: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=120&h=120&fit=crop&crop=entropy&auto=format',
    description: 'Startup giáo dục công nghệ phát triển các nền tảng học trực tuyến và công cụ hỗ trợ giảng dạy.',
    jobCount: 10,
    tags: ['React', 'Django', 'PostgreSQL'],
    size: '50-100',
    location: 'Hà Nội',
    rating: 4.3,
    founded: '2021',
    industry: 'Education Technology'
  }
];

const Companies = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const industries = ['all', 'Phần mềm', 'Data Analytics', 'Mobile Development', 'Cloud Services', 'Game Development', 'Financial Technology', 'E-commerce', 'Education Technology'];
  const sizes = ['all', '20-50', '50-100', '100-200', '200-500', '500+'];

  const filteredCompanies = mockCompanies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry === 'all' || company.industry === selectedIndustry;
    const matchesSize = selectedSize === 'all' || company.size === selectedSize;
    return matchesSearch && matchesIndustry && matchesSize;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">IT <span className="text-emerald-500">Companies</span></h1>
          <p className="text-gray-600">Khám phá các công ty IT hàng đầu và tìm kiếm cơ hội nghề nghiệp phù hợp</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Tìm kiếm công ty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngành nghề</label>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              >
                {industries.map(industry => (
                  <option key={industry} value={industry}>
                    {industry === 'all' ? 'Tất cả ngành' : industry}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quy mô</label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              >
                {sizes.map(size => (
                  <option key={size} value={size}>
                    {size === 'all' ? 'Tất cả quy mô' : `${size} nhân viên`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredCompanies.length} công ty được tìm thấy
          </h2>
        </div>

        {/* Companies Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <Link 
                key={company.id}
                to={`/companies/${company.id}`}
                className="block bg-white rounded-lg border border-gray-200 p-6 hover:border-emerald-500 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <img src={company.logo} alt={company.name} className="w-16 h-16 rounded-lg object-cover" />
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 text-sm rounded-full font-medium">
                      {company.jobCount} việc làm
                    </span>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{company.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{company.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {company.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    {company.size} nhân viên
                  </div>
                  <div className="flex items-center gap-1">
                    {renderStars(company.rating)}
                    <span className="text-sm text-gray-600 ml-1">{company.rating}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {company.tags.slice(0, 3).map((tag) => (
                    <span 
                      key={tag} 
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCompanies.map((company) => (
              <Link 
                key={company.id}
                to={`/companies/${company.id}`}
                className="block bg-white rounded-lg border border-gray-200 p-6 hover:border-emerald-500 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-6">
                  <img src={company.logo} alt={company.name} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{company.name}</h3>
                      <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 text-sm rounded-full font-medium">
                        {company.jobCount} việc làm
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{company.description}</p>
                    
                    <div className="flex items-center gap-6 mb-3">
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {company.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                        {company.size} nhân viên
                      </div>
                      <div className="flex items-center gap-1">
                        {renderStars(company.rating)}
                        <span className="text-sm text-gray-600 ml-1">{company.rating}</span>
                      </div>
                      <div className="text-sm text-gray-500">Thành lập {company.founded}</div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {company.tags.map((tag) => (
                        <span 
                          key={tag} 
                          className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-8">
          <button className="p-2 rounded hover:bg-gray-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              className={`w-8 h-8 rounded ${
                page === 1 ? 'bg-emerald-600 text-white' : 'hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}
          <button className="p-2 rounded hover:bg-gray-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Companies; 
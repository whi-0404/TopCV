import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Job {
  id: number;
  title: string;
  company: string;
  logo: string;
  location: string;
  type: string;
  tags: string[];
  postedDate: string;
  salary: string;
  level: string;
  description: string;
  featured?: boolean;
}

const mockJobs: Job[] = [
  {
    id: 1,
    title: 'Senior Frontend Developer (React)',
    company: 'TechCorp Vietnam',
    logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=60&h=60&fit=crop&crop=entropy&auto=format',
    location: 'TP.HCM',
    type: 'Full-time',
    tags: ['React', 'TypeScript', 'Next.js'],
    postedDate: '2024-03-15',
    salary: '25-35 triệu',
    level: 'Senior',
    description: 'Tham gia phát triển các sản phẩm web hiện đại sử dụng React và TypeScript. Làm việc trong môi trường agile với team 15+ developers.',
    featured: true
  },
  {
    id: 2,
    title: 'Data Scientist - AI/ML',
    company: 'DataFlow Solutions',
    logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=60&h=60&fit=crop&crop=entropy&auto=format',
    location: 'Hà Nội',
    type: 'Full-time',
    tags: ['Python', 'Machine Learning', 'TensorFlow'],
    postedDate: '2024-03-14',
    salary: '30-45 triệu',
    level: 'Senior',
    description: 'Phát triển các mô hình AI/ML để giải quyết các bài toán business. Yêu cầu kinh nghiệm 3+ năm với Python và ML frameworks.',
    featured: true
  },
  {
    id: 3,
    title: 'Mobile Developer (React Native)',
    company: 'Mobile First Studio',
    logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=60&h=60&fit=crop&crop=entropy&auto=format',
    location: 'Đà Nẵng',
    type: 'Full-time',
    tags: ['React Native', 'iOS', 'Android'],
    postedDate: '2024-03-13',
    salary: '20-30 triệu',
    level: 'Mid-level',
    description: 'Xây dựng ứng dụng mobile cross-platform với React Native. Cơ hội làm việc với các dự án startup đầy thử thách.'
  },
  {
    id: 4,
    title: 'DevOps Engineer',
    company: 'CloudTech Innovations',
    logo: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=60&h=60&fit=crop&crop=entropy&auto=format',
    location: 'TP.HCM',
    type: 'Full-time',
    tags: ['AWS', 'Docker', 'Kubernetes'],
    postedDate: '2024-03-12',
    salary: '28-40 triệu',
    level: 'Senior',
    description: 'Quản lý hạ tầng cloud và triển khai CI/CD pipelines. Kinh nghiệm với AWS, Docker và Kubernetes là lợi thế.'
  },
  {
    id: 5,
    title: 'Game Developer (Unity)',
    company: 'GameDev Vietnam',
    logo: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=60&h=60&fit=crop&crop=entropy&auto=format',
    location: 'TP.HCM',
    type: 'Full-time',
    tags: ['Unity', 'C#', 'Game Design'],
    postedDate: '2024-03-11',
    salary: '18-25 triệu',
    level: 'Mid-level',
    description: 'Phát triển game mobile indie sáng tạo. Môi trường làm việc trẻ trung, năng động với nhiều cơ hội học hỏi.'
  },
  {
    id: 6,
    title: 'Backend Developer (Java)',
    company: 'FinTech Solutions',
    logo: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=60&h=60&fit=crop&crop=entropy&auto=format',
    location: 'Hà Nội',
    type: 'Full-time',
    tags: ['Java', 'Spring Boot', 'Microservices'],
    postedDate: '2024-03-10',
    salary: '22-32 triệu',
    level: 'Mid-level',
    description: 'Xây dựng hệ thống backend cho các sản phẩm fintech. Yêu cầu kinh nghiệm với Java Spring và microservices architecture.'
  },
  {
    id: 7,
    title: 'Full-stack Developer',
    company: 'E-commerce Platform',
    logo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=60&h=60&fit=crop&crop=entropy&auto=format',
    location: 'TP.HCM',
    type: 'Full-time',
    tags: ['Vue.js', 'Laravel', 'MySQL'],
    postedDate: '2024-03-09',
    salary: '20-28 triệu',
    level: 'Mid-level',
    description: 'Phát triển full-stack cho nền tảng e-commerce hàng đầu Việt Nam. Làm việc với Vue.js frontend và Laravel backend.'
  },
  {
    id: 8,
    title: 'Frontend Developer (Fresher)',
    company: 'EdTech Innovations',
    logo: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=60&h=60&fit=crop&crop=entropy&auto=format',
    location: 'Hà Nội',
    type: 'Full-time',
    tags: ['React', 'JavaScript', 'CSS'],
    postedDate: '2024-03-08',
    salary: '12-18 triệu',
    level: 'Fresher',
    description: 'Vị trí fresher frontend developer cho startup giáo dục. Cơ hội tốt để bắt đầu sự nghiệp trong lĩnh vực công nghệ.'
  }
];

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const locations = ['all', 'TP.HCM', 'Hà Nội', 'Đà Nẵng'];
  const types = ['all', 'Full-time', 'Part-time', 'Contract', 'Internship'];
  const levels = ['all', 'Fresher', 'Mid-level', 'Senior', 'Lead'];

  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLocation = selectedLocation === 'all' || job.location === selectedLocation;
    const matchesType = selectedType === 'all' || job.type === selectedType;
    const matchesLevel = selectedLevel === 'all' || job.level === selectedLevel;
    return matchesSearch && matchesLocation && matchesType && matchesLevel;
  });

  const featuredJobs = filteredJobs.filter(job => job.featured);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 ngày trước';
    if (diffDays < 7) return `${diffDays} ngày trước`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
    return `${Math.floor(diffDays / 30)} tháng trước`;
  };

  const JobCard = ({ job, featured = false }: { job: Job; featured?: boolean }) => (
    <Link to={`/jobs/${job.id}`} className="block">
      <div className={`bg-white rounded-lg border p-6 hover:shadow-lg transition-all ${
        featured ? 'border-emerald-500 shadow-md' : 'border-gray-200 hover:border-emerald-500'
      }`}>
        {featured && (
          <div className="flex items-center mb-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              Nổi bật
            </span>
          </div>
        )}
        
        <div className="flex items-start gap-4">
          <img 
            src={job.logo} 
            alt={job.company} 
            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 hover:text-emerald-600 transition-colors">
                {job.title}
              </h3>
              <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                {formatDate(job.postedDate)}
              </span>
            </div>
            
            <p className="text-gray-600 font-medium mb-2">{job.company}</p>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{job.description}</p>
            
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {job.location}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {job.type}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                {job.salary}
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                job.level === 'Senior' ? 'bg-purple-100 text-purple-800' :
                job.level === 'Mid-level' ? 'bg-blue-100 text-blue-800' :
                job.level === 'Fresher' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {job.level}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {job.tags.slice(0, 3).map((tag) => (
                <span 
                  key={tag} 
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                >
                  {tag}
                </span>
              ))}
              {job.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                  +{job.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tìm kiếm <span className="text-emerald-500">việc làm IT</span> mơ ước
          </h1>
          <p className="text-gray-600">Khám phá hàng nghìn cơ hội nghề nghiệp tại các công ty công nghệ hàng đầu</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Tìm kiếm theo vị trí, công ty, kỹ năng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg ${viewMode === 'list' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg ${viewMode === 'grid' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Địa điểm</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              >
                {locations.map(location => (
                  <option key={location} value={location}>
                    {location === 'all' ? 'Tất cả địa điểm' : location}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loại hình</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              >
                {types.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'Tất cả loại hình' : type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cấp độ</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              >
                {levels.map(level => (
                  <option key={level} value={level}>
                    {level === 'all' ? 'Tất cả cấp độ' : level}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <span className="text-sm text-gray-500">Từ khóa phổ biến:</span>
            {['React', 'Node.js', 'Python', 'Java', 'DevOps'].map((keyword) => (
              <button
                key={keyword}
                onClick={() => setSearchTerm(keyword)}
                className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Jobs */}
        {featuredJobs.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Việc làm nổi bật</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredJobs.slice(0, 2).map((job) => (
                <JobCard key={job.id} job={job} featured={true} />
              ))}
            </div>
          </div>
        )}

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredJobs.length} việc làm được tìm thấy
          </h2>
        </div>

        {/* Jobs List/Grid */}
        {viewMode === 'list' ? (
          <div className="space-y-6">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
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

export default Jobs; 
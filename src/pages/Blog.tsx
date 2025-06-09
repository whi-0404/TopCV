import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface BlogPost {
  id: number;
  title: string;
  summary: string;
  image: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  tags: string[];
}

const mockBlogs: BlogPost[] = [
  {
    id: 1,
    title: 'Top 10 ngôn ngữ lập trình phổ biến nhất 2024',
    summary: 'Khám phá những ngôn ngữ lập trình đang thịnh hành và được các nhà tuyển dụng săn đón nhất trong năm 2024.',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop&crop=entropy&auto=format',
    date: '15/03/2024',
    author: 'Nguyễn Văn A',
    category: 'Programming',
    readTime: '5 phút đọc',
    tags: ['JavaScript', 'Python', 'React', 'Programming']
  },
  {
    id: 2,
    title: 'Làm thế nào để trở thành Full-stack Developer',
    summary: 'Hướng dẫn chi tiết về lộ trình học tập và những kỹ năng cần thiết để trở thành một Full-stack Developer chuyên nghiệp.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop&crop=entropy&auto=format',
    date: '14/03/2024',
    author: 'Trần Thị B',
    category: 'Career',
    readTime: '8 phút đọc',
    tags: ['Full-stack', 'Career', 'Web Development', 'Learning']
  },
  {
    id: 3,
    title: 'AI và Tương lai của ngành IT',
    summary: 'Tìm hiểu về tác động của AI đến ngành IT và những cơ hội nghề nghiệp trong tương lai.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop&crop=entropy&auto=format',
    date: '13/03/2024',
    author: 'Lê Văn C',
    category: 'Technology',
    readTime: '6 phút đọc',
    tags: ['AI', 'Machine Learning', 'Future', 'Technology']
  },
  {
    id: 4,
    title: 'Xu hướng công nghệ 2024',
    summary: 'Những xu hướng công nghệ mới nhất đang định hình tương lai của ngành IT và cách chúng ảnh hưởng đến thị trường việc làm.',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop&crop=entropy&auto=format',
    date: '12/03/2024',
    author: 'Phạm Thị D',
    category: 'Trends',
    readTime: '7 phút đọc',
    tags: ['Tech Trends', 'Innovation', 'Future', 'Technology']
  },
  {
    id: 5,
    title: 'Cách viết CV IT gây ấn tượng với nhà tuyển dụng',
    summary: 'Bí quyết tạo ra một CV IT nổi bật, thu hút sự chú ý của nhà tuyển dụng và tăng cơ hội được mời phỏng vấn.',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=400&fit=crop&crop=entropy&auto=format',
    date: '11/03/2024',
    author: 'Hoàng Văn E',
    category: 'Career',
    readTime: '4 phút đọc',
    tags: ['CV', 'Job Search', 'Career', 'Tips']
  },
  {
    id: 6,
    title: 'Remote Work: Xu hướng làm việc từ xa trong IT',
    summary: 'Tổng quan về xu hướng làm việc từ xa trong ngành IT, những lợi ích và thách thức mà nó mang lại.',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=400&fit=crop&crop=entropy&auto=format',
    date: '10/03/2024',
    author: 'Nguyễn Thị F',
    category: 'Work Culture',
    readTime: '6 phút đọc',
    tags: ['Remote Work', 'Work Culture', 'Productivity', 'IT']
  }
];

const Blog = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['all', 'Programming', 'Career', 'Technology', 'Trends', 'Work Culture'];

  const filteredBlogs = mockBlogs.filter(blog => {
    const matchesCategory = selectedCategory === 'all' || blog.category === selectedCategory;
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % 3); // Chỉ hiển thị 3 bài đầu trong slider
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? 2 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % 3
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">IT <span className="text-emerald-500">Blog</span></h1>
          <p className="text-gray-600">Cập nhật xu hướng công nghệ mới nhất và kiến thức hữu ích cho sự nghiệp IT</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-sm text-gray-500 mr-2">Danh mục:</span>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedCategory === category
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'Tất cả' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Blog Slider */}
        <div className="relative mb-12 rounded-xl overflow-hidden shadow-lg">
          <div className="relative h-[400px]">
            {mockBlogs.slice(0, 3).map((blog, index) => (
              <div
                key={blog.id}
                className={`absolute w-full h-full transition-opacity duration-500 ${
                  index === currentIndex ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ pointerEvents: index === currentIndex ? 'auto' : 'none' }}
              >
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                  <div className="mb-2">
                    <span className="inline-block px-3 py-1 bg-emerald-600 text-white text-xs rounded-full">
                      {blog.category}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">{blog.title}</h2>
                  <p className="text-gray-200 mb-4 line-clamp-2">{blog.summary}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-300 text-sm">
                      <span>{blog.date}</span>
                      <span className="mx-2">•</span>
                      <span>{blog.author}</span>
                      <span className="mx-2">•</span>
                      <span>{blog.readTime}</span>
                    </div>
                    <Link
                      to={`/blog/${blog.id}`}
                      className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all"
                    >
                      Đọc ngay
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all"
            aria-label="Previous slide"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all"
            aria-label="Next slide"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-white w-4' : 'bg-white/60'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>


        {/* Blog Grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {selectedCategory === 'all' ? 'Tất cả bài viết' : `Bài viết về ${selectedCategory}`}
            <span className="text-sm font-normal text-gray-500 ml-2">({filteredBlogs.length} bài viết)</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map(blog => (
            <Link key={blog.id} to={`/blog/${blog.id}`} className="block">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow border border-gray-200 hover:border-emerald-500">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      blog.category === 'Programming' ? 'bg-blue-50 text-blue-600' :
                      blog.category === 'Career' ? 'bg-green-50 text-green-600' :
                      blog.category === 'Technology' ? 'bg-purple-50 text-purple-600' :
                      blog.category === 'Trends' ? 'bg-orange-50 text-orange-600' :
                      'bg-gray-50 text-gray-600'
                    }`}>
                      {blog.category}
                    </span>
                    <span className="text-xs text-gray-500">{blog.readTime}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{blog.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm line-clamp-2">{blog.summary}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {blog.tags.slice(0, 3).map((tag) => (
                      <span 
                        key={tag} 
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-gray-500">
                      <span>{blog.date}</span>
                      <span className="mx-2">•</span>
                      <span>{blog.author}</span>
                    </div>
                    <span className="text-emerald-600 hover:text-emerald-700 font-medium">
                      Đọc thêm →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

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

export default Blog; 
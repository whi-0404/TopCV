import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Link } from 'react-router-dom';
import { 
  MagnifyingGlassIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  CalendarIcon,
  UserIcon,
  TagIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const BlogsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;

  // Mock blog data với ảnh thực tế từ Unsplash
  const blogs = [
    {
      id: '1',
      title: 'Làm thế nào để trở thành một Full Stack Developer giỏi?',
      excerpt: 'Hướng dẫn chi tiết từ A-Z để trở thành một Full Stack Developer chuyên nghiệp với các kỹ năng cần thiết và lộ trình học tập hiệu quả.',
      content: 'Full stack development là một trong những hướng phát triển sự nghiệp được nhiều lập trình viên quan tâm...',
      author: 'Nguyễn Văn A',
      publishedAt: '2024-01-15',
      category: 'Programming',
      tags: ['Full Stack', 'Web Development', 'Career'],
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&h=600&q=80',
      views: 1250,
      readTime: '8 phút đọc'
    },
    {
      id: '2',
      title: 'React vs Vue.js: So sánh chi tiết 2024',
      excerpt: 'Phân tích so sánh toàn diện giữa React và Vue.js về hiệu suất, độ phổ biến, cộng đồng và triển vọng nghề nghiệp.',
      content: 'Trong thế giới frontend development, React và Vue.js là hai framework được ưa chuộng nhất...',
      author: 'Trần Thị B',
      publishedAt: '2024-01-10',
      category: 'Frontend',
      tags: ['React', 'Vue.js', 'JavaScript'],
      imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&h=600&q=80',
      views: 980,
      readTime: '12 phút đọc'
    },
    {
      id: '3',
      title: 'AI và Machine Learning: Cơ hội nghề nghiệp 2024',
      excerpt: 'Khám phá các cơ hội nghề nghiệp hấp dẫn trong lĩnh vực AI và Machine Learning, kỹ năng cần có và mức lương hiện tại.',
      content: 'Artificial Intelligence và Machine Learning đang thay đổi cách chúng ta làm việc...',
      author: 'Lê Minh C',
      publishedAt: '2024-01-08',
      category: 'AI & ML',
      tags: ['Artificial Intelligence', 'Machine Learning', 'Python'],
      imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&h=600&q=80',
      views: 1400,
      readTime: '10 phút đọc'
    },
    {
      id: '4',
      title: 'Bảo mật ứng dụng web: Best practices 2024',
      excerpt: 'Tổng hợp các phương pháp bảo mật quan trọng nhất mà mọi developer cần biết để xây dựng ứng dụng web an toàn.',
      content: 'Bảo mật ứng dụng web là một chủ đề cực kỳ quan trọng trong phát triển phần mềm...',
      author: 'Phạm Đức D',
      publishedAt: '2024-01-05',
      category: 'Security',
      tags: ['Web Security', 'HTTPS', 'Authentication'],
      imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&h=600&q=80',
      views: 875,
      readTime: '15 phút đọc'
    },
    {
      id: '5',
      title: 'Docker và Kubernetes: Hướng dẫn từ cơ bản đến nâng cao',
      excerpt: 'Học cách sử dụng Docker và Kubernetes để containerize và orchestrate ứng dụng một cách hiệu quả.',
      content: 'Container technology đã thay đổi cách chúng ta deploy và manage applications...',
      author: 'Hoàng Thị E',
      publishedAt: '2024-01-03',
      category: 'DevOps',
      tags: ['Docker', 'Kubernetes', 'DevOps'],
      imageUrl: 'https://images.unsplash.com/photo-1605745341112-85968b19335a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&h=600&q=80',
      views: 1120,
      readTime: '20 phút đọc'
    },
    {
      id: '6',
      title: 'Cloud Computing: AWS vs Azure vs GCP',
      excerpt: 'So sánh chi tiết ba nền tảng cloud computing hàng đầu và hướng dẫn chọn platform phù hợp cho dự án.',
      content: 'Cloud computing đã trở thành backbone của hầu hết các ứng dụng hiện đại...',
      author: 'Đỗ Văn F',
      publishedAt: '2024-01-01',
      category: 'Cloud',
      tags: ['AWS', 'Azure', 'Google Cloud'],
      imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&h=600&q=80',
      views: 750,
      readTime: '18 phút đọc'
    },
    {
      id: '7',
      title: 'Thiết kế UI/UX: Xu hướng 2024',
      excerpt: 'Khám phá các xu hướng thiết kế UI/UX mới nhất và cách áp dụng chúng vào dự án thực tế.',
      content: 'Thiết kế UI/UX đang phát triển với tốc độ chóng mặt...',
      author: 'Ngô Thị G',
      publishedAt: '2024-01-20',
      category: 'Design',
      tags: ['UI/UX', 'Design', 'Trends'],
      imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&h=600&q=80',
      views: 892,
      readTime: '7 phút đọc'
    },
    {
      id: '8',
      title: 'Mobile App Development: Native vs Cross-platform',
      excerpt: 'So sánh ưu nhược điểm của phát triển ứng dụng mobile native và cross-platform.',
      content: 'Khi phát triển ứng dụng mobile, việc chọn lựa giữa native và cross-platform...',
      author: 'Vũ Minh H',
      publishedAt: '2024-01-18',
      category: 'Mobile',
      tags: ['Mobile', 'React Native', 'Flutter'],
      imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&h=600&q=80',
      views: 1050,
      readTime: '11 phút đọc'
    }
  ];

  const categories = [
    'Tất cả',
    'Programming',
    'Frontend',
    'Backend',
    'AI & ML',
    'Security',
    'DevOps',
    'Cloud',
    'Mobile',
    'Design'
  ];

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || selectedCategory === 'Tất cả' || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const startIndex = (currentPage - 1) * blogsPerPage;
  const displayedBlogs = filteredBlogs.slice(startIndex, startIndex + blogsPerPage);

  const BlogCard: React.FC<{ blog: any }> = ({ blog }) => (
    <article className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/blogs/${blog.id}`}>
        <img
          src={blog.imageUrl}
          alt={blog.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/400x240/10b981/ffffff?text=TopCV+Blog';
          }}
        />
      </Link>
      <div className="p-6">
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1" />
            {new Date(blog.publishedAt).toLocaleDateString('vi-VN')}
          </div>
          <div className="flex items-center">
            <UserIcon className="h-4 w-4 mr-1" />
            {blog.author}
          </div>
          <div className="flex items-center">
            <EyeIcon className="h-4 w-4 mr-1" />
            {blog.views}
          </div>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
          <Link to={`/blogs/${blog.id}`} className="hover:text-emerald-600 transition-colors">
            {blog.title}
          </Link>
        </h2>
        
        <p className="text-gray-600 mb-4 line-clamp-3">{blog.excerpt}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
              {blog.category}
            </span>
            {blog.tags.slice(0, 2).map((tag: string, index: number) => (
              <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                {tag}
              </span>
            ))}
          </div>
          <span className="text-sm text-gray-500">{blog.readTime}</span>
        </div>
      </div>
    </article>
  );

  const FeaturedPost: React.FC<{ blog: any }> = ({ blog }) => (
    <article className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow lg:flex">
      <div className="lg:w-1/2">
        <Link to={`/blogs/${blog.id}`}>
          <img
            src={blog.imageUrl}
            alt={blog.title}
            className="w-full h-64 lg:h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/600x400/10b981/ffffff?text=TopCV+Featured+Blog';
            }}
          />
        </Link>
      </div>
      <div className="p-8 lg:w-1/2 flex flex-col justify-center">
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
            BÀI VIẾT NỔI BẬT
          </span>
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1" />
            {new Date(blog.publishedAt).toLocaleDateString('vi-VN')}
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          <Link to={`/blogs/${blog.id}`} className="hover:text-emerald-600 transition-colors">
            {blog.title}
          </Link>
        </h2>
        
        <p className="text-gray-600 mb-6">{blog.excerpt}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <UserIcon className="h-4 w-4 mr-1" />
              {blog.author}
            </div>
            <div className="flex items-center">
              <EyeIcon className="h-4 w-4 mr-1" />
              {blog.views}
            </div>
          </div>
          <Link
            to={`/blogs/${blog.id}`}
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Đọc thêm →
          </Link>
        </div>
      </div>
    </article>
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Blog <span className="text-emerald-600">IT</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Cập nhật kiến thức công nghệ mới nhất và chia sẻ kinh nghiệm lập trình
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm bài viết..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Featured Post */}
          {!searchTerm && !selectedCategory && (
            <div className="mb-12">
              <FeaturedPost blog={blogs[0]} />
            </div>
          )}

          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category === 'Tất cả' ? '' : category)}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    (selectedCategory === category) || (!selectedCategory && category === 'Tất cả')
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {displayedBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>

              {[...Array(Math.min(5, totalPages))].map((_, index) => {
                const pageNum = index + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 rounded-md font-medium ${
                      currentPage === pageNum
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {totalPages > 5 && (
                <>
                  <span className="px-2 text-gray-500">...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`px-3 py-1 rounded-md font-medium ${
                      currentPage === totalPages
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* No Results */}
          {filteredBlogs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Không tìm thấy bài viết nào phù hợp.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BlogsPage; 
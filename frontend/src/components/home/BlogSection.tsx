import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRightIcon,
  CalendarIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { Blog } from '../../types';

const BlogSection: React.FC = () => {
  // Mock data - sẽ thay thế bằng API call thực tế
  const featuredBlogs: Blog[] = [
    {
      id: '1',
      title: '"5 hiring answer" khi dân lập trình viên đi làm thì muốn gì từ công ty?',
      content: 'Trong thời đại công nghệ phát triển nhanh chóng, nhu cầu tuyển dụng lập trình viên ngày càng cao...',
      summary: 'Khám phá 5 yếu tố quan trọng nhất mà các lập trình viên mong muốn khi làm việc tại một công ty.',
      thumbnail: 'https://via.placeholder.com/400x240?text=Blog+1',
      authorId: '1',
      author: {
        id: '1',
        email: 'admin@topjob.com',
        fullname: 'TopJob Admin',
        role: 'ADMIN',
        isActive: true,
        isEmailVerified: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      categoryId: '1',
      isPublished: true,
      publishedAt: '2024-01-15',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: '2',
      title: '5 xu hướng thiết kế graphic đang nâng cao trải nghiệm UX tốt nhất năm 2024',
      content: 'Thiết kế UX/UI đang phát triển không ngừng với những xu hướng mới...',
      summary: 'Tìm hiểu 5 xu hướng thiết kế graphic nổi bật đang định hình trải nghiệm người dùng trong năm 2024.',
      thumbnail: 'https://via.placeholder.com/400x240?text=Blog+2',
      authorId: '2',
      author: {
        id: '2',
        email: 'designer@topjob.com',
        fullname: 'UI/UX Expert',
        role: 'USER',
        isActive: true,
        isEmailVerified: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      categoryId: '2',
      isPublished: true,
      publishedAt: '2024-01-10',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-10'
    },
    {
      id: '3',
      title: 'Tại sao responsive design lại quan trọng đến vậy với những người làm UI/UX',
      content: 'Responsive design đã trở thành một yêu cầu bắt buộc trong thiết kế web hiện đại...',
      summary: 'Khám phá tầm quan trọng của responsive design và cách nó ảnh hưởng đến công việc của UI/UX designer.',
      thumbnail: 'https://via.placeholder.com/400x240?text=Blog+3',
      authorId: '3',
      author: {
        id: '3',
        email: 'expert@topjob.com',
        fullname: 'Web Design Expert',
        role: 'USER',
        isActive: true,
        isEmailVerified: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      categoryId: '2',
      isPublished: true,
      publishedAt: '2024-01-05',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-05'
    }
  ];

  const BlogCard: React.FC<{ blog: Blog }> = ({ blog }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      {/* Blog Thumbnail */}
      <div className="aspect-w-16 aspect-h-9">
        <img
          src={blog.thumbnail}
          alt={blog.title}
          className="w-full h-48 object-cover"
        />
      </div>

      {/* Blog Content */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-emerald-600 cursor-pointer line-clamp-2 leading-tight">
            <Link to={`/blogs/${blog.id}`}>
              {blog.title}
            </Link>
          </h3>
        </div>

        <p className="text-sm text-gray-700 line-clamp-3">
          {blog.summary}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <UserIcon className="h-4 w-4" />
              <span>{blog.author?.fullname}</span>
            </div>
            <div className="flex items-center space-x-1">
              <CalendarIcon className="h-4 w-4" />
              <span>{new Date(blog.publishedAt).toLocaleDateString('vi-VN')}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
            Tech Insight
          </span>
          <Link
            to={`/blogs/${blog.id}`}
            className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center space-x-1"
          >
            <span>Đọc thêm</span>
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Blog
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Cập nhật những kiến thức và xu hướng mới nhất trong lĩnh vực công nghệ thông tin
          </p>
          <Link
            to="/blogs"
            className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-medium mt-4"
          >
            <span>Xem tất cả</span>
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {featuredBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/blogs"
            className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors inline-flex items-center space-x-2"
          >
            <span>Xem thêm bài viết</span>
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection; 
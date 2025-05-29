import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

interface CompanyDetail {
  id: string;
  name: string;
  logo: string;
  coverImage: string;
  description: string;
  industry: string;
  website: string;
  location: string;
  founded: string;
  size: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  overview: {
    title: string;
    content: string;
  }[];
  benefits: {
    title: string;
    description: string;
    icon: string;
  }[];
  openPositions: {
    id: string;
    title: string;
    location: string;
    type: string;
    department: string;
    postedDate: string;
  }[];
  photos: string[];
  rating: number;
  reviewCount: number;
  percentageRecommend: number;
  reviews: {
    id: string;
    rating: number;
    title: string;
    content: string;
    author: string;
    date: string;
  }[];
  blogPosts: {
    id: string;
    title: string;
    excerpt: string;
    date: string;
    author: string;
    image: string;
  }[];
}

const mockCompanyDetail: CompanyDetail = {
  id: '1',
  name: 'Bosch Global Software Technologies Company Limited',
  logo: '/images/logo.svg',
  coverImage: '/company-photos/stripe-cover.jpg',
  description: `Bosch Global Software Technologies là công ty phát triển phần mềm hàng đầu, cung cấp giải pháp công nghệ cho nhiều ngành công nghiệp.`,
  industry: 'Công nghệ thông tin',
  website: 'https://bosch.com',
  location: 'TP Hồ Chí Minh - Hà Nội',
  founded: '1990',
  size: '5000+ nhân viên',
  socialLinks: {
    linkedin: 'https://linkedin.com/company/bosch',
    twitter: 'https://twitter.com/bosch'
  },
  overview: [
    {
      title: 'Về chúng tôi',
      content: `Bosch Global Software Technologies là công ty phát triển phần mềm hàng đầu, cung cấp giải pháp công nghệ cho nhiều ngành công nghiệp khác nhau. Chúng tôi tạo ra các sản phẩm sáng tạo và bền vững cho một thế giới kết nối.`
    },
    {
      title: 'Sứ mệnh của chúng tôi',
      content: `Sứ mệnh của chúng tôi là phát triển các giải pháp phần mềm đổi mới, giúp cải thiện chất lượng cuộc sống và bảo vệ môi trường. Chúng tôi cam kết tạo ra các sản phẩm có tác động tích cực đến xã hội.`
    },
    {
      title: 'Văn hóa & Giá trị',
      content: `Văn hóa công ty của chúng tôi là một trong những tài sản quý giá nhất. Chúng tôi cam kết xây dựng một môi trường hòa nhập nơi tất cả nhân viên có thể phát triển. Các giá trị của chúng tôi là nền tảng cho mọi hoạt động.`
    }
  ],
  benefits: [
    {
      title: 'Chăm sóc sức khỏe',
      description: `Bảo hiểm y tế, nha khoa và thị lực toàn diện cho bạn và người phụ thuộc.`,
      icon: 'healthcare'
    },
    {
      title: 'Thời gian nghỉ linh hoạt',
      description: `Nghỉ phép khi bạn cần. Chúng tôi tin tưởng bạn có thể quản lý thời gian của mình.`,
      icon: 'vacation'
    },
    {
      title: 'Học tập & Phát triển',
      description: `Chúng tôi đầu tư vào sự phát triển của bạn với các khoản trợ cấp học tập và chương trình phát triển.`,
      icon: 'education'
    },
    {
      title: 'Thưởng hiệu quả',
      description: `Mọi nhân viên đều nhận được thưởng hiệu quả vì chúng tôi muốn bạn là một phần trong thành công của chúng tôi.`,
      icon: 'equity'
    }
  ],
  openPositions: [
    {
      id: '1',
      title: 'Technical Expert (Semiconductor)',
      location: 'Hà Nội',
      type: 'Toàn thời gian',
      department: 'Kỹ thuật',
      postedDate: '12 giờ trước'
    },
    {
      id: '2',
      title: 'Senior Software Engineer',
      location: 'Làm việc từ xa',
      type: 'Toàn thời gian',
      department: 'Kỹ thuật',
      postedDate: '13 ngày trước'
    },
    {
      id: '3',
      title: 'Product Designer',
      location: 'TP Hồ Chí Minh',
      type: 'Toàn thời gian',
      department: 'Thiết kế',
      postedDate: '15 ngày trước'
    }
  ],
  photos: [
    '/company-photos/stripe-office-1.jpg',
    '/company-photos/stripe-office-2.jpg',
    '/company-photos/stripe-office-3.jpg',
    '/company-photos/stripe-office-4.jpg'
  ],
  rating: 3.3,
  reviewCount: 279,
  percentageRecommend: 72,
  reviews: [
    {
      id: '1',
      rating: 4,
      title: 'Môi trường làm việc tốt',
      content: 'Công ty có môi trường làm việc chuyên nghiệp, nhiều cơ hội phát triển.',
      author: 'Nguyễn Văn A',
      date: '15/05/2023'
    },
    {
      id: '2',
      rating: 3,
      title: 'Lương thưởng hợp lý',
      content: 'Chế độ đãi ngộ ở mức khá, có thưởng theo hiệu suất làm việc.',
      author: 'Trần Thị B',
      date: '20/04/2023'
    }
  ],
  blogPosts: [
    {
      id: '1',
      title: 'Bosch ra mắt sản phẩm mới',
      excerpt: 'Công ty vừa ra mắt dòng sản phẩm mới với nhiều tính năng đột phá.',
      date: '10/06/2023',
      author: 'Phòng Marketing',
      image: '/images/blog1.jpg'
    },
    {
      id: '2',
      title: 'Tuyển dụng vị trí kỹ sư phần mềm',
      excerpt: 'Chúng tôi đang tìm kiếm những tài năng cho vị trí kỹ sư phần mềm.',
      date: '05/06/2023',
      author: 'Phòng Nhân sự',
      image: '/images/blog2.jpg'
    }
  ]
};

const CompanyProfile = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'intro' | 'reviews' | 'blog'>('intro');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Cover Image - Dark gradient background */}
      <div className="h-64 w-full bg-gradient-to-r from-purple-900 to-red-900">
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="flex items-center gap-6">
            <div className="bg-white p-2 rounded-lg">
              <img
                src={mockCompanyDetail.logo}
                alt={mockCompanyDetail.name}
                className="w-24 h-24 object-contain"
              />
            </div>
            <div className="text-white">
              <h1 className="text-3xl font-bold mb-2">{mockCompanyDetail.name}</h1>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd" />
                  </svg>
                  {mockCompanyDetail.location}
                </span>
                <span className="mx-2">•</span>
                <span className="text-blue-300 hover:text-blue-200">
                  <a href={`/jobs?company=${id}`}>{mockCompanyDetail.openPositions.length} việc làm đang tuyển dụng</a>
                </span>
              </div>
            </div>
          </div>
          <div className="ml-auto flex flex-col items-end">
            <div className="bg-white text-gray-800 rounded-lg p-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="text-4xl font-bold">{mockCompanyDetail.rating}</div>
                <div>
                  <div className="flex mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className={`w-5 h-5 ${star <= Math.floor(mockCompanyDetail.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <div className="text-sm">{mockCompanyDetail.reviewCount} đánh giá</div>
                </div>
              </div>
            </div>
            <div className="text-white">
              <span className="text-xl font-bold">{mockCompanyDetail.percentageRecommend}%</span> Khuyến khích làm việc tại đây
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex border-b border-gray-200 w-full">
            <button 
              onClick={() => setActiveTab('intro')} 
              className={`py-4 px-6 text-center font-medium text-base outline-none ${activeTab === 'intro' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Giới thiệu
            </button>
            <button 
              onClick={() => setActiveTab('reviews')} 
              className={`py-4 px-6 text-center font-medium text-base outline-none ${activeTab === 'reviews' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Đánh giá <span className="ml-1 bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">{mockCompanyDetail.reviewCount}</span>
            </button>
            <button 
              onClick={() => setActiveTab('blog')} 
              className={`py-4 px-6 text-center font-medium text-base outline-none ${activeTab === 'blog' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Bài viết
            </button>
          </div>
          <div className="flex gap-2">
            <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm">
              Viết đánh giá
            </button>
            <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm">
              Theo dõi
            </button>
          </div>
        </div>

        {activeTab === 'intro' && (
          <div className="grid grid-cols-3 gap-8 py-6">
            {/* Main Content */}
            <div className="col-span-2 space-y-8">
              {/* Overview Sections */}
              {mockCompanyDetail.overview.map((section, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="text-xl font-bold mb-4">{section.title}</h2>
                  <p className="text-gray-600">{section.content}</p>
                </div>
              ))}

              {/* Office Photos */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-6">Cuộc sống tại {mockCompanyDetail.name}</h2>
                <div className="grid grid-cols-2 gap-4">
                  {mockCompanyDetail.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`${mockCompanyDetail.name} office`}
                      className="rounded-lg w-full h-48 object-cover"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Company Info */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4">Thông tin công ty</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm text-gray-500 mb-1">Website</h3>
                    <a
                      href={mockCompanyDetail.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {mockCompanyDetail.website.replace('https://', '')}
                    </a>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500 mb-1">Ngành nghề</h3>
                    <p className="font-medium">{mockCompanyDetail.industry}</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500 mb-1">Quy mô công ty</h3>
                    <p className="font-medium">{mockCompanyDetail.size}</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500 mb-1">Năm thành lập</h3>
                    <p className="font-medium">{mockCompanyDetail.founded}</p>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-6">Phúc lợi</h2>
                <div className="space-y-4">
                  {mockCompanyDetail.benefits.map((benefit, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 text-xl">
                          {benefit.icon === 'healthcare' && '🏥'}
                          {benefit.icon === 'vacation' && '🌴'}
                          {benefit.icon === 'education' && '📚'}
                          {benefit.icon === 'equity' && '💰'}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{benefit.title}</h3>
                        <p className="text-sm text-gray-600">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Open Positions */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Vị trí đang tuyển</h2>
                  <span className="text-sm text-gray-500">{mockCompanyDetail.openPositions.length} jobs</span>
                </div>
                <div className="space-y-4">
                  {mockCompanyDetail.openPositions.map((position) => (
                    <a
                      key={position.id}
                      href={`/jobs/${position.id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-blue-600"
                    >
                      <h3 className="font-semibold mb-2">{position.title}</h3>
                      <div className="text-sm text-gray-500">
                        <p>{position.location}</p>
                        <p>{position.department} • {position.type}</p>
                        <p className="text-xs mt-2 text-gray-400">{position.postedDate}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="py-6">
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <h2 className="text-xl font-bold mb-4">Đánh giá chung</h2>
              <div className="grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">{mockCompanyDetail.rating}</div>
                  <div className="flex justify-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className={`w-5 h-5 ${star <= Math.floor(mockCompanyDetail.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <div className="text-gray-500">{mockCompanyDetail.reviewCount} đánh giá</div>
                </div>
                <div>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center">
                        <span className="w-8 text-sm">{rating} ★</span>
                        <div className="flex-1 h-4 mx-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-yellow-400" 
                            style={{ width: rating === 3 ? '45%' : rating === 4 ? '31%' : rating === 5 ? '9%' : rating === 2 ? '13%' : '2%' }}
                          ></div>
                        </div>
                        <span className="w-8 text-sm text-right">
                          {rating === 3 ? '45%' : rating === 4 ? '31%' : rating === 5 ? '9%' : rating === 2 ? '13%' : '2%'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  <div className="inline-block rounded-full bg-green-100 p-6">
                    <div className="text-4xl font-bold text-green-600">{mockCompanyDetail.percentageRecommend}%</div>
                  </div>
                  <p className="mt-2 text-gray-600">Khuyến khích làm việc tại đây</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {mockCompanyDetail.reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex justify-between mb-3">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className={`w-5 h-5 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{review.title}</h3>
                  <p className="text-gray-600 mb-4">{review.content}</p>
                  <div className="text-sm text-gray-500">
                    Đánh giá bởi {review.author}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'blog' && (
          <div className="grid grid-cols-2 gap-6 py-6">
            {mockCompanyDetail.blogPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg overflow-hidden shadow-sm">
                <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{post.author}</span>
                    <span>{post.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CompanyProfile; 
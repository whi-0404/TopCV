import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

interface BlogPost {
  id: number;
  title: string;
  summary: string;
  image: string;
  date: string;
  author: string;
}

const mockBlogs: BlogPost[] = [
  {
    id: 1,
    title: 'Top 10 Most Popular Programming Languages in 2024',
    summary: 'Explore the trending programming languages that are most sought after by employers in 2024.',
    image: '/images/blog/programming.jpg',
    date: '15/03/2024',
    author: 'John Doe'
  },
  {
    id: 2,
    title: 'How to Become a Full-stack Developer',
    summary: 'Detailed guide on the learning path and essential skills needed to become a professional Full-stack Developer.',
    image: '/images/blog/fullstack.jpg',
    date: '14/03/2024',
    author: 'Jane Smith'
  },
  {
    id: 3,
    title: 'AI and the Future of IT',
    summary: 'Understanding the impact of AI on the IT industry and future career opportunities.',
    image: '/images/blog/ai.jpg',
    date: '13/03/2024',
    author: 'David Wilson'
  },
  {
    id: 4,
    title: 'Tech Trends 2024',
    summary: 'The latest technology trends shaping the future of the IT industry.',
    image: '/images/blog/tech-trends.jpg',
    date: '12/03/2024',
    author: 'Sarah Johnson'
  }
];

const Blog = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % mockBlogs.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? mockBlogs.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % mockBlogs.length
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Blog IT</h1>

        {/* Featured Blog Slider */}
        <div className="relative mb-12 rounded-xl overflow-hidden shadow-lg">
          <div className="relative h-[500px]">
            {mockBlogs.map((blog, index) => (
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
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-8">
                  <h2 className="text-2xl font-bold text-white mb-2">{blog.title}</h2>
                  <p className="text-gray-200 mb-4">{blog.summary}</p>
                  <div className="flex items-center text-gray-300 text-sm">
                    <span>{blog.date}</span>
                    <span className="mx-2">•</span>
                    <span>{blog.author}</span>
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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all"
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {mockBlogs.map((_, index) => (
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockBlogs.map(blog => (
            <div key={blog.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{blog.title}</h3>
                <p className="text-gray-600 mb-4">{blog.summary}</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="text-gray-500">
                    <span>{blog.date}</span>
                    <span className="mx-2">•</span>
                    <span>{blog.author}</span>
                  </div>
                  <Link
                    to={`/blog/${blog.id}`}
                    className="text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Read more
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog; 
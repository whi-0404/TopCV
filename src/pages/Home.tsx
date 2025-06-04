import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import SearchBar from '../components/home/SearchBar';
import CategoryCard from '../components/home/CategoryCard';
import JobCard from '../components/job/JobCard';

const categories = [
  { title: 'Design', jobCount: 235, icon: '🎨', to: '/jobs?category=design' },
  { title: 'Sales', jobCount: 756, icon: '💼', to: '/jobs?category=sales' },
  { title: 'Marketing', jobCount: 140, icon: '📈', to: '/jobs?category=marketing' },
  { title: 'Finance', jobCount: 325, icon: '💰', to: '/jobs?category=finance' },
  { title: 'Technology', jobCount: 436, icon: '💻', to: '/jobs?category=technology' },
  { title: 'Engineering', jobCount: 542, icon: '⚙️', to: '/jobs?category=engineering' },
  { title: 'Business', jobCount: 211, icon: '📊', to: '/jobs?category=business' },
  { title: 'Human Resource', jobCount: 346, icon: '👥', to: '/jobs?category=hr' },
];

const featuredJobs = [
  {
    id: '1',
    title: 'Product Designer',
    company: {
      name: 'Dropbox',
      logo: '/company-logos/dropbox.png',
      location: 'San Francisco, US'
    },
    type: 'Full Time',
    tags: ['Design', 'Remote', 'Senior']
  },
  // Add more featured jobs here
];

const latestJobs = [
  {
    id: '1',
    title: 'Social Media Assistant',
    company: {
      name: 'Netflix',
      logo: '/company-logos/netflix.png',
      location: 'Paris, France'
    },
    type: 'Full Time',
    tags: ['Marketing', 'Social Media']
  },
  // Add more latest jobs here
];

interface Company {
  id: number;
  name: string;
  logo: string;
  location: string;
  revenue: string;
  jobCount: number;
  description: string;
  tags: string[];
}

const mockCompanies: Company[] = [
  {
    id: 1,
    name: 'Nomad',
    logo: '/images/nomad-logo.svg',
    location: 'Paris, France',
    revenue: '75,000',
    jobCount: 2,
    description: 'A leading tech company specializing in remote work solutions',
    tags: ['Technology', 'Remote Work']
  },
  {
    id: 2,
    name: 'Nomad',
    logo: '/images/nomad-logo.svg',
    location: 'Paris, France',
    revenue: '75,000',
    jobCount: 2,
    description: 'Nomad tạo ra doanh thu 728.000 USD (USD)',
    tags: ['Full Time', 'TP.HCM']
  },
  {
    id: 3,
    name: 'Nomad',
    logo: '/images/nomad-logo.svg',
    location: 'Paris, France',
    revenue: '75,000',
    jobCount: 2,
    description: 'Nomad tạo ra doanh thu 728.000 USD (USD)',
    tags: ['Full Time', 'TP.HCM']
  },
  {
    id: 4,
    name: 'Nomad',
    logo: '/images/nomad-logo.svg',
    location: 'Paris, France',
    revenue: '75,000',
    jobCount: 2,
    description: 'Nomad tạo ra doanh thu 728.000 USD (USD)',
    tags: ['Full Time', 'TP.HCM']
  },
  {
    id: 5,
    name: 'Nomad',
    logo: '/images/nomad-logo.svg',
    location: 'Paris, France',
    revenue: '75,000',
    jobCount: 2,
    description: 'Nomad tạo ra doanh thu 728.000 USD (USD)',
    tags: ['Full Time', 'TP.HCM']
  },
  {
    id: 6,
    name: 'Nomad',
    logo: '/images/nomad-logo.svg',
    location: 'Paris, France',
    revenue: '75,000',
    jobCount: 2,
    description: 'Nomad tạo ra doanh thu 728.000 USD (USD)',
    tags: ['Full Time', 'TP.HCM']
  }
];

const mockJobs = [
  {
    id: 1,
    title: 'Project Manager',
    company: 'Nomad',
    logo: '/images/nomad-logo.svg',
    salary: '15-18k',
    type: 'Remote'
  },
  {
    id: 2,
    title: 'Frontend Developer',
    company: 'Discord',
    logo: '/images/discord-logo.svg',
    salary: '12-20k',
    type: 'Full Time'
  },
  {
    id: 3,
    title: 'UX/UI Designer',
    company: 'Maze',
    logo: '/images/maze-logo.svg',
    salary: '10-15k',
    type: 'Full Time'
  },
  {
    id: 4,
    title: 'Data Scientist',
    company: 'Udacity',
    logo: '/images/udacity-logo.svg',
    salary: '18-25k',
    type: 'Remote'
  },
  {
    id: 5,
    title: 'Product Designer',
    company: 'Webflow',
    logo: '/images/webflow-logo.svg',
    salary: '14-22k',
    type: 'Full Time'
  },
  {
    id: 6,
    title: 'Blockchain Developer',
    company: 'Foundation',
    logo: '/images/foundation-logo.svg',
    salary: '20-30k',
    type: 'Remote'
  }
];

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center mb-12">
            <h1 className="hero-heading">
              Get your dream job with Find Jobs.
            </h1>
            <SearchBar />
            <div className="relative w-full max-w-3xl mt-12">
              <img 
                src="/images/hero-illustration.png" 
                alt="Hero" 
                className="w-full"
              />
              <img 
                src="/images/plant-1.svg" 
                alt="Plant" 
                className="absolute left-0 bottom-0 w-16"
              />
              <img 
                src="/images/plant-2.svg" 
                alt="Plant" 
                className="absolute right-0 bottom-0 w-16"
              />
            </div>
          </div>
        </div>
      </section>

      {/* IT Jobs Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="section-heading">IT Jobs</h2>
            <Link to="/jobs" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium px-4 py-2 rounded-full bg-emerald-50">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <img src={job.logo} alt={job.company} className="w-12 h-12 rounded-lg" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-600">{job.company}</p>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                      <span>${job.salary} / Month</span>
                      <span>•</span>
                      <span>{job.type}</span>
                    </div>
                  </div>
                  <button className="text-emerald-600 hover:text-emerald-700">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                  </button>
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                  Apply
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IT Companies Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="section-heading">IT Companies</h2>
            <Link to="/companies" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium px-4 py-2 rounded-full bg-emerald-50">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockCompanies.map((company) => (
              <Link 
                key={company.id}
                to={`/companies/${company.id}`}
                className="block bg-white rounded-lg border border-gray-200 p-6 hover:border-emerald-500 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <img src={company.logo} alt={company.name} className="w-12 h-12 rounded-lg" />
                  <span className="text-sm text-gray-500">{company.jobCount} Jobs</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{company.name}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{company.description}</p>
                <div className="flex flex-wrap gap-2">
                  {company.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className={`px-3 py-1 rounded-full text-sm ${
                        tag === 'Crypto' 
                          ? 'bg-purple-50 text-purple-600' 
                          : tag === 'Technology'
                          ? 'bg-orange-50 text-orange-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="section-heading">Blog</h2>
            <Link to="/blog" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium px-4 py-2 rounded-full bg-emerald-50">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <img src="/images/blog-1.jpg" alt="Lorem ipsum placeholder text" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  "Lorem ipsum" is placeholder text commonly used in graphic design and web development
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  "Lorem ipsum", also known as "lipsum", is dummy text used in printing and typesetting industry. Learn about its history and usage in web design...
                </p>
                <Link to="/blog/1" className="text-sm text-emerald-600 hover:text-emerald-700">
                  Read more →
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <img src="/images/blog-2.jpg" alt="UI design trends 2025" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  5 Outstanding User Interface (UI) Design Trends for 2025
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  In 2025, UI design will evolve towards minimalism, letting users easily focus and interact with multiple dynamic elements...
                </p>
                <Link to="/blog/2" className="text-sm text-emerald-600 hover:text-emerald-700">
                  Read more →
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <img src="/images/blog-3.jpg" alt="Responsive design importance" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Why is responsive design important in modern web development?
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Responsive design helps improve user experience and boosts SEO rankings for websites across different devices...
                </p>
                <Link to="/blog/3" className="text-sm text-emerald-600 hover:text-emerald-700">
                  Read more →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="section-heading">Contact Us</h2>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="First Name*"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Last Name*"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Email Address*"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Location*"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  placeholder="Message"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                ></textarea>
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                >
                  Apply Now
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home; 
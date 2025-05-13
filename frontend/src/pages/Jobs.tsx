import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

interface Job {
  id: number;
  title: string;
  company: string;
  logo: string;
  location: string;
  type: string;
  tags: string[];
  postedDate: string;
  capacity: number;
  applied: number;
}

const mockJobs: Job[] = [
  {
    id: 1,
    title: 'Social Media Assistant',
    company: 'Nomad',
    logo: '/images/company-logo.png',
    location: 'Paris, France',
    type: 'Full-Time',
    tags: ['Marketing', 'Design'],
    postedDate: '2024-03-10',
    capacity: 10,
    applied: 5
  },
  {
    id: 2,
    title: 'Brand Designer',
    company: 'Dropbox',
    logo: '/images/company-logo.png',
    location: 'San Francisco, USA',
    type: 'Full-Time',
    tags: ['Marketing', 'Design'],
    postedDate: '2024-03-09',
    capacity: 15,
    applied: 2
  },
  // Thêm các công việc khác tương tự
];

const Jobs = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState('most-relevant');

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto max-w-7xl px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Find your <span className="text-emerald-500">dream job</span></h1>
            <p className="text-gray-600">Find your next career at companies like HubSpot, Nike, and Dropbox</p>
          </div>

          {/* Search Bar */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Job title or keyword"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="TPHCM"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <button className="px-8 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                Search
              </button>
            </div>
            <div className="flex gap-2 mt-4">
              <span className="text-sm text-gray-500">Popular:</span>
              {['UI Designer', 'UX Researcher', 'Android', 'Admin'].map((tag) => (
                <Link
                  key={tag}
                  to={`/jobs?q=${tag}`}
                  className="text-sm text-emerald-600 hover:text-emerald-700"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex gap-6">
            {/* Filters */}
            <div className="w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="border-b pb-4 mb-4">
                  <h3 className="font-semibold mb-2">Type of Employment</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox text-emerald-600" />
                      <span className="ml-2 text-sm">Full-time (3)</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox text-emerald-600" />
                      <span className="ml-2 text-sm">Part-Time (5)</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox text-emerald-600" />
                      <span className="ml-2 text-sm">Remote (2)</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox text-emerald-600" />
                      <span className="ml-2 text-sm">Internship (24)</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox text-emerald-600" />
                      <span className="ml-2 text-sm">Contract (3)</span>
                    </label>
                  </div>
                </div>

                <div className="border-b pb-4 mb-4">
                  <h3 className="font-semibold mb-2">Categories</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox text-emerald-600" />
                      <span className="ml-2 text-sm">Design (24)</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox text-emerald-600" />
                      <span className="ml-2 text-sm">Sales (3)</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox text-emerald-600" />
                      <span className="ml-2 text-sm">Marketing (3)</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox text-emerald-600" />
                      <span className="ml-2 text-sm">Business (3)</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox text-emerald-600" />
                      <span className="ml-2 text-sm">Human Resource (5)</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox text-emerald-600" />
                      <span className="ml-2 text-sm">Finance (4)</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox text-emerald-600" />
                      <span className="ml-2 text-sm">Engineering (4)</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox text-emerald-600" />
                      <span className="ml-2 text-sm">Technology (5)</span>
                    </label>
                  </div>
                </div>

                <div className="border-b pb-4 mb-4">
                  <h3 className="font-semibold mb-2">Job Level</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox text-emerald-600" />
                      <span className="ml-2 text-sm">Entry Level (57)</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox text-emerald-600" />
                      <span className="ml-2 text-sm">Mid Level (3)</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox text-emerald-600" />
                      <span className="ml-2 text-sm">Senior Level (5)</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox text-emerald-600" />
                      <span className="ml-2 text-sm">Director (12)</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox text-emerald-600" />
                      <span className="ml-2 text-sm">VP or Above (8)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Salary Range</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox text-emerald-600" />
                      <span className="ml-2 text-sm">$700 - $1000 (4)</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox text-emerald-600" />
                      <span className="ml-2 text-sm">$1100 - $1500 (6)</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox text-emerald-600" />
                      <span className="ml-2 text-sm">$1500 - $2000 (10)</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox text-emerald-600" />
                      <span className="ml-2 text-sm">$3000 or above (4)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Listings */}
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">All Jobs</h2>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Sort by:</span>
                      <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="text-sm border-none bg-transparent focus:outline-none text-gray-700"
                      >
                        <option value="most-relevant">Most relevant</option>
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                      </select>
                    </div>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded ${viewMode === 'grid' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-400'}`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded ${viewMode === 'list' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-400'}`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">Showing 73 results</p>
              </div>

              <div className={`space-y-4 ${viewMode === 'grid' ? 'grid grid-cols-2 gap-4' : ''}`}>
                {mockJobs.map((job) => (
                  <div key={job.id} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-start gap-4">
                      <img src={job.logo} alt={job.company} className="w-12 h-12 rounded-lg" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{job.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-600">{job.company}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-sm text-gray-600">{job.location}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-sm">
                            {job.type}
                          </span>
                          {job.tags.map((tag) => (
                            <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button className="text-emerald-600 hover:text-emerald-700">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm text-gray-500">
                        {job.applied} applied of {job.capacity} capacity
                      </span>
                      <button className="px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors text-sm font-medium">
                        Apply
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center gap-2 mt-8">
                <button className="p-2 rounded hover:bg-gray-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    className={`w-8 h-8 rounded ${
                      page === 1 ? 'bg-emerald-600 text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <span>...</span>
                <button className="w-8 h-8 rounded hover:bg-gray-100">33</button>
                <button className="p-2 rounded hover:bg-gray-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Jobs; 
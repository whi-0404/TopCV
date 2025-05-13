import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

interface Company {
  id: number;
  name: string;
  logo: string;
  description: string;
  jobCount: number;
  tags: string[];
}

const mockCompanies: Company[] = [
  {
    id: 1,
    name: 'Nomad',
    logo: '/images/nomad-logo.svg',
    description: 'Nomad is located in Paris, France. Nomad has generates $728,000 in sales (USD).',
    jobCount: 3,
    tags: ['Business Service']
  },
  {
    id: 2,
    name: 'Discord',
    logo: '/images/discord-logo.svg',
    description: "We'd love to work with someone like you. We care about creating a delightful experience.",
    jobCount: 3,
    tags: ['Business Service']
  },
  {
    id: 3,
    name: 'Maze',
    logo: '/images/maze-logo.svg',
    description: "We're a passionate bunch working from all over the world to build the future of rapid testing together.",
    jobCount: 3,
    tags: ['Business Service']
  },
  {
    id: 4,
    name: 'Udacity',
    logo: '/images/udacity-logo.svg',
    description: 'Udacity is a new type of online university that teaches the actual programming skills.',
    jobCount: 3,
    tags: ['Business Service', 'Technology']
  },
  {
    id: 5,
    name: 'Webflow',
    logo: '/images/webflow-logo.svg',
    description: 'Webflow is the first design and hosting platform built from the ground up for the mobile age.',
    jobCount: 3,
    tags: ['Business Service', 'Technology']
  },
  {
    id: 6,
    name: 'Foundation',
    logo: '/images/foundation-logo.svg',
    description: 'Foundation helps creators mint and auction their digital artworks as NFTs on the Ethereum blockchain.',
    jobCount: 3,
    tags: ['Business Service', 'Crypto']
  }
];

const CompaniesSearch = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto max-w-7xl px-4">
          {/* Search Section */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  placeholder="Enter location"
                />
              </div>
            </div>
            <div className="mt-4">
              <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                Search
              </button>
            </div>
          </div>

          {/* Popular Companies */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">IT Companies</h2>
            <p className="text-gray-600 mb-8">Based on your profile, company preferences and recent activities</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CompaniesSearch; 
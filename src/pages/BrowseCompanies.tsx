import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

interface Company {
  id: string;
  name: string;
  logo: string;
  description: string;
  jobCount: number;
  tags: string[];
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  companiesCount?: number;
}

const BrowseCompanies = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const recommendedCompanies: Company[] = [
    {
      id: '1',
      name: 'Nomad',
      logo: '/company-logos/nomad.png',
      description: 'Nomad is located in Paris, France. Nomad has generates $725,000 in sales (USD).',
      jobCount: 3,
      tags: ['Business Service']
    },
    {
      id: '2',
      name: 'Discord',
      logo: '/company-logos/discord.png',
      description: "We'd love to work with someone like you. We care about creating a delightful experience.",
      jobCount: 3,
      tags: ['Business Service']
    },
    {
      id: '3',
      name: 'Maze',
      logo: '/company-logos/maze.png',
      description: "We're a passionate bunch working from all over the world to build the future of rapid testing together.",
      jobCount: 3,
      tags: ['Business Service']
    },
    {
      id: '4',
      name: 'Udacity',
      logo: '/company-logos/udacity.png',
      description: 'Udacity is a new type of online university that teaches the actual programming skills.',
      jobCount: 3,
      tags: ['Business Service']
    },
    {
      id: '5',
      name: 'Webflow',
      logo: '/company-logos/webflow.png',
      description: 'Webflow is the first design and hosting platform built from the ground up for the mobile age.',
      jobCount: 3,
      tags: ['Business Service', 'Technology']
    },
    {
      id: '6',
      name: 'Foundation',
      logo: '/company-logos/foundation.png',
      description: 'Foundation helps creators mint and auction their digital artworks as NFTs on the Ethereum blockchain.',
      jobCount: 3,
      tags: ['Business Service', 'Crypto']
    }
  ];

  const categories: Category[] = [
    {
      id: 'design',
      name: 'Design',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      companiesCount: 24
    },
    {
      id: 'fintech',
      name: 'Fintech',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'hosting',
      name: 'Hosting',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
        </svg>
      )
    },
    {
      id: 'business',
      name: 'Business Service',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'development',
      name: 'Development',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )
    }
  ];

  const designCompanies: Company[] = [
    {
      id: 'pentagram',
      name: 'Pentagram',
      logo: '/company-logos/pentagram.png',
      description: '',
      jobCount: 3,
      tags: []
    },
    {
      id: 'wolff-olins',
      name: 'Wolff Olins',
      logo: '/company-logos/wolff-olins.png',
      description: '',
      jobCount: 3,
      tags: []
    },
    {
      id: 'clay',
      name: 'Clay',
      logo: '/company-logos/clay.png',
      description: '',
      jobCount: 3,
      tags: []
    },
    {
      id: 'mediamonks',
      name: 'MediaMonks',
      logo: '/company-logos/mediamonks.png',
      description: '',
      jobCount: 3,
      tags: []
    },
    {
      id: 'packer',
      name: 'Packer',
      logo: '/company-logos/packer.png',
      description: '',
      jobCount: 3,
      tags: []
    },
    {
      id: 'square',
      name: 'Square',
      logo: '/company-logos/square.png',
      description: '',
      jobCount: 3,
      tags: []
    },
    {
      id: 'divy',
      name: 'Divy',
      logo: '/company-logos/divy.png',
      description: '',
      jobCount: 3,
      tags: []
    },
    {
      id: 'webflow',
      name: 'WebFlow',
      logo: '/company-logos/webflow.png',
      description: '',
      jobCount: 3,
      tags: []
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">
            Find your{' '}
            <span className="text-blue-600">dream companies</span>
          </h1>
          <p className="text-gray-600">
            Find the dream companies you dream work for
          </p>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto mt-8">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Company name or keyword"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                />
              </div>
              <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Search
              </button>
            </div>
            <div className="mt-4 text-left text-sm text-gray-500">
              Popular: Twitter, Microsoft, Apple, Facebook
            </div>
          </div>
        </section>

        {/* Recommended Companies */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-2">Recommended Companies</h2>
          <p className="text-gray-600 mb-8">
            Based on your profile, company preferences, and recent activity
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedCompanies.map((company) => (
              <Link
                to={`/companies/${company.id}`}
                key={company.id}
                className="block p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="w-12 h-12 rounded-lg"
                  />
                  <span className="text-blue-600">
                    {company.jobCount} Jobs
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{company.name}</h3>
                <p className="text-gray-600 mb-4">{company.description}</p>
                <div className="flex flex-wrap gap-2">
                  {company.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Companies by Category */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Companies by Category</h2>
          <div className="flex gap-4 mb-12 overflow-x-auto pb-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex-none w-48 h-48 flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:border-blue-600 cursor-pointer transition-colors"
              >
                <div className="text-blue-600 mb-4">{category.icon}</div>
                <h3 className="text-lg font-medium text-center">{category.name}</h3>
                {category.companiesCount && (
                  <span className="text-sm text-gray-500 mt-2">
                    {category.companiesCount} Results
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Design Companies */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <h3 className="text-xl font-bold">24 Results</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {designCompanies.map((company) => (
                <div
                  key={company.id}
                  className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow text-center"
                >
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="w-16 h-16 mx-auto mb-4"
                  />
                  <h4 className="font-medium mb-2">{company.name}</h4>
                  <span className="text-blue-600 text-sm">
                    {company.jobCount} Jobs
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <button className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
                <span>View more Design companies</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BrowseCompanies; 
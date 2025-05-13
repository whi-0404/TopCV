import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import CompanyFilter from '../components/company/CompanyFilter';
import CompanyCard from '../components/company/CompanyCard';

interface Company {
  id: string;
  name: string;
  logo: string;
  description: string;
  jobCount: number;
  tags: string[];
}

const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Stripe',
    logo: '/company-logos/stripe.png',
    description: `Stripe is a software platform for starting and running internet businesses. Millions of businesses rely on Stripe's software tools...`,
    jobCount: 7,
    tags: ['Business', 'Payment gateway']
  },
  {
    id: '2',
    name: 'Truebill',
    logo: '/company-logos/truebill.png',
    description: `Take control of your money. Truebill develops a mobile app that helps consumers take control of their financial...`,
    jobCount: 7,
    tags: ['Business']
  },
  {
    id: '3',
    name: 'Square',
    logo: '/company-logos/square.png',
    description: `Square builds common business tools in unconventional ways so more people can start, run, and grow their businesses.`,
    jobCount: 7,
    tags: ['Business', 'Blockchain']
  },
  {
    id: '4',
    name: 'Coinbase',
    logo: '/company-logos/coinbase.png',
    description: `Coinbase is a digital currency wallet and platform where merchants and consumers can transact with new digital currencies.`,
    jobCount: 7,
    tags: ['Business', 'Blockchain']
  },
  {
    id: '5',
    name: 'Robinhood',
    logo: '/company-logos/robinhood.png',
    description: `Robinhood is lowering barriers, removing fees, and providing greater access to financial information.`,
    jobCount: 7,
    tags: ['Business']
  },
  {
    id: '6',
    name: 'Kraken',
    logo: '/company-logos/kraken.png',
    description: `Based in San Francisco, Kraken is the world's largest global bitcoin exchange in euro volume and liquidity.`,
    jobCount: 7,
    tags: ['Business', 'Blockchain']
  },
  {
    id: '7',
    name: 'Revolut',
    logo: '/company-logos/revolut.png',
    description: `When Revolut was founded in 2015, we had a vision to build a sustainable, digital alternative to traditional big banks.`,
    jobCount: 7,
    tags: ['Business']
  },
  {
    id: '8',
    name: 'Divvy',
    logo: '/company-logos/divvy.png',
    description: `Divvy is a secure financial platform for businesses to manage payments and subscriptions.`,
    jobCount: 7,
    tags: ['Business', 'Blockchain']
  }
];

const SearchCompanies = () => {
  const [searchParams] = useSearchParams();
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState('most-relevant');

  const handleFilterChange = (filterId: string) => {
    setSelectedFilters(prev =>
      prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">All Companies</h1>
            <p className="text-gray-600">Showing {mockCompanies.length} results</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-gray-600">
                Sort by:
              </label>
              <select
                id="sort"
                className="text-sm border border-gray-300 rounded-lg px-3 py-2"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="most-relevant">Most relevant</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${
                  viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${
                  viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters */}
          <div className="w-64 flex-shrink-0">
            <CompanyFilter
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Results */}
          <div className="flex-1">
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
              {mockCompanies.map((company) => (
                <CompanyCard key={company.id} {...company} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              {[1, 2, 3, '...', 10].map((page, index) => (
                <button
                  key={index}
                  className={`w-8 h-8 rounded-lg ${
                    page === 2
                      ? 'bg-indigo-600 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SearchCompanies; 
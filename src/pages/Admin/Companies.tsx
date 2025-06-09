import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowPathIcon,
  MapPinIcon,
  UserGroupIcon,
  StarIcon
} from '@heroicons/react/24/outline';

interface Company {
  id: number;
  name: string;
  description: string;
  logo_url: string;
  website_url: string;
  employees_range: string;
  follower_count: number;
  address: string;
  user_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  total_jobs: number;
  rating: number;
  review_count: number;
}

const Companies: React.FC = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: 1,
      name: 'TechCorp Vietnam',
      description: 'Leading technology solutions provider in Southeast Asia',
      logo_url: '/images/companies/techcorp.jpg',
      website_url: 'https://techcorp.vn',
      employees_range: '100-500',
      follower_count: 1250,
      address: 'District 1, Ho Chi Minh City',
      user_id: 101,
      is_active: true,
      created_at: '2024-01-15',
      updated_at: '2024-01-20',
      total_jobs: 15,
      rating: 4.5,
      review_count: 89
    },
    {
      id: 2,
      name: 'StartupHub',
      description: 'Innovative startup incubator and technology company',
      logo_url: '/images/companies/startup.jpg',
      website_url: 'https://startuphub.com',
      employees_range: '50-100',
      follower_count: 850,
      address: 'Cau Giay, Hanoi',
      user_id: 102,
      is_active: true,
      created_at: '2024-01-10',
      updated_at: '2024-01-18',
      total_jobs: 8,
      rating: 4.2,
      review_count: 45
    },
    {
      id: 3,
      name: 'Digital Solutions Ltd',
      description: 'Digital transformation and consulting services',
      logo_url: '/images/companies/digital.jpg',
      website_url: 'https://digitalsolutions.vn',
      employees_range: '200-1000',
      follower_count: 2100,
      address: 'Hai Chau, Da Nang',
      user_id: 103,
      is_active: false,
      created_at: '2024-01-05',
      updated_at: '2024-01-12',
      total_jobs: 3,
      rating: 3.8,
      review_count: 32
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSize, setFilterSize] = useState('all');
  const [selectedCompanies, setSelectedCompanies] = useState<number[]>([]);

  // Admin authentication check
  useEffect(() => {
    const checkAdminAuth = () => {
      const user = localStorage.getItem('user');
      const adminSession = localStorage.getItem('adminSession');
      
      if (!user || !adminSession) {
        navigate('/admin/login', { replace: true });
        return;
      }

      try {
        const userData = JSON.parse(user);
        if (userData.userType !== 'admin') {
          navigate('/admin/login', { replace: true });
          return;
        }
      } catch (error) {
        navigate('/admin/login', { replace: true });
        return;
      }
    };

    checkAdminAuth();
  }, [navigate]);

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = 
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && company.is_active) ||
      (filterStatus === 'inactive' && !company.is_active);
    
    const matchesSize = filterSize === 'all' || company.employees_range === filterSize;
    
    return matchesSearch && matchesStatus && matchesSize;
  });

  const handleSelectCompany = (companyId: number) => {
    setSelectedCompanies(prev => 
      prev.includes(companyId) 
        ? prev.filter(id => id !== companyId)
        : [...prev, companyId]
    );
  };

  const handleSelectAll = () => {
    setSelectedCompanies(
      selectedCompanies.length === filteredCompanies.length 
        ? [] 
        : filteredCompanies.map(company => company.id)
    );
  };

  const handleBulkActivate = () => {
    setCompanies(prev => prev.map(company => 
      selectedCompanies.includes(company.id) ? { ...company, is_active: true } : company
    ));
    setSelectedCompanies([]);
  };

  const handleBulkDeactivate = () => {
    setCompanies(prev => prev.map(company => 
      selectedCompanies.includes(company.id) ? { ...company, is_active: false } : company
    ));
    setSelectedCompanies([]);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <StarIcon
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <BuildingOfficeIcon className="w-8 h-8 text-teal-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Company Management</h1>
                <p className="text-sm text-gray-500">{companies.length} total companies</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <ArrowPathIcon className="w-4 h-4 mr-2" />
                Refresh
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700">
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Company
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mr-4">
                <BuildingOfficeIcon className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Companies</p>
                <p className="text-2xl font-bold text-gray-900">{companies.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <UserGroupIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active Companies</p>
                <p className="text-2xl font-bold text-gray-900">{companies.filter(c => c.is_active).length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <StarIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(companies.reduce((acc, c) => acc + c.rating, 0) / companies.length).toFixed(1)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <UserGroupIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Followers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {companies.reduce((acc, c) => acc + c.follower_count, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* Size Filter */}
            <select
              value={filterSize}
              onChange={(e) => setFilterSize(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="all">All Sizes</option>
              <option value="1-50">1-50 employees</option>
              <option value="50-100">50-100 employees</option>
              <option value="100-500">100-500 employees</option>
              <option value="500+">500+ employees</option>
            </select>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
                setFilterSize('all');
              }}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedCompanies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-teal-800">
                {selectedCompanies.length} company(s) selected
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={handleBulkActivate}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Activate
                </button>
                <button
                  onClick={handleBulkDeactivate}
                  className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700"
                >
                  Deactivate
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Companies Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedCompanies.length === filteredCompanies.length && filteredCompanies.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size & Followers
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCompanies.map((company, index) => (
                  <motion.tr
                    key={company.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedCompanies.includes(company.id)}
                        onChange={() => handleSelectCompany(company.id)}
                        className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <div className="h-12 w-12 rounded-lg bg-teal-100 flex items-center justify-center">
                            <BuildingOfficeIcon className="w-6 h-6 text-teal-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{company.name}</div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">{company.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 flex items-center mb-1">
                        <MapPinIcon className="w-4 h-4 text-gray-400 mr-1" />
                        {company.address}
                      </div>
                      <div className="text-sm text-gray-500">{company.total_jobs} active jobs</div>
                      <a href={company.website_url} target="_blank" rel="noopener noreferrer" 
                         className="text-sm text-teal-600 hover:text-teal-800">
                        {company.website_url}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{company.employees_range} employees</div>
                      <div className="text-sm text-gray-500">{company.follower_count.toLocaleString()} followers</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex mr-1">
                          {renderStars(company.rating)}
                        </div>
                        <span className="text-sm text-gray-500 ml-1">
                          {company.rating} ({company.review_count})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        company.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {company.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button className="text-yellow-600 hover:text-yellow-900">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredCompanies.length}</span> of{' '}
              <span className="font-medium">{filteredCompanies.length}</span> results
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1 bg-teal-600 text-white rounded text-sm">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Companies; 
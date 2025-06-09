import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BriefcaseIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowPathIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface Job {
  job_id: number;
  company_id: number;
  job_skill_id: number;
  title: string;
  description: string;
  requirements: string;
  benefits: string;
  location: string;
  working_time: string;
  salary: string;
  experience_required: string;
  deadline: string;
  job_type_id: number;
  job_level_id: number;
  applied_count: number;
  hiring_quota: number;
  status: string;
  created_at: string;
  updated_at: string;
  company_name: string;
  job_type: string;
  job_level: string;
  view_count: number;
}

const Jobs: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([
    {
      job_id: 1,
      company_id: 1,
      job_skill_id: 1,
      title: 'Senior React Developer',
      description: 'We are looking for an experienced React developer to join our team.',
      requirements: 'Bachelor degree in Computer Science, 3+ years React experience',
      benefits: 'Health insurance, 13th month salary, flexible working hours',
      location: 'Ho Chi Minh City',
      working_time: 'Full-time',
      salary: '20-30 million VND',
      experience_required: '3+ years',
      deadline: '2024-02-15',
      job_type_id: 1,
      job_level_id: 2,
      applied_count: 45,
      hiring_quota: 2,
      status: 'active',
      created_at: '2024-01-15',
      updated_at: '2024-01-20',
      company_name: 'TechCorp Vietnam',
      job_type: 'Full-time',
      job_level: 'Senior',
      view_count: 1250
    },
    {
      job_id: 2,
      company_id: 2,
      job_skill_id: 2,
      title: 'Frontend Developer',
      description: 'Join our startup to build amazing user interfaces.',
      requirements: 'Experience with Vue.js, JavaScript, HTML/CSS',
      benefits: 'Stock options, modern office, team building activities',
      location: 'Hanoi',
      working_time: 'Full-time',
      salary: '15-25 million VND',
      experience_required: '2+ years',
      deadline: '2024-02-20',
      job_type_id: 1,
      job_level_id: 1,
      applied_count: 32,
      hiring_quota: 3,
      status: 'active',
      created_at: '2024-01-10',
      updated_at: '2024-01-18',
      company_name: 'StartupHub',
      job_type: 'Full-time',
      job_level: 'Junior',
      view_count: 890
    },
    {
      job_id: 3,
      company_id: 3,
      job_skill_id: 3,
      title: 'DevOps Engineer',
      description: 'Manage and optimize our cloud infrastructure.',
      requirements: 'Experience with AWS, Docker, Kubernetes',
      benefits: 'Competitive salary, training budget, remote work',
      location: 'Da Nang',
      working_time: 'Full-time',
      salary: '25-35 million VND',
      experience_required: '4+ years',
      deadline: '2024-02-10',
      job_type_id: 1,
      job_level_id: 3,
      applied_count: 18,
      hiring_quota: 1,
      status: 'expired',
      created_at: '2024-01-05',
      updated_at: '2024-01-12',
      company_name: 'Digital Solutions Ltd',
      job_type: 'Full-time',
      job_level: 'Expert',
      view_count: 560
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterJobType, setFilterJobType] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [selectedJobs, setSelectedJobs] = useState<number[]>([]);

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

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    const matchesJobType = filterJobType === 'all' || job.job_type === filterJobType;
    const matchesLevel = filterLevel === 'all' || job.job_level === filterLevel;
    
    return matchesSearch && matchesStatus && matchesJobType && matchesLevel;
  });

  const handleSelectJob = (jobId: number) => {
    setSelectedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleSelectAll = () => {
    setSelectedJobs(
      selectedJobs.length === filteredJobs.length 
        ? [] 
        : filteredJobs.map(job => job.job_id)
    );
  };

  const handleBulkActivate = () => {
    setJobs(prev => prev.map(job => 
      selectedJobs.includes(job.job_id) ? { ...job, status: 'active' } : job
    ));
    setSelectedJobs([]);
  };

  const handleBulkDeactivate = () => {
    setJobs(prev => prev.map(job => 
      selectedJobs.includes(job.job_id) ? { ...job, status: 'inactive' } : job
    ));
    setSelectedJobs([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Junior':
        return 'bg-blue-100 text-blue-800';
      case 'Senior':
        return 'bg-purple-100 text-purple-800';
      case 'Expert':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <BriefcaseIcon className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Job Management</h1>
                <p className="text-sm text-gray-500">{jobs.length} total jobs</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <ArrowPathIcon className="w-4 h-4 mr-2" />
                Refresh
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700">
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Job
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
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <BriefcaseIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <ClockIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{jobs.filter(j => j.status === 'active').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <EyeIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">
                  {jobs.reduce((acc, j) => acc + j.view_count, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                <BriefcaseIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Applications</p>
                <p className="text-2xl font-bold text-gray-900">
                  {jobs.reduce((acc, j) => acc + j.applied_count, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* Job Type Filter */}
            <select
              value={filterJobType}
              onChange={(e) => setFilterJobType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>

            {/* Level Filter */}
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">All Levels</option>
              <option value="Junior">Junior</option>
              <option value="Senior">Senior</option>
              <option value="Expert">Expert</option>
            </select>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
                setFilterJobType('all');
                setFilterLevel('all');
              }}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedJobs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-purple-800">
                {selectedJobs.length} job(s) selected
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

        {/* Jobs Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedJobs.length === filteredJobs.length && filteredJobs.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company & Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requirements
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applications
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
                {filteredJobs.map((job, index) => (
                  <motion.tr
                    key={job.job_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedJobs.includes(job.job_id)}
                        onChange={() => handleSelectJob(job.job_id)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                            <BriefcaseIcon className="w-6 h-6 text-purple-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{job.title}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <CurrencyDollarIcon className="w-4 h-4 mr-1" />
                            {job.salary}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 flex items-center mb-1">
                        <BuildingOfficeIcon className="w-4 h-4 text-gray-400 mr-1" />
                        {job.company_name}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mb-1">
                        <MapPinIcon className="w-4 h-4 text-gray-400 mr-1" />
                        {job.location}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <CalendarIcon className="w-4 h-4 text-gray-400 mr-1" />
                        Deadline: {new Date(job.deadline).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(job.job_level)}`}>
                          {job.job_level} Level
                        </span>
                        <span className="text-xs text-gray-500">{job.experience_required}</span>
                        <span className="text-xs text-gray-500">{job.job_type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{job.applied_count}/{job.hiring_quota} applicants</div>
                      <div className="text-sm text-gray-500">{job.view_count} views</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${Math.min((job.applied_count / job.hiring_quota) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(job.status)}`}>
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
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
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredJobs.length}</span> of{' '}
              <span className="font-medium">{filteredJobs.length}</span> results
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1 bg-purple-600 text-white rounded text-sm">
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

export default Jobs; 
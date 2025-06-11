import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  DocumentTextIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  ArrowPathIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  UserIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface Application {
  id: number;
  user_id: number;
  job_id: number;
  employer_id: number;
  resume_id: number;
  status: string;
  cover_letter: string;
  created_at: string;
  updated_at: string;
  // Joined data
  applicant_name: string;
  applicant_email: string;
  job_title: string;
  company_name: string;
  job_location: string;
  salary: string;
  resume_filename: string;
}

const Applications: React.FC = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([
    {
      id: 1,
      user_id: 1,
      job_id: 1,
      employer_id: 101,
      resume_id: 1,
      status: 'pending',
      cover_letter: 'I am very interested in this position and believe my skills match perfectly.',
      created_at: '2024-01-20',
      updated_at: '2024-01-20',
      applicant_name: 'John Doe',
      applicant_email: 'john.doe@email.com',
      job_title: 'Senior React Developer',
      company_name: 'TechCorp Vietnam',
      job_location: 'Ho Chi Minh City',
      salary: '20-30 million VND',
      resume_filename: 'john_doe_resume.pdf'
    },
    {
      id: 2,
      user_id: 2,
      job_id: 2,
      employer_id: 102,
      resume_id: 2,
      status: 'reviewing',
      cover_letter: 'Looking forward to contributing to your innovative team.',
      created_at: '2024-01-18',
      updated_at: '2024-01-19',
      applicant_name: 'Jane Smith',
      applicant_email: 'jane.smith@email.com',
      job_title: 'Frontend Developer',
      company_name: 'StartupHub',
      job_location: 'Hanoi',
      salary: '15-25 million VND',
      resume_filename: 'jane_smith_resume.pdf'
    },
    {
      id: 3,
      user_id: 3,
      job_id: 1,
      employer_id: 101,
      resume_id: 3,
      status: 'accepted',
      cover_letter: 'Excited about the opportunity to work with cutting-edge technology.',
      created_at: '2024-01-15',
      updated_at: '2024-01-22',
      applicant_name: 'Mike Johnson',
      applicant_email: 'mike.johnson@email.com',
      job_title: 'Senior React Developer',
      company_name: 'TechCorp Vietnam',
      job_location: 'Ho Chi Minh City',
      salary: '20-30 million VND',
      resume_filename: 'mike_johnson_resume.pdf'
    },
    {
      id: 4,
      user_id: 4,
      job_id: 3,
      employer_id: 103,
      resume_id: 4,
      status: 'rejected',
      cover_letter: 'I have extensive experience in DevOps and cloud infrastructure.',
      created_at: '2024-01-10',
      updated_at: '2024-01-16',
      applicant_name: 'Sarah Wilson',
      applicant_email: 'sarah.wilson@email.com',
      job_title: 'DevOps Engineer',
      company_name: 'Digital Solutions Ltd',
      job_location: 'Da Nang',
      salary: '25-35 million VND',
      resume_filename: 'sarah_wilson_resume.pdf'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCompany, setFilterCompany] = useState('all');
  const [selectedApplications, setSelectedApplications] = useState<number[]>([]);

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

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.applicant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicant_email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    const matchesCompany = filterCompany === 'all' || app.company_name === filterCompany;
    
    return matchesSearch && matchesStatus && matchesCompany;
  });

  const handleSelectApplication = (appId: number) => {
    setSelectedApplications(prev => 
      prev.includes(appId) 
        ? prev.filter(id => id !== appId)
        : [...prev, appId]
    );
  };

  const handleSelectAll = () => {
    setSelectedApplications(
      selectedApplications.length === filteredApplications.length 
        ? [] 
        : filteredApplications.map(app => app.id)
    );
  };

  const handleBulkStatusUpdate = (newStatus: string) => {
    setApplications(prev => prev.map(app => 
      selectedApplications.includes(app.id) ? { ...app, status: newStatus, updated_at: new Date().toISOString().split('T')[0] } : app
    ));
    setSelectedApplications([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="w-4 h-4" />;
      case 'reviewing':
        return <EyeIcon className="w-4 h-4" />;
      case 'accepted':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'rejected':
        return <XCircleIcon className="w-4 h-4" />;
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  const uniqueCompanies = Array.from(new Set(applications.map(app => app.company_name)));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <DocumentTextIcon className="w-8 h-8 text-orange-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Application Management</h1>
                <p className="text-sm text-gray-500">{applications.length} total applications</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <ArrowPathIcon className="w-4 h-4 mr-2" />
                Refresh
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
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                <DocumentTextIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <ClockIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{applications.filter(a => a.status === 'pending').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Accepted</p>
                <p className="text-2xl font-bold text-gray-900">{applications.filter(a => a.status === 'accepted').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                <XCircleIcon className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{applications.filter(a => a.status === 'rejected').length}</p>
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
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewing">Reviewing</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>

            {/* Company Filter */}
            <select
              value={filterCompany}
              onChange={(e) => setFilterCompany(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All Companies</option>
              {uniqueCompanies.map(company => (
                <option key={company} value={company}>{company}</option>
              ))}
            </select>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
                setFilterCompany('all');
              }}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedApplications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-orange-800">
                {selectedApplications.length} application(s) selected
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBulkStatusUpdate('reviewing')}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Mark as Reviewing
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('accepted')}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('rejected')}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Applications Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedApplications.length === filteredApplications.length && filteredApplications.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job & Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Application Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.map((application, index) => (
                  <motion.tr
                    key={application.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedApplications.includes(application.id)}
                        onChange={() => handleSelectApplication(application.id)}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center">
                            <UserIcon className="w-6 h-6 text-orange-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{application.applicant_name}</div>
                          <div className="text-sm text-gray-500">{application.applicant_email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 flex items-center mb-1">
                        <BriefcaseIcon className="w-4 h-4 text-gray-400 mr-1" />
                        {application.job_title}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mb-1">
                        <BuildingOfficeIcon className="w-4 h-4 text-gray-400 mr-1" />
                        {application.company_name}
                      </div>
                      <div className="text-sm text-gray-500">{application.job_location}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 mb-1">💰 {application.salary}</div>
                      <div className="text-sm text-gray-500 mb-1">📄 {application.resume_filename}</div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        💬 {application.cover_letter}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(application.status)}`}>
                        {getStatusIcon(application.status)}
                        <span className="ml-1">{application.status.charAt(0).toUpperCase() + application.status.slice(1)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <CalendarIcon className="w-4 h-4 text-gray-400 mr-1" />
                        {new Date(application.created_at).toLocaleDateString()}
                      </div>
                      {application.updated_at !== application.created_at && (
                        <div className="text-sm text-gray-500">
                          Updated: {new Date(application.updated_at).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900" title="View Details">
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900" title="Download Resume">
                          <DocumentTextIcon className="w-4 h-4" />
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
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredApplications.length}</span> of{' '}
              <span className="font-medium">{filteredApplications.length}</span> results
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1 bg-orange-600 text-white rounded text-sm">
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

export default Applications; 
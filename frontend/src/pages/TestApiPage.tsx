import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';
import { 
  userApi, 
  employerApi, 
  companyApi, 
  jobPostApi,
  type UserResponse, 
  type CompanyResponse 
} from '../services/api';

const TestApiPage: React.FC = () => {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState<UserResponse | null>(null);
  const [companyInfo, setCompanyInfo] = useState<CompanyResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Test User API
  const testUserApi = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Testing User API...');
      
      // Get user info
      const userResponse = await userApi.getMyInfo();
      console.log('User Info:', userResponse.result);
      setUserInfo(userResponse.result);

      // Test update user info
      const updateData = {
        fullName: userResponse.result.fullname + ' (Updated)',
        phone: '0123456789',
        address: 'Updated Address'
      };
      
      const updatedUserResponse = await userApi.updateMyInfo(updateData);
      console.log('Updated User Info:', updatedUserResponse.result);
      setUserInfo(updatedUserResponse.result);

    } catch (error: any) {
      console.error('User API Error:', error);
      setError(`User API Error: ${error.message}`);
    }
    setLoading(false);
  };

  // Test Employer API 
  const testEmployerApi = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Testing Employer API...');
      
      // Get employer info (same as user)
      const employerResponse = await employerApi.getMyInfo();
      console.log('Employer Info:', employerResponse.result);
      setUserInfo(employerResponse.result);

      // Try to get company info
      const companyData = await employerApi.getMyCompany();
      console.log('Company Info:', companyData);
      setCompanyInfo(companyData);

      if (!companyData) {
        console.log('No company found - employer may need to create company or post jobs first');
      }

    } catch (error: any) {
      console.error('Employer API Error:', error);
      setError(`Employer API Error: ${error.message}`);
    }
    setLoading(false);
  };

  // Test Company API
  const testCompanyApi = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Testing Company API...');
      
      // Get all companies
      const companiesResponse = await companyApi.getAllCompanies(1, 5);
      console.log('All Companies:', companiesResponse.result);

      // Search companies
      const searchResponse = await companyApi.searchCompanies({
        keyword: 'tech',
        page: 1,
        size: 5
      });
      console.log('Search Results:', searchResponse.result);

      // If we have companies, get detail of first one
      if (companiesResponse.result.data.length > 0) {
        const firstCompany = companiesResponse.result.data[0];
        const companyDetail = await companyApi.getCompanyById(firstCompany.id);
        console.log('Company Detail:', companyDetail.result);
      }

    } catch (error: any) {
      console.error('Company API Error:', error);
      setError(`Company API Error: ${error.message}`);
    }
    setLoading(false);
  };

  // Test Job Post API
  const testJobPostApi = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Testing Job Post API...');
      
      // Get trending job posts
      const trendingResponse = await jobPostApi.getTrendingJobPosts(1, 5);
      console.log('Trending Jobs:', trendingResponse.result);

      // Search job posts
      const searchResponse = await jobPostApi.searchJobPosts({
        keyword: 'developer',
        page: 1,
        size: 5
      });
      console.log('Job Search Results:', searchResponse.result);

      // If user is employer, get their job posts
      if (user?.role === 'EMPLOYER') {
        const myJobsResponse = await jobPostApi.getMyJobPosts(1, 5);
        console.log('My Job Posts:', myJobsResponse.result);
      }

    } catch (error: any) {
      console.error('Job Post API Error:', error);
      setError(`Job Post API Error: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">API Testing Page</h1>
          
          {user && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Current User</h2>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Name:</strong> {user.fullname}</p>
              <p><strong>Role:</strong> {user.role}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <button
              onClick={testUserApi}
              disabled={loading}
              className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              Test User API
            </button>
            
            <button
              onClick={testEmployerApi}
              disabled={loading}
              className="bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50"
            >
              Test Employer API
            </button>
            
            <button
              onClick={testCompanyApi}
              disabled={loading}
              className="bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50"
            >
              Test Company API
            </button>
            
            <button
              onClick={testJobPostApi}
              disabled={loading}
              className="bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50"
            >
              Test Job Post API
            </button>
          </div>

          {loading && (
            <div className="bg-blue-50 border border-blue-200 text-blue-600 px-4 py-3 rounded-lg mb-6">
              Loading...
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {userInfo && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">User Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><strong>ID:</strong> {userInfo.id}</p>
                  <p><strong>Username:</strong> {userInfo.userName || 'N/A'}</p>
                  <p><strong>Email:</strong> {userInfo.email}</p>
                  <p><strong>Full Name:</strong> {userInfo.fullname}</p>
                </div>
                <div>
                  <p><strong>Phone:</strong> {userInfo.phone || 'N/A'}</p>
                  <p><strong>Address:</strong> {userInfo.address || 'N/A'}</p>
                  <p><strong>Role:</strong> {userInfo.role}</p>
                  <p><strong>Active:</strong> {userInfo.isActive ? 'Yes' : 'No'}</p>
                  <p><strong>Email Verified:</strong> {userInfo.isEmailVerified ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          )}

          {companyInfo && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Company Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><strong>ID:</strong> {companyInfo.id}</p>
                  <p><strong>Name:</strong> {companyInfo.name}</p>
                  <p><strong>Website:</strong> {companyInfo.website || 'N/A'}</p>
                  <p><strong>Employee Range:</strong> {companyInfo.employeeRange || 'N/A'}</p>
                </div>
                <div>
                  <p><strong>Address:</strong> {companyInfo.address || 'N/A'}</p>
                  <p><strong>Follower Count:</strong> {companyInfo.followerCount}</p>
                  <p><strong>Job Count:</strong> {companyInfo.jobCount}</p>
                </div>
              </div>
              <div className="mt-4">
                <p><strong>Description:</strong></p>
                <p className="text-gray-600 mt-1">{companyInfo.description || 'N/A'}</p>
              </div>
            </div>
          )}

          <div className="bg-gray-100 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Instructions</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>User API:</strong> Test getting and updating user profile information</li>
              <li><strong>Employer API:</strong> Test getting employer info and company details (if available)</li>
              <li><strong>Company API:</strong> Test searching and getting company information</li>
              <li><strong>Job Post API:</strong> Test job post search and management features</li>
            </ul>
            <p className="mt-4 text-sm text-gray-600">
              Check the browser console for detailed API responses and debugging information.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TestApiPage; 
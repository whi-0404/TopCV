import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { companyApi } from '../services/api/companyApi';
import { jobPostApi } from '../services/api/jobPostApi';
import { CompanyResponse, JobPostDashboardResponse, PageResponse } from '../types';
import { MapPinIcon, GlobeAltIcon, UserGroupIcon, HeartIcon, BriefcaseIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import Layout from '../components/layout/Layout';
import Breadcrumb from '../components/common/Breadcrumb';

const CompanyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [company, setCompany] = useState<CompanyResponse | null>(null);
  const [jobs, setJobs] = useState<JobPostDashboardResponse[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jobsLoading, setJobsLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate('/companies');
      return;
    }

    const fetchCompanyDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch company details
        const companyResponse = await companyApi.getCompanyById(Number(id));
        
        if (companyResponse.code === 1000 && companyResponse.result) {
          setCompany(companyResponse.result);
          
          // Fetch follow status
          try {
            const followResponse = await companyApi.getFollowStatus(Number(id));
            if (followResponse.code === 1000) {
              setIsFollowing(followResponse.result);
            }
          } catch (followError) {
            console.log('User not authenticated or error fetching follow status');
          }

          // Fetch company jobs
          setJobsLoading(true);
          const jobsResponse = await jobPostApi.getJobPostsByCompany(Number(id), 1, 20);
          if (jobsResponse.code === 1000 && jobsResponse.result) {
            setJobs(jobsResponse.result.data);
          }
          setJobsLoading(false);
        } else {
          setError('Không thể tải thông tin công ty');
        }
      } catch (err) {
        console.error('Error fetching company details:', err);
        setError('Đã có lỗi xảy ra khi tải thông tin công ty');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [id, navigate]);

  const handleFollowToggle = async () => {
    if (!company) return;

    try {
      if (isFollowing) {
        await companyApi.unfollowCompany(company.id);
        setIsFollowing(false);
        setCompany(prev => prev ? { ...prev, followerCount: prev.followerCount - 1 } : null);
      } else {
        await companyApi.followCompany(company.id);
        setIsFollowing(true);
        setCompany(prev => prev ? { ...prev, followerCount: prev.followerCount + 1 } : null);
      }
    } catch (err) {
      console.error('Error toggling follow:', err);
    }
  };

  const formatSalary = (salary?: string | null): string => {
    if (!salary || salary.trim() === '') return 'Thỏa thuận';
    return salary;
  };

  const formatDeadline = (deadline?: string | null): string => {
    if (!deadline) return 'Không xác định';
    try {
      const date = new Date(deadline);
      return date.toLocaleDateString('vi-VN');
    } catch {
      return 'Không xác định';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (error || !company) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-96 py-16">
          <div className="text-red-600 text-xl mb-4">{error || 'Không tìm thấy công ty'}</div>
          <button
            onClick={() => navigate('/companies')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Quay lại danh sách công ty
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50">
        {/* Breadcrumb */}
        <Breadcrumb 
          items={[
            { label: 'Công ty', href: '/companies' },
            { label: company.name }
          ]} 
        />

        {/* Company Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Company Logo */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                {company.logo ? (
                  <>
                    <img
                      src={`http://localhost:8080/TopCV/uploads/${company.logo}`}
                      alt={company.name}
                      className="w-full h-full object-cover"
                      onLoad={() => console.log('Company logo loaded successfully:', company.logo)}
                      onError={(e) => {
                        console.error('Company logo failed to load:', company.logo);
                        console.error('Full URL:', `http://localhost:8080/TopCV/uploads/${company.logo}`);
                        e.currentTarget.style.display = 'none';
                        const fallback = document.getElementById('company-logo-fallback');
                        if (fallback) {
                          fallback.style.display = 'flex';
                        }
                      }}
                    />
                    <div 
                      id="company-logo-fallback"
                      className="absolute inset-0 w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center" 
                      style={{ display: 'none' }}
                    >
                      <BriefcaseIcon className="w-16 h-16 text-gray-400" />
                    </div>
                  </>
                ) : (
                  <BriefcaseIcon className="w-16 h-16 text-gray-400" />
                )}
              </div>
            </div>

            {/* Company Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{company.name}</h1>
                  
                  <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
                    {company.address && (
                      <div className="flex items-center gap-1">
                        <MapPinIcon className="w-5 h-5" />
                        <span>{company.address}</span>
                    </div>
                    )}
                    
                    {company.website && (
                      <div className="flex items-center gap-1">
                        <GlobeAltIcon className="w-5 h-5" />
                        <a 
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Website
                      </a>
                    </div>
                    )}
                    
                    {company.employeeRange && (
                      <div className="flex items-center gap-1">
                        <UserGroupIcon className="w-5 h-5" />
                        <span>{company.employeeRange} nhân viên</span>
                      </div>
                    )}
                  </div>

                  {/* Categories */}
                  {company.categories && company.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {company.categories.map((category) => (
                        <span
                          key={category.id}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Follow Button */}
                <button
                  onClick={handleFollowToggle}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    isFollowing
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isFollowing ? (
                    <HeartIconSolid className="w-5 h-5" />
                  ) : (
                    <HeartIcon className="w-5 h-5" />
                  )}
                  {isFollowing ? 'Bỏ theo dõi' : 'Theo dõi'}
                  <span className="text-sm">({company.followerCount})</span>
                </button>
              </div>
              </div>
            </div>
          </div>
        </div>

              {/* Company Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Company Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">Giới thiệu công ty</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {company.description || 'Chưa có thông tin giới thiệu về công ty.'}
                </p>
                  </div>
                </div>

            {/* Company Jobs */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">
                  Việc làm đang tuyển ({company.jobCount})
                </h2>
              </div>

              {jobsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : jobs.length > 0 ? (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-300 cursor-pointer group"
                      onClick={() => navigate(`/jobs/${job.id}`)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {job.title}
                        </h3>
                        <span className="text-lg font-medium text-green-600">
                          {formatSalary(job.salary)}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-4 text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <MapPinIcon className="w-4 h-4" />
                          <span>{job.location}</span>
                    </div>
                        <div className="flex items-center gap-1">
                          <span>Hạn: {formatDeadline(job.deadline)}</span>
                </div>
                        <div className="flex items-center gap-1">
                          <span>{job.appliedCount} ứng viên</span>
              </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                          {job.type.name}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                          {job.level.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Công ty chưa có vị trí tuyển dụng nào.
                </div>
              )}
                        </div>
                      </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold mb-4">Thông tin công ty</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 hover:bg-gray-50 rounded px-2 -mx-2 transition-colors">
                  <span className="text-gray-600">Quy mô:</span>
                  <span className="font-medium">{company.employeeRange || 'Chưa cập nhật'}</span>
                    </div>
                <div className="flex justify-between items-center py-2 hover:bg-gray-50 rounded px-2 -mx-2 transition-colors">
                  <span className="text-gray-600">Việc làm:</span>
                  <span className="font-medium text-blue-600">{company.jobCount} vị trí</span>
                </div>
                <div className="flex justify-between items-center py-2 hover:bg-gray-50 rounded px-2 -mx-2 transition-colors">
                  <span className="text-gray-600">Người theo dõi:</span>
                  <span className="font-medium text-green-600">{company.followerCount}</span>
                </div>
              </div>
            </div>

            {/* Company Reviews (if available) */}
            {company.reviewStats && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Đánh giá công ty</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Đánh giá trung bình:</span>
                    <span className="font-medium">{company.reviewStats.averageRating}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tổng đánh giá:</span>
                    <span className="font-medium">{company.reviewStats.totalReviews}</span>
                  </div>
                  {company.reviewStats.recommendationRate && (
                  <div className="flex justify-between">
                      <span className="text-gray-600">Tỷ lệ giới thiệu:</span>
                      <span className="font-medium">{company.reviewStats.recommendationRate}%</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CompanyDetailPage; 
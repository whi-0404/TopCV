import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import companyService, { CompanyProfile } from '../services/companyService';
import jobService, { JobPost } from '../services/jobService';
import { apiUtils } from '../services';

const CompanyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'intro' | 'jobs'>('intro');
  const [jobsPage, setJobsPage] = useState(1);
  const [totalJobPages, setTotalJobPages] = useState(1);

  const getCompanyRating = (reviewStats?: { averageRating: number; totalReviews: number }): number => {
    return reviewStats?.averageRating || 0;
  };

  const formatWebsiteUrl = (website?: string): string => {
    if (!website) return '#';
    if (website.startsWith('http')) return website;
    return `https://${website}`;
  };

  useEffect(() => {
    const loadCompanyDetail = async () => {
      if (!id) {
        setError('ID công ty không hợp lệ');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Gọi API thực tế để lấy thông tin công ty
        const companyData = await companyService.getCompanyById(parseInt(id));
        setCompany(companyData);
        setError('');
      } catch (err: any) {
        console.error('Failed to load company details:', err);
        setError('Không thể tải thông tin công ty. Vui lòng thử lại.');
      } finally {
        setIsLoading(false);
      }
    };

    loadCompanyDetail();
  }, [id]);

  // Load jobs when jobs tab is active
  useEffect(() => {
    const loadCompanyJobs = async () => {
      if (!id || !company || activeTab !== 'jobs') return;

      try {
        setIsLoadingJobs(true);
        // Gọi API thực tế để lấy danh sách việc làm của công ty
        const jobsResponse = await jobService.getJobsByCompany(parseInt(id), jobsPage, 10);
        setJobs(jobsResponse.Data || []);
        setTotalJobPages(jobsResponse.totalPages || 1);
      } catch (err: any) {
        console.error('Failed to load company jobs:', err);
        setJobs([]);
        setTotalJobPages(1);
      } finally {
        setIsLoadingJobs(false);
      }
    };

    loadCompanyJobs();
  }, [id, company, activeTab, jobsPage]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mr-3"></div>
            <span className="text-gray-600">Đang tải thông tin công ty...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Có lỗi xảy ra</h3>
            <p className="text-gray-600 mb-4">{error || 'Không tìm thấy công ty'}</p>
            <Link 
              to="/companies"
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Quay lại danh sách công ty
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image - Dark gradient background */}
      <div className="h-64 w-full bg-gradient-to-r from-purple-900 to-red-900">
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="flex items-center gap-6">
            <div className="bg-white p-2 rounded-lg">
              <img
                src={apiUtils.formatFileUrl(company.logo, 'company-logo')}
                alt={company.name}
                className="w-24 h-24 object-contain"
              />
            </div>
            <div className="text-white">
              <h1 className="text-3xl font-bold mb-2">{company.name}</h1>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{company.address || 'Chưa cập nhật'}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>{company.employeeRange || 'Chưa cập nhật'} nhân viên</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <a href={formatWebsiteUrl(company.website)} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {company.website || 'Chưa cập nhật'}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Job Openings */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-md p-3 mr-4">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">{company.jobCount || 0}</div>
                  <div className="text-sm text-gray-500">Việc làm đang tuyển</div>
                </div>
              </div>
            </div>
          </div>

          {/* Followers */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex items-center">
                <div className="bg-green-100 rounded-md p-3 mr-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">{company.followerCount || 0}</div>
                  <div className="text-sm text-gray-500">Người theo dõi</div>
                </div>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex items-center">
                <div className="bg-yellow-100 rounded-md p-3 mr-4">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {getCompanyRating(company.reviewStats).toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {company.reviewStats?.totalReviews || 0} đánh giá
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company Tabs */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'intro'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('intro')}
              >
                Giới thiệu
              </button>
              <button
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'jobs'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('jobs')}
              >
                Việc làm ({company.jobCount || 0})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'intro' ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-2">Giới thiệu công ty</h2>
                  <p className="text-gray-700 whitespace-pre-line">
                    {company.description || 'Chưa có thông tin giới thiệu.'}
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-2">Thông tin liên hệ</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-gray-500 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <div className="font-medium text-gray-900">Website</div>
                        <a
                          href={formatWebsiteUrl(company.website)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {company.website || 'Chưa cập nhật'}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-gray-500 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <div className="font-medium text-gray-900">Địa chỉ</div>
                        <div className="text-gray-700">{company.address || 'Chưa cập nhật'}</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-gray-500 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <div>
                        <div className="font-medium text-gray-900">Quy mô</div>
                        <div className="text-gray-700">{company.employeeRange || 'Chưa cập nhật'} nhân viên</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-gray-500 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <div>
                        <div className="font-medium text-gray-900">Lĩnh vực</div>
                        <div className="text-gray-700">
                          {company.categories && company.categories.length > 0
                            ? company.categories.map(cat => cat.name).join(', ')
                            : 'Chưa cập nhật'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Việc làm đang tuyển</h2>
                
                {isLoadingJobs ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : jobs.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Không có việc làm</h3>
                    <p className="mt-1 text-sm text-gray-500">Hiện tại công ty chưa có tin tuyển dụng nào.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {jobs.map((job) => (
                      <Link 
                        key={job.id}
                        to={`/jobs/${job.id}`}
                        className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">{job.title}</h3>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {job.location && (
                                <span className="inline-flex items-center text-sm text-gray-600">
                                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  {job.location}
                                </span>
                              )}
                              {job.salary && (
                                <span className="inline-flex items-center text-sm text-gray-600">
                                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {job.salary}
                                </span>
                              )}
                              {job.jobType && (
                                <span className="inline-flex items-center text-sm text-gray-600">
                                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {job.jobType.name}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {job.skills?.slice(0, 3).map((skill) => (
                                <span
                                  key={skill.id}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                  {skill.name}
                                </span>
                              ))}
                              {(job.skills?.length || 0) > 3 && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  +{(job.skills?.length || 0) - 3} kỹ năng khác
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {jobService.formatDate(job.createdAt)}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                
                {/* Pagination */}
                {totalJobPages > 1 && (
                  <div className="flex justify-center mt-6">
                    <nav className="inline-flex rounded-md shadow">
                      <button
                        onClick={() => setJobsPage(prev => Math.max(prev - 1, 1))}
                        disabled={jobsPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        {jobsPage} / {totalJobPages}
                      </span>
                      <button
                        onClick={() => setJobsPage(prev => Math.min(prev + 1, totalJobPages))}
                        disabled={jobsPage === totalJobPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail; 
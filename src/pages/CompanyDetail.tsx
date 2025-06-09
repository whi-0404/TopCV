import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import companyService, { CompanyProfile } from '../services/companyService';
import jobService, { JobPost } from '../services/jobService';

const CompanyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'intro' | 'jobs'>('intro');
  const [jobsPage, setJobsPage] = useState(1);
  const [totalJobPages, setTotalJobPages] = useState(1);

  useEffect(() => {
    const loadCompanyDetail = async () => {
      if (!id) {
        setError('ID công ty không hợp lệ');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Load company profile
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
        const jobsResponse = await jobService.getJobsByCompany(parseInt(id), jobsPage, 10);
        setJobs(jobsResponse.Data);
        setTotalJobPages(jobsResponse.totalPages);
      } catch (err: any) {
        console.error('Failed to load company jobs:', err);
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
                src={companyService.getLogoUrl(company.logo)}
                alt={company.name}
                className="w-24 h-24 object-contain"
              />
            </div>
            <div className="text-white">
              <h1 className="text-3xl font-bold mb-2">{company.name}</h1>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {company.address || 'Chưa cập nhật địa chỉ'}
                </span>
                <span className="mx-2">•</span>
                <span className="text-blue-300 hover:text-blue-200">
                  <Link to={`/jobs?company=${id}`}>
                    {company.jobCount || 0} việc làm đang tuyển dụng
                  </Link>
                </span>
              </div>
            </div>
          </div>
          <div className="ml-auto flex flex-col items-end">
            <div className="bg-white text-gray-800 rounded-lg p-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="text-4xl font-bold">
                  {companyService.getCompanyRating(company.reviewStats).toFixed(1)}
                </div>
                <div>
                  <div className="flex mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg 
                        key={star} 
                        className={`w-5 h-5 ${star <= Math.floor(companyService.getCompanyRating(company.reviewStats)) ? 'text-yellow-400' : 'text-gray-300'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <div className="text-sm">
                    {company.reviewStats?.totalReviews || 0} đánh giá
                  </div>
                </div>
              </div>
            </div>
            {company.followerCount !== undefined && (
              <div className="text-white">
                <span className="text-xl font-bold">{company.followerCount}</span> người theo dõi
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex border-b border-gray-200 w-full">
            <button 
              onClick={() => setActiveTab('intro')} 
              className={`py-4 px-6 text-center font-medium text-base outline-none ${activeTab === 'intro' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Giới thiệu
            </button>
            <button 
              onClick={() => setActiveTab('jobs')} 
              className={`py-4 px-6 text-center font-medium text-base outline-none ${activeTab === 'jobs' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Việc làm <span className="ml-1 bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">{company.jobCount || 0}</span>
            </button>
          </div>
          <div className="flex gap-2">
            {company.website && (
              <a
                href={companyService.formatWebsiteUrl(company.website)}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm"
              >
                Trang web
              </a>
            )}
            <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm">
              Theo dõi
            </button>
          </div>
        </div>

        {activeTab === 'intro' && (
          <div className="grid grid-cols-3 gap-8 py-6">
            {/* Main Content */}
            <div className="col-span-2 space-y-8">
              {/* Company Description */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4">Về công ty</h2>
                <div className="text-gray-600 whitespace-pre-line">
                  {company.description || 'Chưa có mô tả về công ty.'}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Company Info */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4">Thông tin công ty</h2>
                <div className="space-y-4">
                  {company.website && (
                    <div>
                      <h3 className="text-sm text-gray-500 mb-1">Website</h3>
                      <a
                        href={companyService.formatWebsiteUrl(company.website)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        {company.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                  {company.categories && company.categories.length > 0 && (
                    <div>
                      <h3 className="text-sm text-gray-500 mb-1">Ngành nghề</h3>
                      <p className="font-medium">{companyService.getCategoriesString(company.categories)}</p>
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm text-gray-500 mb-1">Quy mô công ty</h3>
                    <p className="font-medium">{companyService.formatEmployeeRange(company.employeeRange)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500 mb-1">Địa chỉ</h3>
                    <p className="font-medium">{company.address || 'Chưa cập nhật'}</p>
                  </div>
                </div>
              </div>

              {/* Company Stats */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4">Thống kê</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Việc làm đang tuyển</span>
                    <span className="font-medium">{company.jobCount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Người theo dõi</span>
                    <span className="font-medium">{company.followerCount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Đánh giá trung bình</span>
                    <span className="font-medium">
                      {companyService.getCompanyRating(company.reviewStats).toFixed(1)}/5.0
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="py-6">
            {jobs.length > 0 ? (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <Link
                    key={job.id}
                    to={`/jobs/${job.id}`}
                    className="block bg-white rounded-lg border border-gray-200 p-6 hover:border-emerald-500 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-emerald-600">
                        {job.title}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {jobService.formatDate(job.createdAt)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {job.location || 'Không xác định'}
                      </div>
                      {job.jobType && (
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {job.jobType.name}
                        </div>
                      )}
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        {jobService.formatSalary(job.salary)}
                      </div>
                      {job.jobLevel && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          job.jobLevel.name.toLowerCase().includes('senior') ? 'bg-purple-100 text-purple-800' :
                          job.jobLevel.name.toLowerCase().includes('mid') ? 'bg-blue-100 text-blue-800' :
                          job.jobLevel.name.toLowerCase().includes('junior') || job.jobLevel.name.toLowerCase().includes('fresher') ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {job.jobLevel.name}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {job.skills?.slice(0, 5).map((skill) => (
                        <span 
                          key={skill.id} 
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          {skill.name}
                        </span>
                      ))}
                      {job.skills && job.skills.length > 5 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{job.skills.length - 5}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}

                {/* Pagination for jobs */}
                {totalJobPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-6">
                    <button 
                      onClick={() => setJobsPage(jobsPage - 1)}
                      disabled={jobsPage === 1}
                      className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    {[...Array(Math.min(5, totalJobPages))].map((_, i) => {
                      const page = Math.max(1, jobsPage - 2) + i;
                      if (page > totalJobPages) return null;
                      
                      return (
                        <button
                          key={page}
                          onClick={() => setJobsPage(page)}
                          className={`w-8 h-8 rounded ${
                            page === jobsPage ? 'bg-red-600 text-white' : 'hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    
                    <button 
                      onClick={() => setJobsPage(jobsPage + 1)}
                      disabled={jobsPage === totalJobPages}
                      className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8zM5 20v-5a2 2 0 012-2h6a2 2 0 012 2v5" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có việc làm nào</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Công ty này hiện chưa đăng tuyển việc làm nào.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDetail; 
package com.TopCV.service;

import com.TopCV.dto.request.JobPost.JobPostCreationRequest;
import com.TopCV.dto.request.JobPost.JobPostUpdateRequest;
import com.TopCV.dto.response.JobPost.JobPostDashboardResponse;
import com.TopCV.dto.response.JobPost.JobPostResponse;
import com.TopCV.dto.response.PageResponse;

public interface JobPostService {
    JobPostResponse createJobPost(JobPostCreationRequest request);
    JobPostResponse updateJobPost(Integer jobId, JobPostUpdateRequest request);
    void deleteJobPost(Integer jobId);
    PageResponse<JobPostResponse> getMyJobPosts(int page, int size);
//    JobPostDetailResponse getJobPostDetail(Integer jobId);
    void closeJobPost(Integer jobId);
    void reopenJobPost(Integer jobId);
    void suspendJobPost(Integer jobId);
    void rejectJobPost(Integer jobId);
    PageResponse<JobPostDashboardResponse> getJobPostsByCompany(Integer companyId, int page, int size);
}

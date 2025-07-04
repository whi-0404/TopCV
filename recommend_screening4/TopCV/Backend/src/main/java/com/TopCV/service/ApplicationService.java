package com.TopCV.service;

import com.TopCV.dto.request.Application.ApplicationRequest;
import com.TopCV.dto.request.Application.ApplicationStatusUpdateRequest;
import com.TopCV.dto.response.ApplicationResponse;
import com.TopCV.dto.response.PageResponse;

public interface ApplicationService {
    ApplicationResponse applyForJob(ApplicationRequest request);

    ApplicationResponse applyForJobWithResume(Integer jobId, Integer resumeId);

    void withdrawApplication(Integer applicationId);

    PageResponse<ApplicationResponse> getMyApplications(int page, int size);

    PageResponse<ApplicationResponse> getJobApplications(Integer jobId, int page, int size);

    PageResponse<ApplicationResponse> getAllApplicationsForEmployer(int page, int size);

    ApplicationResponse getApplicationById(Integer applicationId);

    void updateApplicationStatus(Integer applicationId, ApplicationStatusUpdateRequest request);

    void bulkUpdateApplicationStatus(ApplicationStatusUpdateRequest request);

    PageResponse<ApplicationResponse> searchApplications(String keyword, int page, int size);
}

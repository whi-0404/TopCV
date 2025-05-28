package com.TopCV.service;

import com.TopCV.dto.request.JobCategoryRequest;
import com.TopCV.dto.response.JobCategoryResponse;
import java.util.List;

public interface JobCategoryService {
    JobCategoryResponse createJobCategory(JobCategoryRequest request);
    List<JobCategoryResponse> getAllJobCategories();
    JobCategoryResponse getJobCategoryById(Integer id);
    JobCategoryResponse updateJobCategory(Integer categoryId, JobCategoryRequest request);
    void deleteJobCategory(Integer categoryId);
}
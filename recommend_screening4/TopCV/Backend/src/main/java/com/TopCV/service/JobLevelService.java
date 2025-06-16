package com.TopCV.service;

import com.TopCV.dto.request.JobLevelRequest;
import com.TopCV.dto.response.JobLevelResponse;
import java.util.List;

public interface JobLevelService {
    JobLevelResponse createJobLevel(JobLevelRequest request);
    List<JobLevelResponse> getAllJobLevels();
    JobLevelResponse getJobLevelById(Integer id);
    JobLevelResponse updateJobLevel(Integer levelId, JobLevelRequest request);
    void deleteJobLevel(Integer levelId);
}
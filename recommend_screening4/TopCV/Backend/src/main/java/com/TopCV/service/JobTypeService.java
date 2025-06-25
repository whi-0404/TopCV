package com.TopCV.service;

import com.TopCV.dto.request.JobTypeRequest;
import com.TopCV.dto.response.JobTypeResponse;
import java.util.List;

public interface JobTypeService {
    JobTypeResponse createJobType(JobTypeRequest request);
    List<JobTypeResponse> getAllJobTypes();
    JobTypeResponse getJobTypeById(Integer id);
    JobTypeResponse updateJobType(Integer typeId, JobTypeRequest request);
    void deleteJobType(Integer typeId);
}
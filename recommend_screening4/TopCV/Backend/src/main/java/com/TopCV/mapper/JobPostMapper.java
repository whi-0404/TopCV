package com.TopCV.mapper;

import com.TopCV.dto.request.JobPost.JobPostCreationRequest;
import com.TopCV.dto.request.JobPost.JobPostUpdateRequest;
import com.TopCV.dto.request.JobTypeRequest;
import com.TopCV.dto.response.JobPost.JobPostDashboardResponse;
import com.TopCV.dto.response.JobPost.JobPostResponse;
import com.TopCV.entity.JobPost;
import com.TopCV.entity.JobType;
import org.mapstruct.Mapper;

public interface JobPostMapper {
    JobPost toEntity(JobPostCreationRequest request);
    JobPostResponse toResponse(JobPost jobPost);
    void updateEntity(JobPost jobPost, JobPostUpdateRequest request);
    JobPostDashboardResponse toJobPostDashboard(JobPost jobPost);
}

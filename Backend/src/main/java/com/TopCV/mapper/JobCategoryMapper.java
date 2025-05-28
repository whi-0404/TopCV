package com.TopCV.mapper;

import com.TopCV.dto.response.JobCategoryResponse;
import com.TopCV.dto.request.JobCategoryRequest;
import com.TopCV.entity.JobCategory;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface JobCategoryMapper {
    JobCategory toEntity(JobCategoryRequest request);
    JobCategoryResponse toResponse(JobCategory jobCategory);
    void updateEntity(@MappingTarget JobCategory category, JobCategoryRequest request);
}
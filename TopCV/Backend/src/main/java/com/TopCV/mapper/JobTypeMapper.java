package com.TopCV.mapper;

import com.TopCV.dto.request.JobTypeRequest;
import com.TopCV.dto.response.JobTypeResponse;
import com.TopCV.entity.JobType;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface JobTypeMapper {
    JobType toEntity(JobTypeRequest request);
    JobTypeResponse toResponse(JobType jobType);
    void updateEntity(@MappingTarget JobType jobType, JobTypeRequest request);
}
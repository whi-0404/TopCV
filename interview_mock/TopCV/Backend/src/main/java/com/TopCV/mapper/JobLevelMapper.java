package com.TopCV.mapper;

import com.TopCV.dto.request.JobLevelRequest;
import com.TopCV.dto.response.JobLevelResponse;
import com.TopCV.entity.JobLevel;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface JobLevelMapper {
    JobLevel toEntity(JobLevelRequest request);
    JobLevelResponse toResponse(JobLevel jobLevel);
    void updateEntity(@MappingTarget JobLevel jobLevel, JobLevelRequest request);
}
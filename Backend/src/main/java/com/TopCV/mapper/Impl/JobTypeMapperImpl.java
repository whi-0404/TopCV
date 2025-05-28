package com.TopCV.mapper.Impl;

import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.TopCV.dto.request.JobTypeRequest;
import com.TopCV.dto.response.JobTypeResponse;
import com.TopCV.entity.JobType;
import com.TopCV.mapper.JobTypeMapper;

@Component
@RequiredArgsConstructor
@Slf4j
public class JobTypeMapperImpl implements JobTypeMapper {

    @Override
    public JobType toEntity(JobTypeRequest request) {
        if (request == null) {
            return null;
        }
        return JobType.builder()
                .name(request.getName())
                .build();
    }

    @Override
    public JobTypeResponse toResponse(JobType jobType) {
        if (jobType == null) {
            return null;
        }
        return JobTypeResponse.builder()
                .id(jobType.getId())
                .name(jobType.getName())
                .build();
    }

    @Override
    public void updateEntity(JobType jobType, JobTypeRequest request) {
        if (jobType == null || request == null) {
            return;
        }
        if (request.getName() != null) {
            jobType.setName(request.getName());
        }
    }
}
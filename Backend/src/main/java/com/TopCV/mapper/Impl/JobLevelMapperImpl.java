package com.TopCV.mapper.Impl;

import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.TopCV.dto.request.JobLevelRequest;
import com.TopCV.dto.response.JobLevelResponse;
import com.TopCV.entity.JobLevel;
import com.TopCV.mapper.JobLevelMapper;

@Component
@RequiredArgsConstructor
@Slf4j
public class JobLevelMapperImpl implements JobLevelMapper {

    @Override
    public JobLevel toEntity(JobLevelRequest request) {
        if (request == null) {
            return null;
        }
        return JobLevel.builder()
                .name(request.getName())
                .build();
    }

    @Override
    public JobLevelResponse toResponse(JobLevel jobLevel) {
        if (jobLevel == null) {
            return null;
        }
        return JobLevelResponse.builder()
                .id(jobLevel.getId())
                .name(jobLevel.getName())
                .build();
    }

    @Override
    public void updateEntity(JobLevel jobLevel, JobLevelRequest request) {
        if (jobLevel == null || request == null) {
            return;
        }
        if (request.getName() != null) {
            jobLevel.setName(request.getName());
        }
    }
}
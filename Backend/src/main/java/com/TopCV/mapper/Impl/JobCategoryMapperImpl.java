package com.TopCV.mapper.Impl;

import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.TopCV.dto.request.JobCategoryRequest;
import com.TopCV.dto.response.JobCategoryResponse;
import com.TopCV.entity.JobCategory;
import com.TopCV.mapper.JobCategoryMapper;

@Component
@RequiredArgsConstructor
@Slf4j
public class JobCategoryMapperImpl implements JobCategoryMapper {

    @Override
    public JobCategory toEntity(JobCategoryRequest request) {
        if (request == null) {
            return null;
        }
        return JobCategory.builder()
                .name(request.getName())
                .build();
    }

    @Override
    public JobCategoryResponse toResponse(JobCategory jobCategory) {
        if (jobCategory == null) {
            return null;
        }
        return JobCategoryResponse.builder()
                .id(jobCategory.getId())
                .name(jobCategory.getName())
                .build();
    }

    @Override
    public void updateEntity(JobCategory category, JobCategoryRequest request) {
        if (category == null || request == null) {
            return;
        }
        if (request.getName() != null) {
            category.setName(request.getName());
        }
    }
}
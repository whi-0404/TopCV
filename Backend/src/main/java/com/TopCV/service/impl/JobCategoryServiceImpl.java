package com.TopCV.service.impl;

import com.TopCV.dto.request.JobCategoryRequest;
import com.TopCV.dto.response.JobCategoryResponse;
import com.TopCV.entity.JobCategory;
import com.TopCV.exception.AppException;
import com.TopCV.exception.ErrorCode;
import com.TopCV.mapper.JobCategoryMapper;
import com.TopCV.repository.JobCategoryRepository;
import com.TopCV.service.JobCategoryService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class JobCategoryServiceImpl implements JobCategoryService {

    JobCategoryRepository jobCategoryRepository;
    JobCategoryMapper jobCategoryMapper;

    @Override
    @Transactional
    public JobCategoryResponse createJobCategory(JobCategoryRequest request) {
        if (jobCategoryRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.CATEGORY_NAME_EXISTS);
        }

        JobCategory category = jobCategoryMapper.toEntity(request);
        return jobCategoryMapper.toResponse(jobCategoryRepository.save(category));
    }

    @Override
    public List<JobCategoryResponse> getAllJobCategories() {
        return jobCategoryRepository.findAll().stream()
                .map(jobCategoryMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public JobCategoryResponse getJobCategoryById(Integer id) {
        JobCategory category = jobCategoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        return jobCategoryMapper.toResponse(category);
    }

    @Override
    @Transactional
    public JobCategoryResponse updateJobCategory(Integer categoryId, JobCategoryRequest request) {
        JobCategory category = jobCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        jobCategoryMapper.updateEntity(category, request);
        return jobCategoryMapper.toResponse(jobCategoryRepository.save(category));
    }

    @Override
    @Transactional
    public void deleteJobCategory(Integer categoryId) {
        if (!jobCategoryRepository.existsById(categoryId)) {
            throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
        }
        jobCategoryRepository.deleteById(categoryId);
    }
}
package com.TopCV.service.impl;

import com.TopCV.dto.request.JobLevelRequest;
import com.TopCV.dto.response.JobLevelResponse;
import com.TopCV.entity.JobLevel;
import com.TopCV.exception.AppException;
import com.TopCV.exception.ErrorCode;
import com.TopCV.mapper.JobLevelMapper;
import com.TopCV.repository.JobLevelRepository;
import com.TopCV.service.JobLevelService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class JobLevelServiceImpl implements JobLevelService {

    JobLevelRepository jobLevelRepository;
    JobLevelMapper jobLevelMapper;

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public JobLevelResponse createJobLevel(JobLevelRequest request) {
        if (jobLevelRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.LEVEL_NAME_EXISTED);
        }
        JobLevel jobLevel = jobLevelMapper.toEntity(request);
        return jobLevelMapper.toResponse(jobLevelRepository.save(jobLevel));
    }

    @Override
    public List<JobLevelResponse> getAllJobLevels() {
        return jobLevelRepository.findAll().stream()
                .map(jobLevelMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public JobLevelResponse getJobLevelById(Integer id) {
        JobLevel jobLevel = jobLevelRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.LEVEL_NOT_EXISTED));
        return jobLevelMapper.toResponse(jobLevel);
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public JobLevelResponse updateJobLevel(Integer levelId, JobLevelRequest request) {
        JobLevel jobLevel = jobLevelRepository.findById(levelId)
                .orElseThrow(() -> new AppException(ErrorCode.LEVEL_NOT_EXISTED));
        jobLevelMapper.updateEntity(jobLevel, request);
        return jobLevelMapper.toResponse(jobLevelRepository.save(jobLevel));
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteJobLevel(Integer levelId) {
        if (!jobLevelRepository.existsById(levelId)) {
            throw new AppException(ErrorCode.LEVEL_NOT_EXISTED);
        }
        jobLevelRepository.deleteById(levelId);
    }
}
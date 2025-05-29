package com.TopCV.service.impl;

import com.TopCV.dto.request.JobTypeRequest;
import com.TopCV.dto.response.JobTypeResponse;
import com.TopCV.entity.JobType;
import com.TopCV.exception.AppException;
import com.TopCV.exception.ErrorCode;
import com.TopCV.mapper.JobTypeMapper;
import com.TopCV.repository.JobTypeRepository;
import com.TopCV.service.JobTypeService;
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
public class JobTypeServiceImpl implements JobTypeService {

    JobTypeRepository jobTypeRepository;
    JobTypeMapper jobTypeMapper;

    @Override
    @Transactional
    public JobTypeResponse createJobType(JobTypeRequest request) {
        if (jobTypeRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.TYPE_NAME_EXISTS);
        }
        JobType jobType = jobTypeMapper.toEntity(request);
        return jobTypeMapper.toResponse(jobTypeRepository.save(jobType));
    }

    @Override
    public List<JobTypeResponse> getAllJobTypes() {
        return jobTypeRepository.findAll().stream()
                .map(jobTypeMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public JobTypeResponse getJobTypeById(Integer id) {
        JobType jobType = jobTypeRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.TYPE_NOT_EXISTS));
        return jobTypeMapper.toResponse(jobType);
    }

    @Override
    @Transactional
    public JobTypeResponse updateJobType(Integer typeId, JobTypeRequest request) {
        JobType jobType = jobTypeRepository.findById(typeId)
                .orElseThrow(() -> new AppException(ErrorCode.TYPE_NOT_EXISTS));
        jobTypeMapper.updateEntity(jobType, request);
        return jobTypeMapper.toResponse(jobTypeRepository.save(jobType));
    }

    @Override
    @Transactional
    public void deleteJobType(Integer typeId) {
        if (!jobTypeRepository.existsById(typeId)) {
            throw new AppException(ErrorCode.TYPE_NOT_EXISTS);
        }
        jobTypeRepository.deleteById(typeId);
    }
}
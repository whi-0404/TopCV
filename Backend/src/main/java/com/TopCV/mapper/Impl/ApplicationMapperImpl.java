package com.TopCV.mapper.Impl;

import com.TopCV.dto.response.ApplicationResponse;
import com.TopCV.entity.Application;
import com.TopCV.mapper.ApplicationMapper;
import com.TopCV.mapper.JobPostMapper;
import com.TopCV.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ApplicationMapperImpl implements ApplicationMapper {
    private final JobPostMapper jobPostMapper;
    private final UserMapper userMapper;

    public ApplicationResponse toResponse(Application application){
        if (application == null) {
            return null;
        }
        return ApplicationResponse.builder()
                .id(application.getId())
                .jobPost(jobPostMapper.toJobPostDashboard(application.getJobPost()))
                .createdAt(application.getCreatedAt())
                .status(application.getStatus())
                .coverLetter(application.getCoverLetter())
                .build();
    }

    public ApplicationResponse toResponseForEmployer(Application application){
        if (application == null) {
            return null;
        }
        return ApplicationResponse.builder()
                .id(application.getId())
                .jobPost(jobPostMapper.toJobPostDashboard(application.getJobPost()))
                .user(userMapper.toDashBoardUser(application.getUser()))
                .createdAt(application.getCreatedAt())
                .status(application.getStatus())
                .coverLetter(application.getCoverLetter())
                .build();
    }
}

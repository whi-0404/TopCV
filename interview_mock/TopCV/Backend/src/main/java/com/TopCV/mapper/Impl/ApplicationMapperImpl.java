package com.TopCV.mapper.Impl;

import com.TopCV.dto.response.ApplicationResponse;
import com.TopCV.dto.response.JobLevelResponse;
import com.TopCV.dto.response.JobTypeResponse;
import com.TopCV.dto.response.JobPost.JobPostDashboardResponse;
import com.TopCV.dto.response.UserDashboardResponse;
import com.TopCV.entity.Application;
import com.TopCV.entity.JobLevel;
import com.TopCV.entity.JobPost;
import com.TopCV.entity.JobType;
import com.TopCV.entity.User;
import com.TopCV.mapper.ApplicationMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ApplicationMapperImpl implements ApplicationMapper {

    @Override
    public ApplicationResponse toResponse(Application application) {
        if (application == null) {
            return null;
        }

        JobPost jobPost = application.getJobPost();
        JobPostDashboardResponse jobPostResponse = null;
        
        if (jobPost != null) {
            jobPostResponse = JobPostDashboardResponse.builder()
                    .id(jobPost.getId())
                    .title(jobPost.getTitle())
                    .location(jobPost.getLocation())
                    .appliedCount(jobPost.getAppliedCount())
                    .companyName(jobPost.getCompany() != null ? jobPost.getCompany().getName() : null)
                    .logo(jobPost.getCompany() != null ? jobPost.getCompany().getLogo() : null)
                    .type(jobPost.getType() != null ? mapJobType(jobPost.getType()) : null)
                    .level(jobPost.getLevel() != null ? mapJobLevel(jobPost.getLevel()) : null)
                    .build();
        }

        return ApplicationResponse.builder()
                .id(application.getId())
                .createdAt(application.getCreatedAt())
                .status(application.getStatus())
                .jobPost(jobPostResponse)
                .build();
    }

    @Override
    public ApplicationResponse toResponseForEmployer(Application application) {
        if (application == null) {
            return null;
        }

        // Lấy thông tin cơ bản như toResponse
        ApplicationResponse response = toResponse(application);
        
        // Bổ sung thông tin người ứng tuyển cho employer view
        User user = application.getUser();
        if (user != null) {
            UserDashboardResponse userResponse = UserDashboardResponse.builder()
                    .id(user.getId())
                    .fullname(user.getFullname())
                    .avt(user.getAvt())
                    .role(user.getRole())
                    .build();
            
            response.setUser(userResponse);
        }
        
        return response;
    }

    // Helper methods để mapping type và level
    private JobTypeResponse mapJobType(JobType jobType) {
        if (jobType == null) {
            return null;
        }
        return JobTypeResponse.builder()
                .id(jobType.getId())
                .name(jobType.getName())
                .build();
    }

    private JobLevelResponse mapJobLevel(JobLevel jobLevel) {
        if (jobLevel == null) {
            return null;
        }
        return JobLevelResponse.builder()
                .id(jobLevel.getId())
                .name(jobLevel.getName())
                .build();
    }
}

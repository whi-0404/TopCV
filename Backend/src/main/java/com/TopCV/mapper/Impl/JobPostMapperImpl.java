package com.TopCV.mapper.Impl;

import com.TopCV.dto.request.JobPost.JobPostCreationRequest;
import com.TopCV.dto.request.JobPost.JobPostUpdateRequest;
import com.TopCV.dto.response.JobPost.JobPostDashboardResponse;
import com.TopCV.dto.response.JobPost.JobPostResponse;
import com.TopCV.entity.JobPost;
import com.TopCV.mapper.*;
import com.TopCV.repository.ApplicationRepository;
import com.TopCV.repository.CompanyRepository;
import com.TopCV.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class JobPostMapperImpl implements JobPostMapper {

    private final CompanyMapper companyMapper;
    private final JobTypeMapper jobTypeMapper;
    private final JobLevelMapper jobLevelMapper;
    private final SkillMapper skillMapper;
    private final ApplicationMapper applicationMapper;
    private final CompanyRepository companyRepository;

    @Override
    public JobPost toEntity(JobPostCreationRequest request) {
        if (request == null) {
            return null;
        }

        return JobPost.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .requirements(request.getRequirements())
                .benefits(request.getBenefits())
                .location(request.getLocation())
                .workingTime(request.getWorkingTime())
                .salary(request.getSalary())
                .experienceRequired(request.getExperienceRequired())
                .deadline(request.getDeadline())
                .hiringQuota(request.getHiringQuota())
                .build();
    }

    @Override
    public JobPostResponse toResponse(JobPost jobPost) {
        if (jobPost == null) {
            return null;
        }

        return JobPostResponse.builder()
                .id(jobPost.getId())
                .title(jobPost.getTitle())
                .location(jobPost.getLocation())
                .salary(jobPost.getSalary())
                .experienceRequired(jobPost.getExperienceRequired())
                .deadline(jobPost.getDeadline())
                .appliedCount(jobPost.getAppliedCount())
                .hiringQuota(jobPost.getHiringQuota())
                .status(jobPost.getStatus())
                .createdAt(jobPost.getCreatedAt())
                .updatedAt(jobPost.getUpdatedAt())
                .company(companyMapper.toCompanyDashboard(jobPost.getCompany()))
                .jobType(jobTypeMapper.toResponse(jobPost.getType()))
                .jobLevel(jobLevelMapper.toResponse(jobPost.getLevel()))
                .skills(jobPost.getSkills().stream()
                        .map(skillMapper::toResponse)
                        .collect(Collectors.toList()))
                .isFavorite(false) // Will be set in context-aware methods
                .canApply(true)    // Will be set in context-aware methods
                .build();
    }

//    @Override
//    public JobPostResponse toResponseWithUserContext(JobPost jobPost, String userEmail) {
//        JobPostResponse response = toResponse(jobPost);
//
//        if (userEmail != null) {
//            try {
//                User user = userRepository.findByEmail(userEmail).orElse(null);
//                if (user != null) {
//                    // Check if job is in user's favorites
//                    boolean isFavorite = user.getFavoriteJobs().stream()
//                            .anyMatch(job -> job.getId().equals(jobPost.getId()));
//                    response.setIsFavorite(isFavorite);
//
//                    // Check if user can apply (not already applied)
//                    boolean hasApplied = applicationRepository.existsByUserIdAndJobPostId(
//                            user.getId(), jobPost.getId());
//                    response.setCanApply(!hasApplied && jobPost.getStatus().name().equals("ACTIVE"));
//                }
//            } catch (Exception e) {
//                log.warn("Error setting user context for job post {}: {}", jobPost.getId(), e.getMessage());
//            }
//        }
//
//        return response;
//    }

//    @Override
//    public JobPostDetailResponse toDetailResponse(JobPost jobPost) {
//        if (jobPost == null) {
//            return null;
//        }
//
//        JobPostDetailResponse response = JobPostDetailResponse.builder()
//                .id(jobPost.getId())
//                .title(jobPost.getTitle())
//                .description(jobPost.getDescription())
//                .requirements(jobPost.getRequirements())
//                .benefits(jobPost.getBenefits())
//                .location(jobPost.getLocation())
//                .workingTime(jobPost.getWorkingTime())
//                .salary(jobPost.getSalary())
//                .experienceRequired(jobPost.getExperienceRequired())
//                .deadline(jobPost.getDeadline())
//                .appliedCount(jobPost.getAppliedCount())
//                .hiringQuota(jobPost.getHiringQuota())
//                .status(jobPost.getStatus())
//                .createdAt(jobPost.getCreatedAt())
//                .updatedAt(jobPost.getUpdatedAt())
//                .company(companyMapper.toResponse(jobPost.getCompany()))
//                .jobType(jobTypeMapper.toResponse(jobPost.getType()))
//                .jobLevel(jobLevelMapper.toResponse(jobPost.getLevel()))
//                .skills(jobPost.getSkills().stream()
//                        .map(skillMapper::toResponse)
//                        .collect(Collectors.toList()))
//                .isFavorite(false)
//                .canApply(true)
//                .hasApplied(false)
//                .build();
//
//        // Add recent applications for employer view
//        try {
//            List<Application> recentApplications = applicationRepository
//                    .findRecentApplicationsByCompany(jobPost.getCompany().getId(),
//                            jobPost.getCreatedAt().minusDays(7));
//
//            List<ApplicationSummaryResponse> applicationSummaries = recentApplications.stream()
//                    .filter(app -> app.getJobPost().getId().equals(jobPost.getId()))
//                    .limit(5)
//                    .map(applicationMapper::toSummaryResponse)
//                    .collect(Collectors.toList());
//
//            response.setRecentApplications(applicationSummaries);
//        } catch (Exception e) {
//            log.warn("Error loading recent applications for job post {}: {}", jobPost.getId(), e.getMessage());
//            response.setRecentApplications(List.of());
//        }
//
//        return response;
//    }

//    @Override
//    public JobPostDetailResponse toDetailResponseWithUserContext(JobPost jobPost, String userEmail) {
//        JobPostDetailResponse response = toDetailResponse(jobPost);
//
//        if (userEmail != null) {
//            try {
//                User user = userRepository.findByEmail(userEmail).orElse(null);
//                if (user != null) {
//                    // Check if job is in user's favorites
//                    boolean isFavorite = user.getFavoriteJobs().stream()
//                            .anyMatch(job -> job.getId().equals(jobPost.getId()));
//                    response.setIsFavorite(isFavorite);
//
//                    // Check if user has already applied
//                    boolean hasApplied = applicationRepository.existsByUserIdAndJobPostId(
//                            user.getId(), jobPost.getId());
//                    response.setHasApplied(hasApplied);
//                    response.setCanApply(!hasApplied && jobPost.getStatus().name().equals("ACTIVE"));
//                }
//            } catch (Exception e) {
//                log.warn("Error setting user context for job post detail {}: {}", jobPost.getId(), e.getMessage());
//            }
//        }
//
//        return response;
//    }

    @Override
    public void updateEntity(JobPost jobPost, JobPostUpdateRequest request) {
        if (request == null || jobPost == null) {
            return;
        }

        if (request.getTitle() != null) {
            jobPost.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            jobPost.setDescription(request.getDescription());
        }
        if (request.getRequirements() != null) {
            jobPost.setRequirements(request.getRequirements());
        }
        if (request.getBenefits() != null) {
            jobPost.setBenefits(request.getBenefits());
        }
        if (request.getLocation() != null) {
            jobPost.setLocation(request.getLocation());
        }
        if (request.getWorkingTime() != null) {
            jobPost.setWorkingTime(request.getWorkingTime());
        }
        if (request.getSalary() != null) {
            jobPost.setSalary(request.getSalary());
        }
        if (request.getExperienceRequired() != null) {
            jobPost.setExperienceRequired(request.getExperienceRequired());
        }
        if (request.getDeadline() != null) {
            jobPost.setDeadline(request.getDeadline());
        }
        if (request.getHiringQuota() != null) {
            jobPost.setHiringQuota(request.getHiringQuota());
        }
    }

    @Override
    public JobPostDashboardResponse toJobPostDashboard(JobPost jobPost){

        return JobPostDashboardResponse.builder()
                .id(jobPost.getId())
                .location(jobPost.getLocation())
                .title(jobPost.getTitle())
                .companyName(jobPost.getCompany().getName())
                .level(jobLevelMapper.toResponse(jobPost.getLevel()))
                .type(jobTypeMapper.toResponse(jobPost.getType()))
                .logo(jobPost.getCompany().getLogo())
                .appliedCount(jobPost.getAppliedCount())
                .build();
    }
}

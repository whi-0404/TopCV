package com.TopCV.service.impl;

import com.TopCV.dto.request.JobPost.JobPostCreationRequest;
import com.TopCV.dto.request.JobPost.JobPostSearchRequest;
import com.TopCV.dto.request.JobPost.JobPostUpdateRequest;
import com.TopCV.dto.response.JobPost.JobPostDashboardResponse;
import com.TopCV.dto.response.JobPost.JobPostResponse;
import com.TopCV.dto.response.PageResponse;
import com.TopCV.entity.*;
import com.TopCV.enums.JobPostStatus;
import com.TopCV.exception.AppException;
import com.TopCV.exception.ErrorCode;
import com.TopCV.mapper.JobPostMapper;
import com.TopCV.repository.*;
import com.TopCV.service.JobPostService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class JobPostServiceImpl implements JobPostService {
    JobPostRepository jobPostRepository;
    CompanyRepository companyRepository;
    UserRepository userRepository;
    JobTypeRepository jobTypeRepository;
    JobLevelRepository jobLevelRepository;
    SkillRepository skillRepository;
    ApplicationRepository applicationRepository;
    JobPostMapper jobPostMapper;

    @Override
    @Transactional
    @PreAuthorize("hasRole('EMPLOYER')")
    public JobPostResponse createJobPost(JobPostCreationRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Company company = companyRepository.findByUserId(user.getId())
                .orElseThrow(() -> new AppException(ErrorCode.COMPANY_NOT_EXISTED));

        if (!company.getActive()) {
            throw new AppException(ErrorCode.COMPANY_NOT_ACTIVE);
        }

        // Validate job type and level
        JobType jobType = jobTypeRepository.findById(request.getJobTypeId())
                .orElseThrow(() -> new AppException(ErrorCode.TYPE_NOT_EXISTED));

        JobLevel jobLevel = jobLevelRepository.findById(request.getJobLevelId())
                .orElseThrow(() -> new AppException(ErrorCode.LEVEL_NOT_EXISTED));

        // Validate skills
        List<Skill> skills = List.of();
        if (request.getSkillIds() != null && !request.getSkillIds().isEmpty()) {
            skills = skillRepository.findAllById(request.getSkillIds());
            if (skills.size() != request.getSkillIds().size()) {
                throw new AppException(ErrorCode.SKILL_NOT_EXISTED);
            }
        }

        JobPost jobPost = jobPostMapper.toEntity(request);
        jobPost.setCompany(company);
        jobPost.setType(jobType);
        jobPost.setLevel(jobLevel);
        jobPost.setSkills(skills);
        jobPost.setStatus(JobPostStatus.PENDING);
        jobPost.setAppliedCount(0);

        return jobPostMapper.toResponse(jobPostRepository.save(jobPost));
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('EMPLOYER')")
    public JobPostResponse updateJobPost(Integer jobId, JobPostUpdateRequest request) {
        JobPost jobPost = jobPostRepository.findById(jobId)
                .orElseThrow(() -> new AppException(ErrorCode.JOB_POST_NOT_EXISTED));

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (!jobPost.getCompany().getUser().getId().equals(currentUser.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        // Can only update if status is PENDING or ACTIVE
        if (jobPost.getStatus() != JobPostStatus.PENDING &&
                jobPost.getStatus() != JobPostStatus.ACTIVE) {
            throw new AppException(ErrorCode.CANNOT_UPDATE_JOB_POST);
        }

        jobPostMapper.updateEntity(jobPost, request);

        // Update job type if provided
        if (request.getJobTypeId() != null) {
            JobType jobType = jobTypeRepository.findById(request.getJobTypeId())
                    .orElseThrow(() -> new AppException(ErrorCode.TYPE_NOT_EXISTED));
            jobPost.setType(jobType);
        }

        // Update job level if provided
        if (request.getJobLevelId() != null) {
            JobLevel jobLevel = jobLevelRepository.findById(request.getJobLevelId())
                    .orElseThrow(() -> new AppException(ErrorCode.LEVEL_NOT_EXISTED));
            jobPost.setLevel(jobLevel);
        }

        // Update skills if provided
        if (request.getSkillIds() != null) {
            if (request.getSkillIds().isEmpty()) {
                jobPost.setSkills(List.of());
            } else {
                List<Skill> skills = skillRepository.findAllById(request.getSkillIds());
                if (skills.size() != request.getSkillIds().size()) {
                    throw new AppException(ErrorCode.SKILL_NOT_EXISTED);
                }
                jobPost.setSkills(skills);
            }
        }

        // Reset to PENDING if was ACTIVE (needs re-approval)
        if (jobPost.getStatus() == JobPostStatus.ACTIVE) {
            jobPost.setStatus(JobPostStatus.PENDING);
        }

        return jobPostMapper.toResponse(jobPostRepository.save(jobPost));
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('EMPLOYER')")
    public void deleteJobPost(Integer jobId) {
        JobPost jobPost = jobPostRepository.findById(jobId)
                .orElseThrow(() -> new AppException(ErrorCode.JOB_POST_NOT_EXISTED));

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (!jobPost.getCompany().getUser().getId().equals(currentUser.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        // Can only delete if no applications or if status is PENDING
        if (jobPost.getAppliedCount() > 0 && jobPost.getStatus() != JobPostStatus.PENDING) {
            throw new AppException(ErrorCode.CANNOT_DELETE_JOB_POST_WITH_APPLICATIONS);
        }

        jobPostRepository.deleteById(jobId);
    }

    @Override
    @PreAuthorize("hasRole('EMPLOYER')")
    public PageResponse<JobPostResponse> getMyJobPosts(int page, int size) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Company company = companyRepository.findByUserId(user.getId())
                .orElseThrow(() -> new AppException(ErrorCode.COMPANY_NOT_EXISTED));

        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());
        Page<JobPost> pageData = jobPostRepository.findByCompanyId(company.getId(), pageable);

        return PageResponse.<JobPostResponse>builder()
                .pageSize(pageData.getSize())
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .Data(pageData.getContent().stream()
                        .map(jobPostMapper::toResponse)
                        .toList())
                .build();
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('EMPLOYER')")
    public void closeJobPost(Integer jobId) {
        JobPost jobPost = jobPostRepository.findById(jobId)
                .orElseThrow(() -> new AppException(ErrorCode.JOB_POST_NOT_EXISTED));

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (!jobPost.getCompany().getUser().getId().equals(currentUser.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        if (jobPost.getStatus() != JobPostStatus.ACTIVE) {
            throw new AppException(ErrorCode.CANNOT_CLOSE_INACTIVE_JOB_POST);
        }

        jobPost.setStatus(JobPostStatus.CLOSED);
        jobPostRepository.save(jobPost);
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('EMPLOYER')")
    public void reopenJobPost(Integer jobId) {
        JobPost jobPost = jobPostRepository.findById(jobId)
                .orElseThrow(() -> new AppException(ErrorCode.JOB_POST_NOT_EXISTED));

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (!jobPost.getCompany().getUser().getId().equals(currentUser.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        if (jobPost.getStatus() != JobPostStatus.CLOSED) {
            throw new AppException(ErrorCode.CANNOT_REOPEN_ACTIVE_JOB_POST);
        }

        // Check if deadline is still valid
        if (jobPost.getDeadline().isBefore(LocalDate.now())) {
            throw new AppException(ErrorCode.JOB_POST_DEADLINE_EXPIRED);
        }

        jobPost.setStatus(JobPostStatus.ACTIVE);
        jobPostRepository.save(jobPost);
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void approveJobPost(Integer jobId) {
        JobPost jobPost = jobPostRepository.findById(jobId)
                .orElseThrow(() -> new AppException(ErrorCode.JOB_POST_NOT_EXISTED));

        if (jobPost.getStatus() != JobPostStatus.PENDING) {
            throw new AppException(ErrorCode.JOB_POST_NOT_PENDING);
        }

        jobPost.setStatus(JobPostStatus.ACTIVE);
        jobPostRepository.save(jobPost);
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void rejectJobPost(Integer jobId) {
        JobPost jobPost = jobPostRepository.findById(jobId)
                .orElseThrow(() -> new AppException(ErrorCode.JOB_POST_NOT_EXISTED));

        if (jobPost.getStatus() != JobPostStatus.PENDING) {
            throw new AppException(ErrorCode.JOB_POST_NOT_PENDING);
        }

        jobPost.setStatus(JobPostStatus.REJECTED);
        jobPostRepository.save(jobPost);
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void suspendJobPost(Integer jobId) {
        JobPost jobPost = jobPostRepository.findById(jobId)
                .orElseThrow(() -> new AppException(ErrorCode.JOB_POST_NOT_EXISTED));

        if (jobPost.getStatus() != JobPostStatus.ACTIVE) {
            throw new AppException(ErrorCode.JOB_POST_NOT_ACTIVE);
        }

        jobPost.setStatus(JobPostStatus.SUSPENDED);
        jobPostRepository.save(jobPost);
    }

    @Override
    public PageResponse<JobPostDashboardResponse> getJobPostsByCompany(Integer companyId, int page, int size) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new AppException(ErrorCode.COMPANY_NOT_EXISTED));

        if (!company.getActive()) {
            throw new AppException(ErrorCode.COMPANY_NOT_ACTIVE);
        }

        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());
        Page<JobPost> pageData = jobPostRepository.findByCompanyIdAndStatus(
                companyId, JobPostStatus.ACTIVE, pageable);

        return PageResponse.<JobPostDashboardResponse>builder()
                .pageSize(pageData.getSize())
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .Data(pageData.getContent().stream()
                        .map(jobPostMapper::toJobPostDashboard)
                        .toList())
                .build();
    }

    @Override
    @PreAuthorize("hasRole('USER')")
    @Transactional
    public void favoriteJob(Integer jobId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        JobPost jobPost = jobPostRepository.findById(jobId)
                .orElseThrow(() -> new AppException(ErrorCode.JOB_POST_NOT_EXISTED));

        if (jobPost.getStatus() != JobPostStatus.ACTIVE) {
            throw new AppException(ErrorCode.JOB_POST_NOT_ACTIVE);
        }

        if (user.getFavoriteJobs().contains(jobPost)) {
            throw new AppException(ErrorCode.ALREADY_FAVORITED_JOB);
        }

        user.getFavoriteJobs().add(jobPost);
        userRepository.save(user);
    }

    @Override
    @PreAuthorize("hasRole('USER')")
    @Transactional
    public void unFavoriteJob(Integer jobId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        JobPost jobPost = jobPostRepository.findById(jobId)
                .orElseThrow(() -> new AppException(ErrorCode.JOB_POST_NOT_EXISTED));

        if (!user.getFavoriteJobs().contains(jobPost)) {
            throw new AppException(ErrorCode.NOT_FAVORITED_JOB);
        }

        user.getFavoriteJobs().remove(jobPost);
        userRepository.save(user);
    }

    @Override
    @PreAuthorize("hasRole('USER')")
    public boolean isFavoriteJob(Integer jobId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return user.getFavoriteJobs().stream()
                .anyMatch(job -> job.getId() == jobId);
    }

    private Specification<JobPost> buildSearchSpecification(JobPostSearchRequest request) {
        return (root, query, criteriaBuilder) -> {
            var predicates = criteriaBuilder.conjunction();

            // Only show active jobs for public search
            predicates = criteriaBuilder.and(predicates,
                    criteriaBuilder.equal(root.get("status"), JobPostStatus.ACTIVE));

            // Only show jobs with future deadlines
            predicates = criteriaBuilder.and(predicates,
                    criteriaBuilder.greaterThan(root.get("deadline"), LocalDate.now()));

            if (request.getKeyword() != null && !request.getKeyword().trim().isEmpty()) {
                String keyword = "%" + request.getKeyword().toLowerCase() + "%";
                var keywordPredicate = criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), keyword),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), keyword),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("requirements")), keyword),
                        criteriaBuilder.like(criteriaBuilder.lower(root.join("company").get("name")), keyword)
                );
                predicates = criteriaBuilder.and(predicates, keywordPredicate);
            }

            if (request.getLocation() != null && !request.getLocation().trim().isEmpty()) {
                String location = "%" + request.getLocation().toLowerCase() + "%";
                predicates = criteriaBuilder.and(predicates,
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("location")), location));
            }

            if (request.getJobTypeIds() != null && !request.getJobTypeIds().isEmpty()) {
                predicates = criteriaBuilder.and(predicates,
                        root.get("type").get("id").in(request.getJobTypeIds()));
            }

            if (request.getJobLevelIds() != null && !request.getJobLevelIds().isEmpty()) {
                predicates = criteriaBuilder.and(predicates,
                        root.get("level").get("id").in(request.getJobLevelIds()));
            }

            if (request.getCompanyIds() != null && !request.getCompanyIds().isEmpty()) {
                predicates = criteriaBuilder.and(predicates,
                        root.get("company").get("id").in(request.getCompanyIds()));
            }

            if (request.getSkillIds() != null && !request.getSkillIds().isEmpty()) {
                var skillJoin = root.join("skills");
                predicates = criteriaBuilder.and(predicates,
                        skillJoin.get("id").in(request.getSkillIds()));
            }

            if (request.getSalaryRange() != null && !request.getSalaryRange().trim().isEmpty()) {
                String salary = "%" + request.getSalaryRange().toLowerCase() + "%";
                predicates = criteriaBuilder.and(predicates,
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("salary")), salary));
            }

            if (request.getExperienceLevel() != null && !request.getExperienceLevel().trim().isEmpty()) {
                String experience = "%" + request.getExperienceLevel().toLowerCase() + "%";
                predicates = criteriaBuilder.and(predicates,
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("experienceRequired")), experience));
            }

            return predicates;
        };
    }

    private Sort buildSort(String sortBy, String sortDirection) {
        if (sortBy == null || sortBy.isEmpty()) {
            sortBy = "createdAt"; // Default sort by creation date
        }

        Sort.Direction direction = Sort.Direction.fromString(sortDirection != null ? sortDirection : "DESC");
        return Sort.by(direction, sortBy);
    }

    @Override
    public JobPostResponse getJobPostDetail(Integer jobId) {
        JobPost jobPost = jobPostRepository.findById(jobId)
                .orElseThrow(() -> new AppException(ErrorCode.JOB_POST_NOT_EXISTED));
        
        return jobPostMapper.toResponse(jobPost);
    }

    @Override
    public PageResponse<JobPostResponse> searchJobPosts(JobPostSearchRequest request, int page, int size) {
        Specification<JobPost> spec = buildSearchSpecification(request);

        Sort sort = buildSort(request.getSortBy(), request.getSortDirection());
        Pageable pageable = PageRequest.of(page - 1, size, sort);

        Page<JobPost> pageData = jobPostRepository.findAll(spec, pageable);

        String currentUserEmail = null;
        try {
            currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        } catch (Exception e) {
            // Anonymous user
        }

        final String userEmail = currentUserEmail;

        return PageResponse.<JobPostResponse>builder()
                .pageSize(pageData.getSize())
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .Data(pageData.getContent().stream()
                        .map(job -> jobPostMapper.toResponse(job))
                        .toList())
                .build();
    }
}

package com.TopCV.service.impl;

import com.TopCV.dto.request.Application.ApplicationRequest;
import com.TopCV.dto.request.Application.ApplicationStatusUpdateRequest;
import com.TopCV.dto.response.ApplicationResponse;
import com.TopCV.dto.response.PageResponse;
import com.TopCV.entity.*;
import com.TopCV.enums.ApplicationStatus;
import com.TopCV.enums.JobPostStatus;
import com.TopCV.exception.AppException;
import com.TopCV.exception.ErrorCode;
import com.TopCV.mapper.ApplicationMapper;
import com.TopCV.repository.*;
import com.TopCV.service.ApplicationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.chrono.ChronoLocalDate;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class ApplicationServiceImpl implements ApplicationService {
    ApplicationRepository applicationRepository;
    JobPostRepository jobPostRepository;
    UserRepository userRepository;
    ResumeRepository resumeRepository;
    ApplicationMapper applicationMapper;

    @Override
    @Transactional
    @PreAuthorize("hasRole('USER')")
    public ApplicationResponse applyForJob(ApplicationRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        JobPost jobPost = jobPostRepository.findById(request.getJobId())
                .orElseThrow(() -> new AppException(ErrorCode.JOB_POST_NOT_EXISTED));

        // Validate job post status and deadline
        if (jobPost.getStatus() != JobPostStatus.ACTIVE) {
            throw new AppException(ErrorCode.JOB_POST_NOT_ACTIVE);
        }

        if (jobPost.getDeadline().isBefore(ChronoLocalDate.from(LocalDateTime.now()))) {
            throw new AppException(ErrorCode.JOB_POST_DEADLINE_EXPIRED);
        }

        // Check if user already applied
        if (applicationRepository.existsByUserIdAndJobPostId(user.getId(), request.getJobId())) {
            throw new AppException(ErrorCode.ALREADY_APPLIED_JOB);
        }

        // Validate resume belongs to user
        Resume resume = resumeRepository.findById(request.getResumeId())
                .orElseThrow(() -> new AppException(ErrorCode.RESUME_NOT_EXISTED));

        if (!resume.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.RESUME_NOT_BELONGS_TO_USER);
        }

        // Create application
        Application application = Application.builder()
                .user(user)
                .employer(jobPost.getCompany().getUser())
                .jobPost(jobPost)
                .resumes(resume)
                .status(ApplicationStatus.PENDING)
                .build();

        Application savedApplication = applicationRepository.save(application);

        // Update job post applied count
        jobPost.setAppliedCount(jobPost.getAppliedCount() + 1);
        jobPostRepository.save(jobPost);

        return applicationMapper.toResponse(savedApplication);
    }

//    @Override
//    @Transactional
//    @PreAuthorize("hasRole('USER')")
//    public ApplicationResponse applyForJobWithResume(Integer jobId, Integer resumeId) {
//        ApplicationRequest request = ApplicationRequest.builder()
//                .jobId(jobId)
//                .resumeId(resumeId)
//                .build();
//        return applyForJob(request);
//    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('USER')")
    public void withdrawApplication(Integer applicationId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new AppException(ErrorCode.APPLICATION_NOT_EXISTED));

        if (!application.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        // Can only withdraw if status is PENDING or REVIEWING
        if (application.getStatus() != ApplicationStatus.PENDING &&
                application.getStatus() != ApplicationStatus.REVIEWING) {
            throw new AppException(ErrorCode.CANNOT_WITHDRAW_APPLICATION);
        }

        // Update application status
        application.setStatus(ApplicationStatus.WITHDRAWN);
        applicationRepository.save(application);

        // Decrease job post applied count
        JobPost jobPost = application.getJobPost();
        jobPost.setAppliedCount(Math.max(0, jobPost.getAppliedCount() - 1));
        jobPostRepository.save(jobPost);
    }

    @Override
    @PreAuthorize("hasRole('USER')")
    public PageResponse<ApplicationResponse> getMyApplications(int page, int size) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());
        Page<Application> pageData = applicationRepository.findByUserId(user.getId(), pageable);

        return PageResponse.<ApplicationResponse>builder()
                .pageSize(pageData.getSize())
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .Data(pageData.getContent().stream()
                        .map(applicationMapper::toResponse)
                        .toList())
                .build();
    }

    @Override
    @PreAuthorize("hasRole('EMPLOYER')")
    public PageResponse<ApplicationResponse> getJobApplications(Integer jobId, int page, int size) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        JobPost jobPost = jobPostRepository.findById(jobId)
                .orElseThrow(() -> new AppException(ErrorCode.JOB_POST_NOT_EXISTED));

        // Verify user owns the company that posted the job
        if (!jobPost.getCompany().getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());
        Page<Application> pageData = applicationRepository.findByJobPostId(jobId, pageable);

        return PageResponse.<ApplicationResponse>builder()
                .pageSize(pageData.getSize())
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .Data(pageData.getContent().stream()
                        .map(applicationMapper::toResponseForEmployer)
                        .toList())
                .build();
    }

    @Override
    @PreAuthorize("hasRole('EMPLOYER')")
    public PageResponse<ApplicationResponse> getAllApplicationsForEmployer(int page, int size) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());
        Page<Application> pageData = applicationRepository.findAllByEmployer(user.getId(), pageable);

        return PageResponse.<ApplicationResponse>builder()
                .pageSize(pageData.getSize())
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .Data(pageData.getContent().stream()
                        .map(applicationMapper::toResponseForEmployer)
                        .toList())
                .build();
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public PageResponse<ApplicationResponse> getAllApplicationsForAdmin(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());
        Page<Application> pageData = applicationRepository.findAll(pageable);

        return PageResponse.<ApplicationResponse>builder()
                .pageSize(pageData.getSize())
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .Data(pageData.getContent().stream()
                        .map(applicationMapper::toResponseForEmployer)
                        .toList())
                .build();
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('EMPLOYER')")
    public ApplicationResponse updateApplicationStatus(Integer applicationId, ApplicationStatusUpdateRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new AppException(ErrorCode.APPLICATION_NOT_EXISTED));

        // Verify user owns the company that posted the job
        if (!application.getJobPost().getCompany().getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        // Validate status transition
        ApplicationStatus newStatus;
        try {
            newStatus = ApplicationStatus.valueOf(request.getStatus().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new AppException(ErrorCode.INVALID_APPLICATION_STATUS);
        }

        if (!isValidStatusTransition(application.getStatus(), newStatus)) {
            throw new AppException(ErrorCode.INVALID_STATUS_TRANSITION);
        }

        application.setStatus(newStatus);

        return applicationMapper.toResponse(applicationRepository.save(application));

        // Send notification to applicant
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('EMPLOYER')")
    public void bulkUpdateApplicationStatus(ApplicationStatusUpdateRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (request.getApplicationIds() == null || request.getApplicationIds().isEmpty()) {
            throw new AppException(ErrorCode.APPLICATION_IDS_REQUIRED);
        }

        List<Application> applications = applicationRepository.findAllById(request.getApplicationIds());

        if (applications.size() != request.getApplicationIds().size()) {
            throw new AppException(ErrorCode.SOME_APPLICATIONS_NOT_FOUND);
        }

        // Verify user owns all job posts
        for (Application application : applications) {
            if (!application.getJobPost().getCompany().getUser().getId().equals(user.getId())) {
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }
        }

        ApplicationStatus newStatus;
        try {
            newStatus = ApplicationStatus.valueOf(request.getStatus().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new AppException(ErrorCode.INVALID_APPLICATION_STATUS);
        }

        // Update all applications
        for (Application application : applications) {
            if (isValidStatusTransition(application.getStatus(), newStatus)) {
                application.setStatus(newStatus);
            }
        }

        applicationRepository.saveAll(applications);

        //send notification
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public PageResponse<ApplicationResponse> searchApplicationsAdmin(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());
        Page<Application> pageData = applicationRepository.searchApplicationsAdmin(keyword, pageable);

        return PageResponse.<ApplicationResponse>builder()
                .pageSize(pageData.getSize())
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .Data(pageData.getContent().stream()
                        .map(applicationMapper::toResponse)
                        .toList())
                .build();
    }

    @Override
    @PreAuthorize("hasRole('EMPLOYER')")
    public PageResponse<ApplicationResponse> searchApplicationsEmployer(String keyword, int page, int size) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());
        Page<Application> pageData = applicationRepository.searchApplicationsEmployer(user.getId(), keyword, pageable);

        return PageResponse.<ApplicationResponse>builder()
                .pageSize(pageData.getSize())
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .Data(pageData.getContent().stream()
                        .map(applicationMapper::toResponse)
                        .toList())
                .build();
    }

    private boolean isValidStatusTransition(ApplicationStatus currentStatus, ApplicationStatus newStatus) {
        return switch (currentStatus) {
            case PENDING -> newStatus == ApplicationStatus.REVIEWING ||
                    newStatus == ApplicationStatus.REJECTED;
            case REVIEWING -> newStatus == ApplicationStatus.SHORTLISTED ||
                    newStatus == ApplicationStatus.REJECTED;
            case SHORTLISTED -> newStatus == ApplicationStatus.INTERVIEWED ||
                    newStatus == ApplicationStatus.REJECTED;
            case INTERVIEWED -> newStatus == ApplicationStatus.HIRED ||
                    newStatus == ApplicationStatus.REJECTED;
            case REJECTED, HIRED, WITHDRAWN -> false; // Final states
        };
    }
}

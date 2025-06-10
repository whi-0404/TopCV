package com.TopCV.service.impl;

import com.TopCV.client.ScreeningServiceClient;
import com.TopCV.dto.external.ScreeningResponse;
import com.TopCV.entity.JobPost;
import com.TopCV.entity.Skill;
import com.TopCV.exception.AppException;
import com.TopCV.exception.ErrorCode;
import com.TopCV.repository.JobPostRepository;
import com.TopCV.service.ScreeningService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.stream.Collectors;

@Service
@Slf4j
public class ScreeningServiceImpl implements ScreeningService {
    
    private final ScreeningServiceClient screeningServiceClient;
    private final JobPostRepository jobPostRepository;
    private final ObjectMapper objectMapper;
    
    public ScreeningServiceImpl(
            ScreeningServiceClient screeningServiceClient,
            JobPostRepository jobPostRepository,
            ObjectMapper objectMapper) {
        this.screeningServiceClient = screeningServiceClient;
        this.jobPostRepository = jobPostRepository;
        this.objectMapper = objectMapper;
        log.info("=== ScreeningServiceImpl CREATED ===");
    }
    
    @Override
    public ScreeningResponse screenCvForJob(MultipartFile cvFile, Integer jobId) {
        log.info("=== SCREENING CV FOR JOB {} ===", jobId);
        
        try {
            // Step 1: Validate CV file
            if (cvFile == null || cvFile.isEmpty()) {
                throw new RuntimeException("CV file is required");
            }
            
            // Step 2: Get job information from PostgreSQL
            JobPost job = jobPostRepository.findById(jobId)
                    .orElseThrow(() -> new AppException(ErrorCode.JOB_POST_NOT_EXISTED));
            
            log.info("Found job: {} at {}", job.getTitle(), 
                    job.getCompany() != null ? job.getCompany().getName() : "Unknown");
            
            // Step 3: Check screening service health
            if (!isScreeningServiceHealthy()) {
                throw new RuntimeException("Screening service is currently unavailable");
            }
            
            // Step 4: Sync job data to Python service first
            String jobDataJson = prepareJobDataJson(job);
            log.info("Syncing job data to Python service: {}", jobDataJson);
            
            try {
                // Sync job to Python database
                screeningServiceClient.syncJobFromBackend(jobDataJson);
                log.info("Job {} synced successfully to Python service", jobId);
            } catch (Exception e) {
                log.warn("Failed to sync job data, proceeding anyway: {}", e.getMessage());
            }
            
            // Step 5: Call Python screening service
            ScreeningResponse response = screeningServiceClient.screenCvForJob(cvFile, jobId);
            
            log.info("Screening completed for job {}: Decision = {}, Score = {}", 
                    jobId, response.getCandidateDecision(), response.getOverallScore());
            
            return response;
            
        } catch (Exception e) {
            log.error("Error in screening CV for job {}: {}", jobId, e.getMessage());
            
            // Return error response
            return ScreeningResponse.builder()
                    .success(false)
                    .candidateDecision("ERROR")
                    .overallScore(0.0f)
                    .matchingPoints(java.util.List.of())
                    .notMatchingPoints(java.util.List.of("Error occurred during screening: " + e.getMessage()))
                    .recommendation("Unable to screen CV due to technical error")
                    .jobId(jobId)
                    .message("Screening failed: " + e.getMessage())
                    .build();
        }
    }
    
    @Override
    public Boolean isScreeningServiceHealthy() {
        try {
            ScreeningServiceClient.HealthResponse health = screeningServiceClient.healthCheck();
            boolean isHealthy = "healthy".equals(health.status());
            log.info("Screening service health check: {}", isHealthy ? "HEALTHY" : "UNHEALTHY");
            return isHealthy;
        } catch (Exception e) {
            log.error("Screening service health check failed: {}", e.getMessage());
            return false;
        }
    }
    
    /**
     * Chuẩn bị job data từ PostgreSQL để gửi cho Python service
     */
    private String prepareJobDataJson(JobPost job) throws JsonProcessingException {
        // Extract skills as comma-separated string
        String skillsText = job.getSkills().stream()
                .map(Skill::getName)
                .collect(Collectors.joining(", "));
        
        // Build job data object
        var jobData = java.util.Map.of(
                "job_id", job.getId(),
                "job_title", job.getTitle() != null ? job.getTitle() : "",
                "company_name", job.getCompany() != null ? job.getCompany().getName() : "",
                "description", job.getDescription() != null ? job.getDescription() : "",
                "requirements", job.getRequirements() != null ? job.getRequirements() : "",
                "core_skills", skillsText,
                "experience_required", job.getExperienceRequired() != null ? job.getExperienceRequired() : "",
                "location", job.getLocation() != null ? job.getLocation() : "",
                "benefits", job.getBenefits() != null ? job.getBenefits() : ""
        );
        
        return objectMapper.writeValueAsString(jobData);
    }
} 
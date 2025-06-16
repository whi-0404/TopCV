package com.TopCV.service.impl;

import com.TopCV.entity.JobPost;
import com.TopCV.entity.Skill;
import com.TopCV.enums.JobPostStatus;
import com.TopCV.repository.JobPostRepository;
import com.TopCV.service.JobSyncService;
import com.TopCV.service.PythonServiceClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobSyncServiceImpl implements JobSyncService {
    
    private final JobPostRepository jobPostRepository;
    private final PythonServiceClient pythonServiceClient;

    @Override
    public void syncAllJobsToPython() {
        try {
            log.info("Starting sync all jobs to Python service");
            
            // Clear Python jobs first
            pythonServiceClient.clearPythonJobs();
            
            // Get all active jobs from PostgreSQL
            List<JobPost> activeJobs = jobPostRepository.findAll().stream()
                    .filter(job -> job.getStatus() == JobPostStatus.ACTIVE)
                    .collect(Collectors.toList());
            
            log.info("Found {} active jobs to sync", activeJobs.size());
            
            // Sync each job to Python
            for (JobPost job : activeJobs) {
                try {
                    Map<String, Object> jobData = convertJobToMap(job);
                    log.info("Converting job ID {} to map: {}", job.getId(), jobData);
                    if (jobData != null && !jobData.isEmpty()) {
                        pythonServiceClient.syncJobToPython(jobData);
                    } else {
                        log.error("Converted job data is empty for job ID {}", job.getId());
                    }
                } catch (Exception e) {
                    log.error("Failed to sync job ID {}: {}", job.getId(), e.getMessage(), e);
                }
            }
            
            log.info("Completed syncing {} jobs to Python service", activeJobs.size());
            
        } catch (Exception e) {
            log.error("Error syncing all jobs to Python: {}", e.getMessage(), e);
        }
    }

    @Override
    public void syncJobToPython(Integer jobId) {
        try {
            JobPost job = jobPostRepository.findById(jobId)
                    .orElseThrow(() -> new RuntimeException("Job not found: " + jobId));
            
            if (job.getStatus() == JobPostStatus.ACTIVE) {
                Map<String, Object> jobData = convertJobToMap(job);
                pythonServiceClient.syncJobToPython(jobData);
                log.info("Synced job ID {} to Python successfully", jobId);
            } else {
                log.warn("Job ID {} is not active, skipping sync", jobId);
            }
            
        } catch (Exception e) {
            log.error("Error syncing job ID {} to Python: {}", jobId, e.getMessage(), e);
        }
    }

    @Override
    public List<Object> getAllActiveJobs() {
        return jobPostRepository.findAll().stream()
                .filter(job -> job.getStatus() == JobPostStatus.ACTIVE)
                .map(this::convertJobToMap)
                .collect(Collectors.toList());
    }
    
    /**
     * Convert JobPost entity to Map format cho Python service
     */
    private Map<String, Object> convertJobToMap(JobPost job) {
        Map<String, Object> jobData = new HashMap<>();
        
        try {
            // Basic job info - handle nulls safely
            jobData.put("job_id", String.valueOf(job.getId())); // Convert Integer to String
            jobData.put("job_title", job.getTitle() != null ? job.getTitle() : "");
            jobData.put("company_name", job.getCompany() != null ? job.getCompany().getName() : "");
            jobData.put("location", job.getLocation() != null ? job.getLocation() : "");
            jobData.put("description", job.getDescription() != null ? job.getDescription() : "");
            jobData.put("requirements", job.getRequirements() != null ? job.getRequirements() : "");
            jobData.put("benefits", job.getBenefits() != null ? job.getBenefits() : "");
            
            log.debug("JobPost ID: {} (type: Integer)", job.getId());
            
            // Skills
            String skills = "";
            if (job.getSkills() != null && !job.getSkills().isEmpty()) {
                skills = job.getSkills().stream()
                        .map(Skill::getName)
                        .filter(name -> name != null && !name.trim().isEmpty())
                        .collect(Collectors.joining(", "));
            }
            jobData.put("core_skills", skills);
            
            // Experience
            jobData.put("experience_required", job.getExperienceRequired() != null ? 
                    job.getExperienceRequired() : "");
            
            log.debug("Converted job {} to map with {} fields", job.getId(), jobData.size());
            
        } catch (Exception e) {
            log.error("Error converting job {} to map: {}", job.getId(), e.getMessage(), e);
            return new HashMap<>();  // Return empty map on error
        }
        
        return jobData;
    }
} 
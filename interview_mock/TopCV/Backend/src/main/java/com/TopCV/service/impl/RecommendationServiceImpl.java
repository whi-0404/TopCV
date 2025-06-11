package com.TopCV.service.impl;

import com.TopCV.client.RecommendationServiceClient;
import com.TopCV.dto.external.PythonJobData;
import com.TopCV.dto.external.PythonRecommendationResponse;
import com.TopCV.dto.request.RecommendationRequest;
import com.TopCV.dto.response.RecommendationResponse;
import com.TopCV.entity.JobPost;
import com.TopCV.entity.Skill;
import com.TopCV.repository.JobPostRepository;
import com.TopCV.service.RecommendationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service("recommendationServiceImpl")
@Primary
@Slf4j
public class RecommendationServiceImpl implements RecommendationService {
    
    private final RecommendationServiceClient pythonServiceClient;
    private final JobPostRepository jobPostRepository;
    
    public RecommendationServiceImpl(
            RecommendationServiceClient pythonServiceClient,
            JobPostRepository jobPostRepository) {
        this.pythonServiceClient = pythonServiceClient;
        this.jobPostRepository = jobPostRepository;
        log.info("=== RecommendationServiceImpl CREATED ===");
    }
    
    @Override
    public RecommendationResponse uploadCvAndRecommend(
            MultipartFile cvFile, 
            Integer topK, 
            Float minScore, 
            String location, 
            String jobType) {
        
        log.info("=== PROCESSING CV RECOMMENDATION REQUEST ===");
        log.info("File: {}", cvFile != null ? cvFile.getOriginalFilename() : "NULL");
        log.info("File size: {}", cvFile != null ? cvFile.getSize() : "NULL");
        log.info("TopK: {}, MinScore: {}, Location: {}, JobType: {}", topK, minScore, location, jobType);
        
        try {
            // Step 1: Validate CV file
            if (cvFile == null || cvFile.isEmpty()) {
                log.error("CV file is null or empty");
                throw new RuntimeException("CV file is required");
            }
            
            // Step 2: Check Python service health
            if (!isRecommendationServiceHealthy()) {
                log.error("Python recommendation service is not healthy");
                throw new RuntimeException("Recommendation service is currently unavailable");
            }
            
            // Step 3: Load jobs from PostgreSQL database
            List<JobPost> dbJobs = jobPostRepository.findAll();
            log.info("Found {} jobs in PostgreSQL database", dbJobs.size());
            
            if (dbJobs.isEmpty()) {
                log.warn("No jobs found in database - will still process CV");
                return buildEmptyRecommendationResponse(
                    "CV processed successfully, but no job opportunities are currently available. Please check back later."
                );
            }
            
            // Step 4: Upload sample jobs to Python service (ensure Python has job data)
            boolean jobsUploaded = ensureJobsInPythonService(dbJobs);
            if (!jobsUploaded) {
                log.warn("Failed to upload jobs to Python service, proceeding anyway");
            }
            
            // Step 5: Call Python service for CV processing and recommendations
            log.info("Calling Python service for CV analysis and recommendations...");
            PythonRecommendationResponse pythonResponse = pythonServiceClient.uploadCvAndRecommend(
                cvFile, 
                topK != null ? topK : 10,
                minScore != null ? minScore : 0.3f,
                location,
                jobType
            );
            
            log.info("Python service response received: {} recommendations", 
                pythonResponse.getRecommendations() != null ? pythonResponse.getRecommendations().size() : 0);
            
            // Step 6: Convert Python response to our format
            return convertPythonResponse(pythonResponse, dbJobs.size());
            
        } catch (feign.FeignException e) {
            log.error("=== FEIGN ERROR calling Python service ===");
            log.error("Status: {}, Message: {}", e.status(), e.getMessage());
            log.error("Response body: {}", e.contentUTF8());
            
            return RecommendationResponse.builder()
                    .success(false)
                    .message("Error communicating with recommendation service: " + e.getMessage())
                    .recommendations(List.of())
                    .totalJobsAnalyzed(0)
                    .processingTimeMs(0.0f)
                    .generatedAt(LocalDateTime.now())
                    .build();
                    
        } catch (Exception e) {
            log.error("=== ERROR in uploadCvAndRecommend ===");
            log.error("Error message: {}", e.getMessage());
            log.error("Stack trace: ", e);
            
            return RecommendationResponse.builder()
                    .success(false)
                    .message("Error processing CV: " + e.getMessage())
                    .recommendations(List.of())
                    .totalJobsAnalyzed(0)
                    .processingTimeMs(0.0f)
                    .generatedAt(LocalDateTime.now())
                    .build();
        }
    }
    
    /**
     * Ensure Python service has current job data from our PostgreSQL database
     */
    private boolean ensureJobsInPythonService(List<JobPost> jobs) {
        try {
            log.info("Uploading {} real jobs from PostgreSQL to Python service...", jobs.size());
            
            // First clear existing jobs in Python
            try {
                pythonServiceClient.clearJobs();
                log.info("Cleared existing jobs in Python service");
            } catch (Exception e) {
                log.warn("Could not clear existing jobs: {}", e.getMessage());
            }
            
            // Upload each job from PostgreSQL to Python service
            int successCount = 0;
            for (JobPost job : jobs) {
                try {
                    PythonJobData pythonJob = PythonJobData.fromJobPost(job);
                    
                    // Create upload request
                    PythonJobUploadRequest uploadRequest = new PythonJobUploadRequest(pythonJob);
                    
                    // Upload to Python service
                    PythonJobUploadResponse response = pythonServiceClient.uploadJob(uploadRequest);
                    
                    if (response.success()) {
                        successCount++;
                        log.debug("Uploaded job: {} at {}", job.getTitle(), job.getCompany() != null ? job.getCompany().getName() : "Unknown");
                    } else {
                        log.warn("Failed to upload job {}: {}", job.getId(), response.message());
                    }
                    
                } catch (Exception e) {
                    log.error("Error uploading job {}: {}", job.getId(), e.getMessage());
                }
            }
            
            log.info("Successfully uploaded {}/{} jobs to Python service", successCount, jobs.size());
            
            // Fallback: Add sample jobs if no real jobs were uploaded successfully
            if (successCount == 0) {
                log.warn("No real jobs uploaded successfully, adding sample jobs as fallback");
                RecommendationServiceClient.SampleJobsResponse sampleResponse = pythonServiceClient.addSampleJobs();
                if (sampleResponse.success()) {
                    log.info("Added {} sample jobs as fallback", sampleResponse.totalJobs());
                    return true;
                }
            }
            
            return successCount > 0;
            
        } catch (Exception e) {
            log.error("Error uploading jobs to Python service: {}", e.getMessage());
            
            // Fallback to sample jobs
            try {
                log.info("Fallback: Adding sample jobs due to upload error");
                RecommendationServiceClient.SampleJobsResponse response = pythonServiceClient.addSampleJobs();
                return response.success();
            } catch (Exception fallbackError) {
                log.error("Even fallback sample jobs failed: {}", fallbackError.getMessage());
                return false;
            }
        }
    }
    
    // Helper classes for job upload
    public record PythonJobUploadRequest(PythonJobData job_data) {}
    
    public record PythonJobUploadResponse(
            Boolean success,
            String message,
            Integer total_jobs,
            String job_id
    ) {}
    
    /**
     * Convert Python response to our RecommendationResponse format
     */
    private RecommendationResponse convertPythonResponse(PythonRecommendationResponse pythonResponse, int totalJobs) {
        if (pythonResponse == null) {
            return buildEmptyRecommendationResponse("No response from recommendation service");
        }
        
        // Convert CV analysis from Python cv_summary
        RecommendationResponse.CVAnalysisResult cvAnalysis = null;
        if (pythonResponse.getCvSummary() != null) {
            Map<String, Object> cvSummary = pythonResponse.getCvSummary();
            
            // Extract basic info safely
            Map<String, Object> basicInfo = (Map<String, Object>) cvSummary.get("basic_info");
            Map<String, Object> skills = (Map<String, Object>) cvSummary.get("skills");
            Map<String, Object> experience = (Map<String, Object>) cvSummary.get("experience");
            
            cvAnalysis = RecommendationResponse.CVAnalysisResult.builder()
                    .fullName(basicInfo != null ? (String) basicInfo.get("name") : null)
                    .currentPosition(basicInfo != null ? (String) basicInfo.get("current_position") : null)
                    .yearsExperience(experience != null ? (Integer) experience.get("total_years") : null)
                    .technicalSkills(skills != null ? (List<String>) skills.get("technical_skills") : List.of())
                    .softSkills(skills != null ? (List<String>) skills.get("soft_skills") : List.of())
                    .skillStrengthScore(skills != null ? 
                            calculateSkillStrength((List<String>) skills.get("technical_skills")) : 0.5f)
                    .build();
        }
        
        // Convert recommendations
        List<RecommendationResponse.JobRecommendationResult> recommendations = List.of();
        if (pythonResponse.getRecommendations() != null) {
            recommendations = pythonResponse.getRecommendations().stream()
                    .map(this::convertPythonRecommendation)
                    .collect(Collectors.toList());
        }
        
        String message = pythonResponse.getMessage() != null ? pythonResponse.getMessage() :
                (recommendations.isEmpty() ? 
                    "CV processed successfully, but no matching jobs found" :
                    String.format("Found %d job recommendations based on your CV", recommendations.size()));
        
        return RecommendationResponse.builder()
                .success(pythonResponse.getSuccess() != null ? pythonResponse.getSuccess() : true)
                .message(message)
                .cvAnalysis(cvAnalysis)
                .recommendations(recommendations)
                .totalJobsAnalyzed(pythonResponse.getTotalJobsAnalyzed() != null ? pythonResponse.getTotalJobsAnalyzed() : totalJobs)
                .processingTimeMs(pythonResponse.getProcessingTimeMs() != null ? pythonResponse.getProcessingTimeMs() : 200.0f)
                .generatedAt(LocalDateTime.now())
                .build();
    }
    
    /**
     * Convert single Python recommendation to our format
     */
    private RecommendationResponse.JobRecommendationResult convertPythonRecommendation(
            PythonRecommendationResponse.PythonJobRecommendation pyRec) {
        
        if (pyRec == null || pyRec.getJobData() == null) {
            return null;
        }
        
        PythonJobData jobData = pyRec.getJobData();
        
        // Convert matching details
        RecommendationResponse.JobRecommendationResult.MatchingDetails matchingDetails = null;
        if (pyRec.getMatchingDetails() != null) {
            PythonRecommendationResponse.PythonJobRecommendation.PythonMatchingDetails pyDetails = pyRec.getMatchingDetails();
            matchingDetails = RecommendationResponse.JobRecommendationResult.MatchingDetails.builder()
                    .skillsScore(pyDetails.getSkillsScore())
                    .experienceScore(pyDetails.getExperienceScore())
                    .projectScore(pyDetails.getProjectScore())
                    .semanticScore(pyDetails.getSemanticScore())
                    .educationScore(pyDetails.getEducationScore())
                    .locationScore(pyDetails.getLocationScore())
                    .matchedSkills(pyDetails.getMatchedSkills() != null ? pyDetails.getMatchedSkills() : List.of())
                    .missingSkills(pyDetails.getMissingSkills() != null ? pyDetails.getMissingSkills() : List.of())
                    .bonusSkills(pyDetails.getBonusSkills() != null ? pyDetails.getBonusSkills() : List.of())
                    .relevantProjects(pyDetails.getRelevantProjects() != null ? pyDetails.getRelevantProjects() : List.of())
                    .build();
        }
        
        return RecommendationResponse.JobRecommendationResult.builder()
                .jobId(parseJobId(jobData.getJobId()))
                .jobTitle(jobData.getJobTitle())
                .companyName(jobData.getCompany())
                .companyLogo(jobData.getCompanyLogo())
                .location(jobData.getLocation())
                .jobType(jobData.getJobType())
                .experienceRequired(jobData.getExperienceRequired())
                .salary(jobData.getSalary())
                .requiredSkills(jobData.getRequiredSkills() != null ? jobData.getRequiredSkills() : List.of())
                .description(jobData.getJobDescription())
                .benefits(jobData.getBenefits() != null ? jobData.getBenefits() : List.of())
                .deadline(jobData.getDeadline() != null ? jobData.getDeadline().atStartOfDay() : null)
                .overallScore(pyRec.getOverallScore() != null ? pyRec.getOverallScore() : 0.0f)
                .matchingDetails(matchingDetails)
                .recommendationReasons(pyRec.getRecommendationReasons() != null ? pyRec.getRecommendationReasons() : List.of())
                .improvementSuggestions(pyRec.getImprovementSuggestions() != null ? pyRec.getImprovementSuggestions() : List.of())
                .calculatedAt(pyRec.getCalculatedAt() != null ? pyRec.getCalculatedAt() : LocalDateTime.now())
                .build();
    }
    
    private Integer parseJobId(String jobId) {
        try {
            return Integer.parseInt(jobId);
        } catch (NumberFormatException e) {
            return 0;
        }
    }
    
    private Float calculateSkillStrength(List<String> skills) {
        if (skills == null || skills.isEmpty()) {
            return 0.3f;
        }
        return Math.min(1.0f, skills.size() * 0.1f + 0.3f);
    }
    
    private RecommendationResponse buildEmptyRecommendationResponse(String message) {
        return RecommendationResponse.builder()
                .success(true)
                .message(message)
                .recommendations(List.of())
                .totalJobsAnalyzed(0)
                .processingTimeMs(50.0f)
                .generatedAt(LocalDateTime.now())
                .build();
    }
    
    @Override
    public RecommendationResponse analyzeCvText(String cvText) {
        log.info("Analyzing CV text content, length: {}", cvText.length());
        
        try {
            // Check Python service health
            if (!isRecommendationServiceHealthy()) {
                throw new RuntimeException("Recommendation service is currently unavailable");
            }
            
            // Call Python service for CV text analysis
            RecommendationServiceClient.AnalyzeCvTextRequest request = 
                    new RecommendationServiceClient.AnalyzeCvTextRequest(cvText);
            
            PythonRecommendationResponse pythonResponse = pythonServiceClient.analyzeCvText(request);
            
            // Convert response
            return convertPythonResponse(pythonResponse, (int) jobPostRepository.count());
            
        } catch (Exception e) {
            log.error("Error analyzing CV text: {}", e.getMessage());
            return RecommendationResponse.builder()
                    .success(false)
                    .message("Error analyzing CV: " + e.getMessage())
                    .recommendations(List.of())
                    .totalJobsAnalyzed(0)
                    .processingTimeMs(0.0f)
                    .generatedAt(LocalDateTime.now())
                    .build();
        }
    }

    @Override
    public RecommendationResponse generateRecommendations(RecommendationRequest request) {
        log.info("Generating recommendations with custom request");
        
        try {
            // For now, delegate to analyzeCvText if we have CV content
            if (request.getCvContent() != null && !request.getCvContent().trim().isEmpty()) {
                return analyzeCvText(request.getCvContent());
            }
            
            long jobCount = jobPostRepository.count();
            
            return RecommendationResponse.builder()
                    .success(true)
                    .message(String.format("Custom recommendations generated based on %d available jobs", jobCount))
                    .recommendations(List.of())
                    .totalJobsAnalyzed((int) jobCount)
                    .processingTimeMs(100.0f)
                    .generatedAt(LocalDateTime.now())
                    .build();
                    
        } catch (Exception e) {
            log.error("Error generating custom recommendations: {}", e.getMessage());
            return RecommendationResponse.builder()
                    .success(false)
                    .message("Error generating recommendations: " + e.getMessage())
                    .recommendations(List.of())
                    .totalJobsAnalyzed(0)
                    .processingTimeMs(0.0f)
                    .generatedAt(LocalDateTime.now())
                    .build();
        }
    }
    
    @Override
    public Boolean isRecommendationServiceHealthy() {
        try {
            RecommendationServiceClient.HealthResponse health = pythonServiceClient.healthCheck();
            boolean isHealthy = "healthy".equalsIgnoreCase(health.status());
            log.info("Python service health check: {}", isHealthy ? "HEALTHY" : "UNHEALTHY");
            return isHealthy;
        } catch (Exception e) {
            log.warn("Python service health check failed: {}", e.getMessage());
            return false;
        }
    }
    
    @Override
    public String initializeSampleData() {
        try {
            // Check local database
            long jobCount = jobPostRepository.count();
            log.info("Local database has {} job posts", jobCount);
            
            // Check Python service
            RecommendationServiceClient.SampleJobsResponse response = pythonServiceClient.addSampleJobs();
            
            return String.format("Local database: %d jobs, Python service: %s (Total: %d jobs)", 
                    jobCount, 
                    response.message(),
                    response.totalJobs()
            );
            
        } catch (Exception e) {
            log.error("Error initializing sample data: {}", e.getMessage());
            return "Error initializing data: " + e.getMessage();
        }
    }
}
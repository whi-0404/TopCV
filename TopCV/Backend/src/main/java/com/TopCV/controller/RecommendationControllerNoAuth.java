package com.TopCV.controller;

import com.TopCV.dto.request.RecommendationRequest;
import com.TopCV.dto.request.SkillRequest;
import com.TopCV.dto.request.JobTypeRequest;
import com.TopCV.dto.request.JobLevelRequest;
import com.TopCV.dto.response.ApiResponse;
import com.TopCV.dto.response.RecommendationResponse;
import com.TopCV.service.RecommendationService;
import com.TopCV.service.SkillService;
import com.TopCV.service.JobTypeService;
import com.TopCV.service.JobLevelService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/test")
@Slf4j
public class RecommendationControllerNoAuth {
    
    private final RecommendationService recommendationService;
    private final SkillService skillService;
    private final JobTypeService jobTypeService;
    private final JobLevelService jobLevelService;
    
    public RecommendationControllerNoAuth(
            @Qualifier("recommendationServiceImpl") RecommendationService recommendationService,
            SkillService skillService,
            JobTypeService jobTypeService,
            JobLevelService jobLevelService) {
        this.recommendationService = recommendationService;
        this.skillService = skillService;
        this.jobTypeService = jobTypeService;
        this.jobLevelService = jobLevelService;
        log.info("=== RecommendationControllerNoAuth CREATED ===");
    }
    
    // HEALTH CHECK
    @GetMapping("/health")
    public String healthCheck() {
        log.info("=== TEST HEALTH CHECK ===");
        return "Test API is working!";
    }
    
    // TEST DATA CREATION (NO AUTH REQUIRED)
    @PostMapping("/skills")
    public ApiResponse<Object> createTestSkill(@RequestBody @Valid SkillRequest request) {
        log.info("TEST: Creating skill: {}", request.getName());
        try {
            var result = skillService.createSkill(request);
            return ApiResponse.builder()
                    .code(1000)
                    .message("Skill created successfully")
                    .result(result)
                    .build();
        } catch (Exception e) {
            log.error("Error creating skill: {}", e.getMessage());
            return ApiResponse.builder()
                    .code(1001)
                    .message("Error: " + e.getMessage())
                    .build();
        }
    }
    
    @PostMapping("/job-types")
    public ApiResponse<Object> createTestJobType(@RequestBody @Valid JobTypeRequest request) {
        log.info("TEST: Creating job type: {}", request.getName());
        try {
            var result = jobTypeService.createJobType(request);
            return ApiResponse.builder()
                    .code(1000)
                    .message("Job Type created successfully")
                    .result(result)
                    .build();
        } catch (Exception e) {
            log.error("Error creating job type: {}", e.getMessage());
            return ApiResponse.builder()
                    .code(1001)
                    .message("Error: " + e.getMessage())
                    .build();
        }
    }
    
    @PostMapping("/job-levels")
    public ApiResponse<Object> createTestJobLevel(@RequestBody @Valid JobLevelRequest request) {
        log.info("TEST: Creating job level: {}", request.getName());
        try {
            var result = jobLevelService.createJobLevel(request);
            return ApiResponse.builder()
                    .code(1000)
                    .message("Job Level created successfully")
                    .result(result)
                    .build();
        } catch (Exception e) {
            log.error("Error creating job level: {}", e.getMessage());
            return ApiResponse.builder()
                    .code(1001)
                    .message("Error: " + e.getMessage())
                    .build();
        }
    }
    
    // GET DATA
    @GetMapping("/skills")
    public ApiResponse<Object> getAllTestSkills() {
        try {
            var result = skillService.getAllSkills();
            return ApiResponse.builder()
                    .code(1000)
                    .message("Skills retrieved successfully")
                    .result(result)
                    .build();
        } catch (Exception e) {
            return ApiResponse.builder()
                    .code(1001)
                    .message("Error: " + e.getMessage())
                    .build();
        }
    }
    
    @GetMapping("/job-types")
    public ApiResponse<Object> getAllTestJobTypes() {
        try {
            var result = jobTypeService.getAllJobTypes();
            return ApiResponse.builder()
                    .code(1000)
                    .message("Job Types retrieved successfully")
                    .result(result)
                    .build();
        } catch (Exception e) {
            return ApiResponse.builder()
                    .code(1001)
                    .message("Error: " + e.getMessage())
                    .build();
        }
    }
    
    @GetMapping("/job-levels")
    public ApiResponse<Object> getAllTestJobLevels() {
        try {
            var result = jobLevelService.getAllJobLevels();
            return ApiResponse.builder()
                    .code(1000)
                    .message("Job Levels retrieved successfully")
                    .result(result)
                    .build();
        } catch (Exception e) {
            return ApiResponse.builder()
                    .code(1001)
                    .message("Error: " + e.getMessage())
                    .build();
        }
    }

    // RECOMMENDATION ENDPOINTS
    @PostMapping(value = "/recommendation/upload-cv", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<RecommendationResponse> uploadCvAndRecommend(
            @RequestParam("cv_file") MultipartFile cvFile,
            @RequestParam(value = "top_k", defaultValue = "10") Integer topK,
            @RequestParam(value = "min_score", defaultValue = "0.3") Float minScore,
            @RequestParam(value = "location", required = false) String location,
            @RequestParam(value = "job_type", required = false) String jobType
    ) {
        log.info("TEST CV upload: file={}, topK={}, minScore={}", 
                cvFile.getOriginalFilename(), topK, minScore);
        
        RecommendationResponse response = recommendationService.uploadCvAndRecommend(
                cvFile, topK, minScore, location, jobType
        );
        
        return ApiResponse.<RecommendationResponse>builder()
                .code(1000)
                .message("CV processed successfully")
                .result(response)
                .build();
    }
    
    @PostMapping("/recommendation/analyze-cv-text")
    public ApiResponse<RecommendationResponse> analyzeCvText(
            @RequestBody @Valid AnalyzeCvTextRequest request
    ) {
        log.info("TEST CV text analysis, length: {}", request.cvText().length());
        
        RecommendationResponse response = recommendationService.analyzeCvText(request.cvText());
        
        return ApiResponse.<RecommendationResponse>builder()
                .code(1000)
                .message("CV text analyzed successfully")
                .result(response)
                .build();
    }
    
    @GetMapping("/recommendation/health")
    public ApiResponse<HealthCheckResponse> recommendationHealthCheck() {
        Boolean isHealthy = recommendationService.isRecommendationServiceHealthy();
        
        HealthCheckResponse healthResponse = new HealthCheckResponse(
                isHealthy ? "healthy" : "unhealthy",
                isHealthy ? "Recommendation service is working" : "Recommendation service not responding",
                System.currentTimeMillis()
        );
        
        return ApiResponse.<HealthCheckResponse>builder()
                .code(isHealthy ? 1000 : 1001)
                .message(healthResponse.message())
                .result(healthResponse)
                .build();
    }
    
    // NEW: Test CV Screening for HR
    @PostMapping(value = "/screening/cv-analysis", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<Object> testCvScreening(
            @RequestParam("cv_file") MultipartFile cvFile,
            @RequestParam("job_id") Integer jobId
    ) {
        log.info("TEST CV screening: file={}, jobId={}", 
                cvFile.getOriginalFilename(), jobId);
        
        try {
            // For testing, we'll simulate calling the screening service
            // In production, this would go through proper authentication
            return ApiResponse.builder()
                    .code(1000)
                    .message("CV screening test endpoint - use /api/v1/screening/cv-analysis for production")
                    .result(java.util.Map.of(
                            "file_name", cvFile.getOriginalFilename(),
                            "file_size", cvFile.getSize(),
                            "job_id", jobId,
                            "status", "test_mode",
                            "note", "This is a test endpoint. Real screening requires authentication."
                    ))
                    .build();
        } catch (Exception e) {
            log.error("Error in test CV screening: {}", e.getMessage());
            return ApiResponse.builder()
                    .code(1001)
                    .message("Error: " + e.getMessage())
                    .build();
        }
    }

    // DTOs
    public record AnalyzeCvTextRequest(String cvText) {}
    
    public record HealthCheckResponse(
            String status,
            String message,
            Long timestamp
    ) {}
} 
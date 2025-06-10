package com.TopCV.client;

import com.TopCV.dto.external.PythonRecommendationRequest;
import com.TopCV.dto.external.PythonRecommendationResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@FeignClient(
    name = "recommendation-service",
    url = "${app.python-service.url:http://localhost:8000}",
    configuration = RecommendationServiceClient.Configuration.class
)
public interface RecommendationServiceClient {
    
    /**
     * Upload CV file và nhận recommendations
     */
    @PostMapping(value = "/cv/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    PythonRecommendationResponse uploadCvAndRecommend(
            @RequestPart("file") MultipartFile file,
            @RequestParam(value = "top_k", defaultValue = "10") Integer topK,
            @RequestParam(value = "min_score", defaultValue = "0.3") Float minScore,
            @RequestParam(value = "location", required = false) String location,
            @RequestParam(value = "job_type", required = false) String jobType
    );
    
    /**
     * Phân tích CV từ text
     */
    @PostMapping(value = "/cv/analyze-text", consumes = MediaType.APPLICATION_JSON_VALUE)
    PythonRecommendationResponse analyzeCvText(@RequestBody AnalyzeCvTextRequest request);
    
    /**
     * Generate recommendations với CV và job data có sẵn
     */
    @PostMapping(value = "/recommend", consumes = MediaType.APPLICATION_JSON_VALUE)
    PythonRecommendationResponse recommend(@RequestBody PythonRecommendationRequest request);
    
    /**
     * Health check Python service
     */
    @GetMapping("/health")
    HealthResponse healthCheck();
    
    /**
     * Thêm sample jobs (for testing)
     */
    @PostMapping("/test/add-sample-jobs")
    SampleJobsResponse addSampleJobs();
    
    /**
     * Clear all jobs in Python service
     */
    @DeleteMapping("/jobs/clear")
    ClearJobsResponse clearJobs();
    
    /**
     * Upload single job to Python service
     */
    @PostMapping(value = "/jobs/upload", consumes = MediaType.APPLICATION_JSON_VALUE)
    com.TopCV.service.impl.RecommendationServiceImpl.PythonJobUploadResponse uploadJob(
            @RequestBody com.TopCV.service.impl.RecommendationServiceImpl.PythonJobUploadRequest request
    );
    
    // Request/Response DTOs cho specific endpoints
    record AnalyzeCvTextRequest(String cvText) {}
    
    record HealthResponse(
            String status,
            String message,
            String version,
            java.util.Map<String, Boolean> services
    ) {}
    
    record SampleJobsResponse(
            Boolean success,
            String message,
            Integer totalJobs,
            java.util.List<String> addedJobs
    ) {}
    
    record ClearJobsResponse(
            Boolean success,
            String message
    ) {}
    
    @org.springframework.context.annotation.Configuration
    class Configuration {
        
        @org.springframework.context.annotation.Bean
        public feign.Logger.Level feignLoggerLevel() {
            return feign.Logger.Level.BASIC;
        }
        
        @org.springframework.context.annotation.Bean
        public feign.codec.ErrorDecoder errorDecoder() {
            return new RecommendationServiceErrorDecoder();
        }
        
        @org.springframework.context.annotation.Bean
        public feign.RequestInterceptor requestInterceptor() {
            return requestTemplate -> {
                requestTemplate.header("User-Agent", "TopCV-Backend/1.0");
                requestTemplate.header("Accept", "application/json");
            };
        }
    }
} 
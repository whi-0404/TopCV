package com.TopCV.client;

import com.TopCV.dto.external.ScreeningResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@FeignClient(
    name = "screening-service",
    url = "${app.screening-service.url:http://localhost:8000}",
    configuration = ScreeningServiceClient.Configuration.class
)
public interface ScreeningServiceClient {
    
    /**
     * Screening CV cho nhà tuyển dụng với job cụ thể
     */
    @PostMapping(value = "/screening/apply-job", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ScreeningResponse screenCvForJob(
            @RequestPart("cv_file") MultipartFile cvFile,
            @RequestParam("job_id") Integer jobId
    );
    
    /**
     * Sync job data from backend to Python service
     */
    @PostMapping(value = "/jobs/sync-from-backend", consumes = MediaType.APPLICATION_JSON_VALUE)
    void syncJobFromBackend(@RequestBody String jobData);
    
    /**
     * Health check screening service
     */
    @GetMapping("/health")
    HealthResponse healthCheck();
    
    // Response DTOs
    record HealthResponse(
            String status,
            String message,
            String version,
            java.util.Map<String, Boolean> services
    ) {}
    
    @org.springframework.context.annotation.Configuration
    class Configuration {
        
        @org.springframework.context.annotation.Bean("screeningFeignLoggerLevel")
        public feign.Logger.Level feignLoggerLevel() {
            return feign.Logger.Level.BASIC;
        }
        
        @org.springframework.context.annotation.Bean("screeningErrorDecoder")
        public feign.codec.ErrorDecoder errorDecoder() {
            return new ScreeningServiceErrorDecoder();
        }
        
        @org.springframework.context.annotation.Bean("screeningRequestInterceptor")
        public feign.RequestInterceptor requestInterceptor() {
            return requestTemplate -> {
                requestTemplate.header("User-Agent", "TopCV-Backend/1.0");
                requestTemplate.header("Accept", "application/json");
            };
        }
    }
} 
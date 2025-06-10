package com.TopCV.controller;

import com.TopCV.dto.external.ScreeningResponse;
import com.TopCV.dto.response.ApiResponse;
import com.TopCV.service.ScreeningService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/screening")
@Slf4j
public class ScreeningController {
    
    private final ScreeningService screeningService;
    
    public ScreeningController(ScreeningService screeningService) {
        this.screeningService = screeningService;
        log.info("=== ScreeningController CREATED ===");
    }
    
    /**
     * API cho HR chấm điểm CV ứng viên với job cụ thể
     * Workflow: HR upload CV + chọn job ID → System scoring → PASS/FAIL/REVIEW
     */
    @PostMapping(value = "/cv-analysis", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    // @PreAuthorize("hasRole('EMPLOYER') or hasRole('ADMIN')") // Disabled for testing
    public ApiResponse<ScreeningResponse> screenCvForJob(
            @RequestParam("cv_file") MultipartFile cvFile,
            @RequestParam("job_id") Integer jobId
    ) {
        log.info("=== CV SCREENING REQUEST ===");
        log.info("CV file: {}, Job ID: {}", cvFile.getOriginalFilename(), jobId);
        
        try {
            ScreeningResponse response = screeningService.screenCvForJob(cvFile, jobId);
            
            if (response.getSuccess()) {
                return ApiResponse.<ScreeningResponse>builder()
                        .code(1000)
                        .message("CV screening completed successfully")
                        .result(response)
                        .build();
            } else {
                return ApiResponse.<ScreeningResponse>builder()
                        .code(1001)
                        .message("CV screening failed: " + response.getMessage())
                        .result(response)
                        .build();
            }
            
        } catch (Exception e) {
            log.error("Error in CV screening: {}", e.getMessage());
            
            ScreeningResponse errorResponse = ScreeningResponse.builder()
                    .success(false)
                    .candidateDecision("ERROR")
                    .overallScore(0.0f)
                    .jobId(jobId)
                    .message("Technical error: " + e.getMessage())
                    .build();
            
            return ApiResponse.<ScreeningResponse>builder()
                    .code(1001)
                    .message("CV screening failed due to technical error")
                    .result(errorResponse)
                    .build();
        }
    }
    
    /**
     * Health check screening service
     */
    @GetMapping("/health")
    public ApiResponse<HealthCheckResponse> screeningHealthCheck() {
        Boolean isHealthy = screeningService.isScreeningServiceHealthy();
        
        HealthCheckResponse healthResponse = new HealthCheckResponse(
                isHealthy ? "healthy" : "unhealthy",
                isHealthy ? "Screening service is working properly" : "Screening service not responding",
                System.currentTimeMillis()
        );
        
        return ApiResponse.<HealthCheckResponse>builder()
                .code(isHealthy ? 1000 : 1001)
                .message(healthResponse.message())
                .result(healthResponse)
                .build();
    }
    
    // DTOs
    public record HealthCheckResponse(
            String status,
            String message,
            Long timestamp
    ) {}
} 
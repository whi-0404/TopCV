package com.TopCV.config;

import com.TopCV.client.RecommendationServiceClient;
import com.TopCV.dto.external.PythonRecommendationResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Configuration
@Slf4j
public class MockRecommendationConfig {
    
    /**
     * Mock bean for RecommendationServiceClient - used when Feign is disabled
     * or Python service is not available
     */
    @Bean
    @ConditionalOnMissingBean(RecommendationServiceClient.class)
    public RecommendationServiceClient mockRecommendationServiceClient() {
        log.warn("=== USING MOCK RecommendationServiceClient ===");
        log.warn("This is for development/testing only. Enable Feign for production.");
        
        return new RecommendationServiceClient() {
            @Override
            public PythonRecommendationResponse uploadCvAndRecommend(
                    MultipartFile file, Integer topK, Float minScore, String location, String jobType) {
                log.info("MOCK: uploadCvAndRecommend called");
                return createMockResponse();
            }
            
            @Override
            public PythonRecommendationResponse analyzeCvText(AnalyzeCvTextRequest request) {
                log.info("MOCK: analyzeCvText called");
                return createMockResponse();
            }
            
            @Override
            public PythonRecommendationResponse recommend(com.TopCV.dto.external.PythonRecommendationRequest request) {
                log.info("MOCK: recommend called");
                return createMockResponse();
            }
            
            @Override
            public HealthResponse healthCheck() {
                log.info("MOCK: healthCheck called");
                return new HealthResponse("UP", "Mock service", "1.0.0", Map.of("database", true));
            }
            
            @Override
            public SampleJobsResponse addSampleJobs() {
                log.info("MOCK: addSampleJobs called");
                return new SampleJobsResponse(true, "Mock sample jobs added", 10, List.of("Job1", "Job2"));
            }
            
            @Override
            public ClearJobsResponse clearJobs() {
                log.info("MOCK: clearJobs called");
                return new ClearJobsResponse(true, "Mock jobs cleared");
            }
            
            @Override
            public com.TopCV.service.impl.RecommendationServiceImpl.PythonJobUploadResponse uploadJob(
                    com.TopCV.service.impl.RecommendationServiceImpl.PythonJobUploadRequest request) {
                log.info("MOCK: uploadJob called for job: {}", 
                        request.job_data() != null ? request.job_data().getJobTitle() : "Unknown");
                return new com.TopCV.service.impl.RecommendationServiceImpl.PythonJobUploadResponse(
                        true, "Mock job uploaded successfully", 1, "mock_job_001"
                );
            }
            
            private PythonRecommendationResponse createMockResponse() {
                return PythonRecommendationResponse.builder()
                        .success(true)
                        .message("Mock recommendation response")
                        .recommendations(List.of())
                        .totalJobsAnalyzed(0)
                        .processingTimeMs(50.0f)
                        .build();
            }
        };
    }
} 
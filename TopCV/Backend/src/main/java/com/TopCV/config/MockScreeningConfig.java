package com.TopCV.config;

import com.TopCV.client.ScreeningServiceClient;
import com.TopCV.dto.external.ScreeningResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Configuration
@Slf4j
public class MockScreeningConfig {
    
    /**
     * Mock ScreeningServiceClient when Python service is not available
     * Activated when property app.screening.mock=true
     */
    @Bean
    @ConditionalOnProperty(name = "app.screening.mock", havingValue = "true", matchIfMissing = false)
    public ScreeningServiceClient mockScreeningServiceClient() {
        log.warn("=== USING MOCK SCREENING SERVICE CLIENT ===");
        
        return new ScreeningServiceClient() {
            
            @Override
            public ScreeningResponse screenCvForJob(MultipartFile cvFile, Integer jobId) {
                log.warn("Mock screening - CV: {}, Job ID: {}", 
                        cvFile.getOriginalFilename(), jobId);
                
                // Simulate processing delay
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
                
                // Generate mock response based on CV filename
                String fileName = cvFile.getOriginalFilename();
                float mockScore = generateMockScore(fileName);
                String decision = mockScore >= 3.5f ? "PASS" : mockScore >= 2.5f ? "REVIEW" : "FAIL";
                
                return ScreeningResponse.builder()
                        .success(true)
                        .candidateDecision(decision)
                        .overallScore(mockScore)
                        .matchingPoints(List.of(
                                "CV structure is well-organized",
                                "Relevant work experience found",
                                "Educational background matches"
                        ))
                        .notMatchingPoints(List.of(
                                "Missing some required technical skills",
                                "Experience level may be below requirements"
                        ))
                        .recommendation("This is a mock screening result. " + 
                                       "Score: " + mockScore + ", Decision: " + decision)
                        .jobId(jobId)
                        .jobTitle("Mock Job Title")
                        .companyName("Mock Company")
                        .message("Mock screening completed successfully")
                        .build();
            }
            
            @Override
            public void syncJobFromBackend(String jobData) {
                log.info("Mock sync job from backend - Job data length: {}", jobData.length());
                // Mock implementation - just log
            }
            
            @Override
            public HealthResponse healthCheck() {
                return new HealthResponse(
                        "healthy",
                        "Mock screening service is running",
                        "1.0.0-mock",
                        Map.of(
                                "gemini_ai", false,
                                "pdf_processing", true,
                                "cv_screening", true
                        )
                );
            }
            
            private float generateMockScore(String fileName) {
                if (fileName == null) return 2.0f;
                
                // Simple hash-based mock scoring
                int hash = Math.abs(fileName.hashCode());
                return 1.0f + (hash % 40) / 10.0f; // Range: 1.0 - 4.9
            }
            

        };
    }
} 
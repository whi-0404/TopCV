package com.TopCV.service;

import com.TopCV.dto.request.RecommendationRequest;
import com.TopCV.dto.response.RecommendationResponse;
import org.springframework.web.multipart.MultipartFile;

public interface RecommendationService {
    
    /**
     * Upload CV file và generate job recommendations
     */
    RecommendationResponse uploadCvAndRecommend(
            MultipartFile cvFile,
            Integer topK,
            Float minScore,
            String location,
            String jobType
    );
    
    /**
     * Phân tích CV từ text content
     */
    RecommendationResponse analyzeCvText(String cvText);
    
    /**
     * Generate recommendations dựa trên CV data có sẵn
     */
    RecommendationResponse generateRecommendations(RecommendationRequest request);
    
    /**
     * Health check cho Python recommendation service
     */
    Boolean isRecommendationServiceHealthy();
    
    /**
     * Initialize sample data for testing
     */
    String initializeSampleData();
} 
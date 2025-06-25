package com.TopCV.service;

import com.TopCV.dto.response.CVScreeningResponse;
import com.TopCV.dto.response.JobRecommendationResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

public interface PythonServiceClient {
    
    /**
     * Gọi Python API để phân tích CV và lấy job recommendations
     */
    JobRecommendationResponse analyzeCV(MultipartFile cvFile, Integer topK, Double minScore, 
                                      String location, String jobType);
    
    /**
     * Gọi Python API để screening CV với job cụ thể
     */
    CVScreeningResponse screenCV(MultipartFile cvFile, Integer jobId);
    
    /**
     * Sync job data từ Java sang Python
     */
    void syncJobToPython(Map<String, Object> jobData);
    
    /**
     * Sync tất cả jobs từ database sang Python
     */
    void syncAllJobsToPython();
    
    /**
     * Clear tất cả jobs trong Python service
     */
    void clearPythonJobs();
    
    /**
     * Health check Python service
     */
    boolean isPythonServiceHealthy();
} 
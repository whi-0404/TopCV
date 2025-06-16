package com.TopCV.service.impl;

import com.TopCV.dto.response.CVScreeningResponse;
import com.TopCV.dto.response.JobRecommendationResponse;
import com.TopCV.exception.AppException;
import com.TopCV.exception.ErrorCode;
import com.TopCV.service.PythonServiceClient;
import lombok.extern.slf4j.Slf4j;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Map;

@Service
@Slf4j
public class PythonServiceClientImpl implements PythonServiceClient {
    
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    
    @Value("${python-service.base-url:http://localhost:8000}")
    private String pythonServiceBaseUrl;
    
    public PythonServiceClientImpl(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }
    
    @PostConstruct
    public void init() {
        log.info("PythonServiceClientImpl initialized with baseUrl: {}", pythonServiceBaseUrl);
    }

    @Override
    public JobRecommendationResponse analyzeCV(MultipartFile cvFile, Integer topK, Double minScore, 
                                             String location, String jobType) {
        try {
            String url = pythonServiceBaseUrl + "/cv/upload";
            
            // Prepare multipart request
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            
            // Add file
            ByteArrayResource fileResource = new ByteArrayResource(cvFile.getBytes()) {
                @Override
                public String getFilename() {
                    return cvFile.getOriginalFilename();
                }
            };
            body.add("file", fileResource);
            
            // Add parameters with defaults to match Python FastAPI expectations
            body.add("top_k", topK != null ? topK : 5);
            body.add("min_score", minScore != null ? minScore : 0.3);
            if (location != null && !location.trim().isEmpty()) {
                body.add("location", location.trim());
            }
            if (jobType != null && !jobType.trim().isEmpty()) {
                body.add("job_type", jobType.trim());
            }
            
            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            
            log.info("Calling Python CV analysis API: {} with file: {}, topK: {}, minScore: {}, location: {}, jobType: {}", 
                    url, cvFile.getOriginalFilename(), topK, minScore, location, jobType);
            log.debug("Request body parameters: {}", body);
            ResponseEntity<JobRecommendationResponse> response = restTemplate.exchange(
                url, HttpMethod.POST, requestEntity, JobRecommendationResponse.class
            );
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                log.info("Python CV analysis completed successfully");
                return response.getBody();
            } else {
                log.error("Python CV analysis failed with status: {}", response.getStatusCode());
                throw new AppException(ErrorCode.EXTERNAL_SERVICE_ERROR);
            }
            
        } catch (Exception e) {
            log.error("Error calling Python CV analysis API: {}", e.getMessage(), e);
            throw new AppException(ErrorCode.EXTERNAL_SERVICE_ERROR);
        }
    }

    @Override
    public CVScreeningResponse screenCV(MultipartFile cvFile, Integer jobId) {
        try {
            String url = pythonServiceBaseUrl + "/screening/apply-job?job_id=" + jobId;
            
            // Prepare multipart request
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            
            // Add file
            ByteArrayResource fileResource = new ByteArrayResource(cvFile.getBytes()) {
                @Override
                public String getFilename() {
                    return cvFile.getOriginalFilename();
                }
            };
            body.add("cv_file", fileResource);
            
            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            
            log.info("Calling Python CV screening API: {} for job: {}", url, jobId);
            ResponseEntity<CVScreeningResponse> response = restTemplate.exchange(
                url, HttpMethod.POST, requestEntity, CVScreeningResponse.class
            );
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                log.info("Python CV screening completed successfully for job: {}", jobId);
                return response.getBody();
            } else {
                log.error("Python CV screening failed with status: {} for job: {}", response.getStatusCode(), jobId);
                throw new AppException(ErrorCode.EXTERNAL_SERVICE_ERROR);
            }
            
        } catch (Exception e) {
            log.error("Error calling Python CV screening API for job {}: {}", jobId, e.getMessage(), e);
            throw new AppException(ErrorCode.EXTERNAL_SERVICE_ERROR);
        }
    }

    @Override
    public void syncJobToPython(Map<String, Object> jobData) {
        try {
            String url = pythonServiceBaseUrl + "/jobs/sync-from-backend";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Accept", "application/json");
            headers.set("Connection", "close"); // Force connection close
            
            // Ensure jobData is not null and has data
            if (jobData == null || jobData.isEmpty()) {
                log.error("Job data is null or empty, cannot sync to Python");
                return;
            }
            
            log.info("Job data to send: {}", jobData);
            
            // Convert to JSON string explicitly
            String jsonBody;
            try {
                jsonBody = objectMapper.writeValueAsString(jobData);
                log.info("JSON body to send: {}", jsonBody);
            } catch (Exception e) {
                log.error("Failed to serialize job data to JSON: {}", e.getMessage());
                return;
            }
            
            HttpEntity<String> requestEntity = new HttpEntity<>(jsonBody, headers);
            
            log.info("Syncing job {} to Python service at URL: {}", jobData.get("job_id"), url);
            log.info("Job data being sent: {}", jobData);
            log.info("Request headers: {}", headers);
            log.info("Request body size: {} bytes", jobData.toString().length());
            ResponseEntity<String> response = restTemplate.exchange(
                url, HttpMethod.POST, requestEntity, String.class
            );
            log.debug("Python response: {}", response.getBody());
            
            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("Job {} synced to Python successfully", jobData.get("job_id"));
            } else {
                log.error("Failed to sync job {} to Python, status: {}, response: {}", 
                         jobData.get("job_id"), response.getStatusCode(), response.getBody());
                throw new RuntimeException("Python sync failed with status: " + response.getStatusCode());
            }
            
        } catch (Exception e) {
            log.error("Error syncing job {} to Python: {}", jobData.get("job_id"), e.getMessage(), e);
            // Don't throw exception for sync failures, just log
        }
    }

    @Override
    public void syncAllJobsToPython() {
        // Moved to JobSyncService
        log.warn("syncAllJobsToPython called on PythonServiceClient - use JobSyncService instead");
    }

    @Override
    public void clearPythonJobs() {
        try {
            String url = pythonServiceBaseUrl + "/jobs/clear";
            
            log.info("Clearing Python jobs database");
            ResponseEntity<String> response = restTemplate.exchange(
                url, HttpMethod.DELETE, null, String.class
            );
            
            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("Python jobs cleared successfully");
            } else {
                log.warn("Failed to clear Python jobs, status: {}", response.getStatusCode());
            }
            
        } catch (Exception e) {
            log.error("Error clearing Python jobs: {}", e.getMessage(), e);
        }
    }

    @Override
    public boolean isPythonServiceHealthy() {
        try {
            String url = pythonServiceBaseUrl + "/health";
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            log.error("Python service health check failed: {}", e.getMessage());
            return false;
        }
    }
} 
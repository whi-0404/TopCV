package com.TopCV.controller;

import com.TopCV.dto.request.CVAnalysisRequest;
import com.TopCV.dto.response.CVScreeningResponse;
import com.TopCV.dto.response.JobRecommendationResponse;
import com.TopCV.service.PythonServiceClient;
import com.TopCV.service.JobSyncService;
import com.TopCV.service.ApplicationScreeningService;
import com.TopCV.service.UserService;
import com.TopCV.service.FileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
@Slf4j
public class AIRecommendationController {
    
    private final PythonServiceClient pythonServiceClient;
    private final JobSyncService jobSyncService;
    private final ApplicationScreeningService applicationScreeningService;
    private final UserService userService;
    private final FileService fileService;

    /**
     * API phân tích CV và gợi ý công việc
     * Endpoint: POST /api/v1/ai/recommend-jobs
     */
    @PostMapping(value = "/recommend-jobs", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<JobRecommendationResponse> recommendJobs(
            @RequestParam("file") MultipartFile cvFile,
            @RequestParam(value = "top_k", defaultValue = "5") Integer topK,
            @RequestParam(value = "min_score", defaultValue = "0.3") Double minScore,
            @RequestParam(value = "location", required = false) String location,
            @RequestParam(value = "job_type", required = false) String jobType) {
        
        log.info("Received CV analysis request from user, file: {}", cvFile.getOriginalFilename());
        
        // Validate file
        if (cvFile.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        // Auto sync jobs từ PostgreSQL sang Python trước khi recommend
        log.info("Auto syncing jobs from PostgreSQL to Python service");
        jobSyncService.syncAllJobsToPython();
        
        // Call Python service for CV analysis and job recommendation
        JobRecommendationResponse response = pythonServiceClient.analyzeCV(
            cvFile, topK, minScore, location, jobType
        );
        
        log.info("CV analysis completed, found {} recommendations", 
                response.getRecommendations() != null ? response.getRecommendations().size() : 0);
        
        return ResponseEntity.ok(response);
    }

    /**
     * API screening CV khi ứng viên apply job
     * Endpoint: POST /api/v1/ai/apply-job
     * Body: form-data với cv_file (File) và userId, jobId
     */
    @PostMapping(value = "/apply-job", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CVScreeningResponse> applyJobWithScreening(
            @RequestParam("cv_file") MultipartFile cvFile,
            @RequestParam("jobId") Integer jobId,
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam(value = "notes", required = false) String notes) {
        
        log.info("Received CV screening request for job: {} from user: {}, file: {}", 
                jobId, userId, cvFile.getOriginalFilename());
        
        // Validate file
        if (cvFile.isEmpty()) {
            log.error("CV file is empty");
            return ResponseEntity.badRequest().build();
        }
        
        // Validate jobId
        if (jobId == null || jobId <= 0) {
            log.error("Invalid jobId: {}", jobId);
            return ResponseEntity.badRequest().build();
        }
        
        // Validate userId và set default nếu null
        if (userId == null || userId.trim().isEmpty()) {
            log.warn("userId not provided, using default user");
            userId = "918d733a-49ad-4cbd-adb1-bf568cdf2c55"; // Default user for testing
        }
        
        // Lấy thông tin user từ database
        var user = userService.getUserEntityById(userId);
        String candidateName = user.getFullname();
        String candidateEmail = user.getEmail();
        
        // 🔥 LƯU CV FILE VỚI UUID FILENAME TRƯỚC
        String savedFilePath;
        String actualFileName;
        try {
            savedFilePath = fileService.uploadFile(cvFile, "resume");
            // savedFilePath format: "resume/UUID_filename.pdf"
            actualFileName = savedFilePath.substring(savedFilePath.lastIndexOf("/") + 1);
            log.info("✅ CV file saved successfully: {}", savedFilePath);
        } catch (Exception e) {
            log.error("❌ Failed to save CV file: {}", e.getMessage());
            return ResponseEntity.status(500).body(null);
        }
        
        // Sync specific job trước khi screen
        log.info("Syncing job {} to Python service", jobId);
        jobSyncService.syncJobToPython(jobId);
        
        // Call Python service for CV screening
        CVScreeningResponse response = pythonServiceClient.screenCV(cvFile, jobId);
        
        // Enhance response với thông tin bổ sung cho UI
        enhanceScreeningResponse(response, candidateName, candidateEmail, cvFile.getOriginalFilename());
        
        // LƯU KẾT QUẢ SCREENING VÀO DATABASE VỚI ĐÚNG FILENAME
        try {
            applicationScreeningService.saveScreeningResult(
                response, 
                user, 
                actualFileName, // UUID filename đã lưu
                cvFile.getOriginalFilename(), // Original filename  
                cvFile.getSize() // File size
            );
            log.info("✅ Screening result saved to database successfully with Resume record - File: {}", actualFileName);
        } catch (Exception e) {
            log.error("❌ Failed to save screening result to database: {}", e.getMessage());
            // Không throw exception để không ảnh hưởng response cho user
        }
        
        log.info("CV screening completed for job: {}, candidate: {}, decision: {}, score: {}", 
                jobId, candidateName, response.getCandidateDecision(), response.getOverallScore());
        
        return ResponseEntity.ok(response);
    }

    /**
     * Health check cho Python service
     * Endpoint: GET /api/v1/ai/health
     */
    @GetMapping("/health")
    public ResponseEntity<String> checkPythonServiceHealth() {
        
        boolean isHealthy = pythonServiceClient.isPythonServiceHealthy();
        
        if (isHealthy) {
            return ResponseEntity.ok("Python AI service is healthy");
        } else {
            return ResponseEntity.status(503).body("Python AI service is not available");
        }
    }

    /**
     * Sync tất cả jobs sang Python service
     * Endpoint: POST /api/v1/ai/sync-jobs
     */
    @PostMapping("/sync-jobs")
    // @PreAuthorize("hasRole('ADMIN')") // Disabled for testing
    public ResponseEntity<String> syncJobsToPython() {
        
        log.info("Manual sync all jobs to Python service requested");
        
        try {
            jobSyncService.syncAllJobsToPython();
            return ResponseEntity.ok("Jobs synced to Python service successfully");
        } catch (Exception e) {
            log.error("Failed to sync jobs to Python service: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Failed to sync jobs: " + e.getMessage());
        }
    }

    /**
     * Clear jobs trong Python service
     * Endpoint: DELETE /api/v1/ai/clear-jobs
     */
    @DeleteMapping("/clear-jobs")
    public ResponseEntity<String> clearPythonJobs() {
        
        log.info("Clear Python jobs requested");
        
        try {
            pythonServiceClient.clearPythonJobs();
            return ResponseEntity.ok("Python jobs cleared successfully");
        } catch (Exception e) {
            log.error("Failed to clear Python jobs: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Failed to clear jobs: " + e.getMessage());
        }
    }

    /**
     * Debug endpoint - check database jobs count
     * Endpoint: GET /api/v1/ai/debug/jobs-count  
     */
    @GetMapping("/debug/jobs-count")
    public ResponseEntity<String> debugJobsCount() {
        try {
            List<Object> activeJobs = jobSyncService.getAllActiveJobs();
            return ResponseEntity.ok("Found " + activeJobs.size() + " active jobs in PostgreSQL");
        } catch (Exception e) {
            log.error("Error counting jobs: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    /**
     * Helper method để enhance screening response với thông tin UI
     */
    private void enhanceScreeningResponse(CVScreeningResponse response, String candidateName, String candidateEmail, String fileName) {
        if (response == null) return;
        
        // Set candidate info
        response.setCandidateName(candidateName);
        response.setCandidateEmail(candidateEmail);
        response.setCvFileName(fileName);
        
        // Set score level và colors cho UI
        response.setScoreLevel();
        
        // Generate quick summary
        response.generateQuickSummary();
        
        // Update message với candidate name
        if (candidateName != null && !candidateName.trim().isEmpty()) {
            response.setMessage(response.getMessage() + " - Ứng viên: " + candidateName);
        }
    }
    
    /**
     * Generate score analysis cho UI
     */
    private String generateScoreAnalysis(Double score, String decision) {
        if (score >= 4.0) {
            return "Ứng viên xuất sắc - Rất phù hợp với vị trí. Khuyến nghị phỏng vấn ngay.";
        } else if (score >= 3.0) {
            return "Ứng viên tốt - Có tiềm năng phù hợp. Nên xem xét phỏng vấn.";
        } else if (score >= 2.0) {
            return "Ứng viên trung bình - Cần đánh giá kỹ thêm trong phỏng vấn.";
        } else {
            return "Ứng viên chưa đáp ứng yêu cầu cơ bản của vị trí.";
        }
    }

} 
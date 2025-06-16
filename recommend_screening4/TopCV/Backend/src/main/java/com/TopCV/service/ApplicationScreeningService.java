package com.TopCV.service;

import com.TopCV.dto.response.CVScreeningResponse;
import com.TopCV.entity.Application;
import com.TopCV.entity.JobPost;
import com.TopCV.entity.User;
import com.TopCV.enums.ApplicationStatus;
import com.TopCV.repository.ApplicationRepository;
import com.TopCV.repository.JobPostRepository;
import com.TopCV.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApplicationScreeningService {
    
    private final ApplicationRepository applicationRepository;
    private final JobPostRepository jobPostRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    
    /**
     * Lưu kết quả screening CV vào database
     */
    @Transactional
    public Application saveScreeningResult(CVScreeningResponse screeningResponse, 
                                         User candidate,
                                         String cvFileName) {
        try {
            // Tìm job post
            Optional<JobPost> jobPostOpt = jobPostRepository.findById(screeningResponse.getJobId());
            if (jobPostOpt.isEmpty()) {
                throw new RuntimeException("Job not found: " + screeningResponse.getJobId());
            }
            JobPost jobPost = jobPostOpt.get();
            
            // Tạo application record  
            Application application = Application.builder()
                    .user(candidate)
                    .employer(jobPost.getCompany().getUser()) // Employer từ company của job post
                    .jobPost(jobPost)
                    .status(determineApplicationStatus(screeningResponse.getCandidateDecision()))
                    .coverLetter("Applied via AI Screening System")
                    .createdAt(LocalDateTime.now())
                    
                    // Screening results
                    .screeningDecision(screeningResponse.getCandidateDecision())
                    .screeningScore(screeningResponse.getOverallScore())
                    .matchingPoints(convertListToJson(screeningResponse.getMatchingPoints()))
                    .notMatchingPoints(convertListToJson(screeningResponse.getNotMatchingPoints()))
                    .screeningRecommendation(screeningResponse.getRecommendation())
                    .screenedAt(LocalDateTime.now())
                    .cvFileName(cvFileName)
                    .build();
            
            Application savedApplication = applicationRepository.save(application);
            log.info("Saved screening result for candidate: {} to job: {}", 
                    candidate.getFullname(), screeningResponse.getJobId());
            
            return savedApplication;
            
        } catch (Exception e) {
            log.error("Error saving screening result: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to save screening result", e);
        }
    }
    

    
    /**
     * Chuyển đổi screening decision thành application status
     */
    private ApplicationStatus determineApplicationStatus(String screeningDecision) {
        if (screeningDecision == null) return ApplicationStatus.PENDING;
        
        return switch (screeningDecision.toUpperCase()) {
            case "PASS" -> ApplicationStatus.PENDING; // Chờ HR review
            case "REVIEW" -> ApplicationStatus.PENDING;
            case "FAIL" -> ApplicationStatus.REJECTED;
            default -> ApplicationStatus.PENDING;
        };
    }
    
    /**
     * Convert List<String> thành JSON string để lưu DB
     */
    private String convertListToJson(java.util.List<String> list) {
        if (list == null || list.isEmpty()) {
            return "[]";
        }
        
        try {
            return objectMapper.writeValueAsString(list);
        } catch (Exception e) {
            log.error("Error converting list to JSON: {}", e.getMessage());
            return "[]";
        }
    }
} 
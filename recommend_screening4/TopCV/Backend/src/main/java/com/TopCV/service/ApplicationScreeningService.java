package com.TopCV.service;

import com.TopCV.dto.response.CVScreeningResponse;
import com.TopCV.entity.Application;
import com.TopCV.entity.JobPost;
import com.TopCV.entity.User;
import com.TopCV.entity.Resume;
import com.TopCV.enums.ApplicationStatus;
import com.TopCV.repository.ApplicationRepository;
import com.TopCV.repository.JobPostRepository;
import com.TopCV.repository.UserRepository;
import com.TopCV.repository.ResumeRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApplicationScreeningService {
    
    private final ApplicationRepository applicationRepository;
    private final JobPostRepository jobPostRepository;
    private final UserRepository userRepository;
    private final ResumeRepository resumeRepository;
    private final ObjectMapper objectMapper;
    
    /**
     * Lưu kết quả screening CV vào database
     * Tạo Resume record trước, sau đó liên kết với Application
     */
    @Transactional
    public Application saveScreeningResult(CVScreeningResponse screeningResponse, 
                                         User candidate,
                                         String cvFileName,
                                         String originalFileName,
                                         Long fileSize) {
        try {
            // Tìm job post
            Optional<JobPost> jobPostOpt = jobPostRepository.findById(screeningResponse.getJobId());
            if (jobPostOpt.isEmpty()) {
                throw new RuntimeException("Job not found: " + screeningResponse.getJobId());
            }
            JobPost jobPost = jobPostOpt.get();
            
            // 1. TẠO RESUME RECORD TRƯỚC
            Resume resume = Resume.builder()
                    .user(candidate)
                    .filePath("uploads/resume/" + cvFileName) // Đường dẫn relative từ static resources
                    .originalFilename(originalFileName)
                    .fileSize(fileSize)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            
            Resume savedResume = resumeRepository.save(resume);
            log.info("✅ Created Resume record with ID: {} for file: {}", savedResume.getId(), cvFileName);
            
            // 2. TẠO APPLICATION VÀ LIÊN KẾT VỚI RESUME
            Application application = Application.builder()
                    .user(candidate)
                    .employer(jobPost.getCompany().getUser()) // Employer từ company của job post
                    .jobPost(jobPost)
                    .resumes(savedResume) // ⭐ QUAN TRỌNG: Liên kết với Resume
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
                    .cvFileName(cvFileName) // Giữ lại để backward compatibility
                    .build();
            
            Application savedApplication = applicationRepository.save(application);
            log.info("✅ Created Application with Resume ID: {} for candidate: {} to job: {}", 
                    savedResume.getId(), candidate.getFullname(), screeningResponse.getJobId());
            
            // 3. UPDATE JOB POST APPLIED COUNT
            jobPost.setAppliedCount(jobPost.getAppliedCount() + 1);
            jobPostRepository.save(jobPost);
            
            return savedApplication;
            
        } catch (Exception e) {
            log.error("❌ Error saving screening result: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to save screening result", e);
        }
    }
    
    /**
     * Overloaded method để backward compatibility
     */
    @Transactional
    public Application saveScreeningResult(CVScreeningResponse screeningResponse, 
                                         User candidate,
                                         String cvFileName) {
        // Gọi method chính với default values
        return saveScreeningResult(screeningResponse, candidate, cvFileName, cvFileName, 0L);
    }
    
    /**
     * Chuyển đổi screening decision thành application status
     * AI chỉ cung cấp thông tin phân tích, không tự động quyết định status
     */
    private ApplicationStatus determineApplicationStatus(String screeningDecision) {
        // Luôn trả về PENDING - employer sẽ tự quyết định dựa trên AI analysis
        return ApplicationStatus.PENDING;
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
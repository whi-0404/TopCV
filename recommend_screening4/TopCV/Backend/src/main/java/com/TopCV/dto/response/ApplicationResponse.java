package com.TopCV.dto.response;

import com.TopCV.dto.response.JobPost.JobPostDashboardResponse;
import com.TopCV.enums.ApplicationStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonIgnoreProperties(ignoreUnknown = true)
public class ApplicationResponse {
    int id;
    LocalDateTime createdAt;
    ApplicationStatus status;

    JobPostDashboardResponse jobPost;

    //employer view
    UserDashboardResponse user;

    String coverLetter;
    
    // CV Screening Results - Thông tin cho nhà tuyển dụng
    CVScreeningInfo screeningResult;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class CVScreeningInfo {
        String candidateDecision; // PASS, FAIL, REVIEW
        Double overallScore; // Điểm tổng (0-5)
        List<String> matchingPoints; // Điểm phù hợp
        List<String> notMatchingPoints; // Điểm không phù hợp
        String recommendation; // Khuyến nghị
        LocalDateTime screenedAt; // Thời gian screening
        String aiAnalysis; // Phân tích chi tiết từ AI
        
        // Quick decision helpers for UI
        String scoreLevel; // EXCELLENT (4-5), GOOD (3-4), AVERAGE (2-3), POOR (0-2)
        String decisionColor; // GREEN, YELLOW, RED
        Boolean isRecommended; // true nếu PASS, false nếu FAIL
    }
}

package com.TopCV.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CVScreeningResponse {
    private Boolean success;
    private String candidateDecision; // PASS, FAIL, REVIEW
    private Double overallScore;
    private List<String> matchingPoints;
    private List<String> notMatchingPoints;
    private String recommendation;
    private Integer jobId;
    private String jobTitle;
    private String companyName;
    private String message;
    
    // Enhanced fields cho UI nhà tuyển dụng
    private String candidateName;
    private String candidateEmail;
    private String cvFileName;
    private LocalDateTime screenedAt;
    private String scoreLevel; // EXCELLENT, GOOD, AVERAGE, POOR
    private String decisionColor; // GREEN, YELLOW, RED
    private Boolean isRecommended;
    private String quickSummary; // Tóm tắt nhanh cho HR
    
    // Helper method để set score level và color
    public void setScoreLevel() {
        if (overallScore == null) {
            this.scoreLevel = "UNKNOWN";
            this.decisionColor = "GRAY";
            return;
        }
        
        if (overallScore >= 4.0) {
            this.scoreLevel = "EXCELLENT";
            this.decisionColor = "GREEN";
        } else if (overallScore >= 3.0) {
            this.scoreLevel = "GOOD";
            this.decisionColor = "GREEN";
        } else if (overallScore >= 2.0) {
            this.scoreLevel = "AVERAGE";
            this.decisionColor = "YELLOW";
        } else {
            this.scoreLevel = "POOR";
            this.decisionColor = "RED";
        }
        
        this.isRecommended = "PASS".equals(candidateDecision);
        this.screenedAt = LocalDateTime.now();
    }
    
    // Generate quick summary
    public void generateQuickSummary() {
        if (overallScore == null) {
            this.quickSummary = "Chưa có đánh giá";
            return;
        }
        
        String scoreText = String.format("%.1f/5.0", overallScore);
        String matchCount = matchingPoints != null ? String.valueOf(matchingPoints.size()) : "0";
        String notMatchCount = notMatchingPoints != null ? String.valueOf(notMatchingPoints.size()) : "0";
        
        this.quickSummary = String.format("Điểm: %s | Phù hợp: %s điểm | Thiếu: %s điểm | Quyết định: %s", 
                scoreText, matchCount, notMatchCount, candidateDecision);
    }
} 
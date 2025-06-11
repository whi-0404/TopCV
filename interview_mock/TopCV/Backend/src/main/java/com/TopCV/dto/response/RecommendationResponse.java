package com.TopCV.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RecommendationResponse {
    
    Boolean success;
    String message;
    
    // CV Analysis Results
    CVAnalysisResult cvAnalysis;
    
    // Job Recommendations
    List<JobRecommendationResult> recommendations;
    
    // Statistics
    Integer totalJobsAnalyzed;
    Float processingTimeMs;
    LocalDateTime generatedAt;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class CVAnalysisResult {
        String fullName;
        String email;
        String phone;
        String address;
        String currentPosition;
        Integer yearsExperience;
        String educationLevel;
        List<String> technicalSkills;
        List<String> softSkills;
        List<String> languages;
        List<ProjectInfo> projects;
        Float skillStrengthScore;
        
        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        @FieldDefaults(level = AccessLevel.PRIVATE)
        public static class ProjectInfo {
            String name;
            String description;
            List<String> technologies;
            String url;
        }
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class JobRecommendationResult {
        // Job Information
        Integer jobId;
        String jobTitle;
        String companyName;
        String companyLogo;
        String location;
        String jobType;
        String experienceRequired;
        String salary;
        List<String> requiredSkills;
        String description;
        List<String> benefits;
        LocalDateTime deadline;
        
        // Matching Details
        Float overallScore;
        MatchingDetails matchingDetails;
        List<String> recommendationReasons;
        List<String> improvementSuggestions;
        LocalDateTime calculatedAt;
        
        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        @FieldDefaults(level = AccessLevel.PRIVATE)
        public static class MatchingDetails {
            Float skillsScore;
            Float experienceScore;
            Float projectScore;
            Float semanticScore;
            Float educationScore;
            Float locationScore;
            
            List<String> matchedSkills;
            List<String> missingSkills;
            List<String> bonusSkills;
            List<String> relevantProjects;
        }
    }
} 
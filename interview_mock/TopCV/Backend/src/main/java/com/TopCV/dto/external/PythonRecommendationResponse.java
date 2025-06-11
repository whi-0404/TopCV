package com.TopCV.dto.external;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PythonRecommendationResponse {
    
    Boolean success;
    String message;
    
    // CV Analysis từ Python (matches Python snake_case)
    @com.fasterxml.jackson.annotation.JsonProperty("cv_summary")
    java.util.Map<String, Object> cvSummary;
    
    // Job Recommendations
    List<PythonJobRecommendation> recommendations;
    
    // Statistics (matches Python snake_case)
    @com.fasterxml.jackson.annotation.JsonProperty("total_jobs_analyzed")
    Integer totalJobsAnalyzed;
    
    @com.fasterxml.jackson.annotation.JsonProperty("processing_time_ms")
    Float processingTimeMs;
    
    @com.fasterxml.jackson.annotation.JsonProperty("generated_at")
    LocalDateTime generatedAt;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class PythonCVAnalysis {
        String fullName;
        String email;
        String phone;
        String address;
        String jobTitle;
        Integer yearsExperience;
        String educationLevel;
        List<String> technicalSkills;
        List<String> softSkills;
        List<String> languages;
        List<String> tools;
        List<PythonProject> projects;
        List<String> workExperience;
        
        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        @FieldDefaults(level = AccessLevel.PRIVATE)
        public static class PythonProject {
            String name;
            String description;
            List<String> technologies;
            String url;
            String startDate;
            String endDate;
        }
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class PythonJobRecommendation {
        // Job data (copy of input) - matches Python RecommendationResult.job_data
        @com.fasterxml.jackson.annotation.JsonProperty("job_data")
        PythonJobData jobData;
        
        // Matching scores - matches Python RecommendationResult.overall_score  
        @com.fasterxml.jackson.annotation.JsonProperty("overall_score")
        Float overallScore;
        
        @com.fasterxml.jackson.annotation.JsonProperty("matching_details")
        PythonMatchingDetails matchingDetails;
        
        // Reasons and suggestions - matches Python RecommendationResult fields
        @com.fasterxml.jackson.annotation.JsonProperty("recommendation_reasons")
        List<String> recommendationReasons;
        
        @com.fasterxml.jackson.annotation.JsonProperty("improvement_suggestions")
        List<String> improvementSuggestions;
        
        // Metadata - matches Python RecommendationResult.calculated_at
        @com.fasterxml.jackson.annotation.JsonProperty("calculated_at")
        LocalDateTime calculatedAt;
        
        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        @FieldDefaults(level = AccessLevel.PRIVATE)
        public static class PythonMatchingDetails {
            @com.fasterxml.jackson.annotation.JsonProperty("skills_score")
            Float skillsScore;
            
            @com.fasterxml.jackson.annotation.JsonProperty("experience_score")
            Float experienceScore;
            
            @com.fasterxml.jackson.annotation.JsonProperty("project_score")
            Float projectScore;
            
            @com.fasterxml.jackson.annotation.JsonProperty("semantic_score")
            Float semanticScore;
            
            @com.fasterxml.jackson.annotation.JsonProperty("education_score")
            Float educationScore;
            
            @com.fasterxml.jackson.annotation.JsonProperty("location_score")
            Float locationScore;
            
            @com.fasterxml.jackson.annotation.JsonProperty("matched_skills")
            List<String> matchedSkills;
            
            @com.fasterxml.jackson.annotation.JsonProperty("missing_skills")
            List<String> missingSkills;
            
            @com.fasterxml.jackson.annotation.JsonProperty("bonus_skills")
            List<String> bonusSkills;
            
            @com.fasterxml.jackson.annotation.JsonProperty("relevant_projects")
            List<String> relevantProjects;
        }
    }
} 
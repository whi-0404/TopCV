package com.TopCV.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobRecommendationResponse {
    private Boolean success;
    private String message;
    private CVSummary cvSummary;
    private List<JobRecommendation> recommendations;
    private Integer totalJobsAnalyzed;
    private Double processingTimeMs;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CVSummary {
        private BasicInfo basicInfo;
        private Experience experience;
        private Skills skills;
        private Education education;
        private Integer workExperienceCount;
        private Integer projectsCount;

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class BasicInfo {
            private String name;
            private String email;
            private String phone;
            private String location;
            private String currentPosition;
        }

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class Experience {
            private Integer totalYears;
            private Integer positionsCount;
            private Object latestPosition;
        }

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class Skills {
            private List<String> technicalSkills;
            private List<String> softSkills;
            private List<String> languages;
            private Integer totalTechnical;
        }

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class Education {
            private String highestLevel;
            private String educationLevel;
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class JobRecommendation {
        private String jobId;
        private String jobTitle;
        private String company;
        private String location;
        private Double matchScore;
        private String jobType;
        private List<String> requiredSkills;
        private Integer minExperience;
        private String jobDescription;
        private List<String> matchingSkills;
        private List<String> missingSkills;
        private String matchExplanation;
        private Map<String, Object> additionalInfo;
    }
} 
package com.TopCV.dto.external;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PythonRecommendationRequest {

    // CV data (có thể là file path hoặc base64 content)
    String cvFilePath;
    String cvContent; // Base64 encoded CV content

    // List of jobs to match against
    List<PythonJobData> jobList;

    // Parameters
    Integer topK;
    Float minScore;

    // Filters
    PythonFilters filters;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class PythonFilters {
        String location;
        String jobType;
        String experienceLevel;
        Integer salaryMin;
        Integer salaryMax;
    }
}

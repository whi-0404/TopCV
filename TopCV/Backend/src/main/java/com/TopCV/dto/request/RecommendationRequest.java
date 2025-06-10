package com.TopCV.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RecommendationRequest {
    
    @NotNull(message = "CV file is required")
    String cvContent; // Base64 encoded hoặc file path
    
    @Min(value = 1, message = "Top K must be at least 1")
    @Max(value = 50, message = "Top K cannot exceed 50")
    @Builder.Default
    Integer topK = 10;
    
    @Min(value = 0, message = "Min score must be between 0 and 1")
    @Max(value = 1, message = "Min score must be between 0 and 1")
    @Builder.Default
    Float minScore = 0.3f;
    
    // Optional filters
    String location;
    String jobType;
    String experienceLevel;
    Integer salaryMin;
    Integer salaryMax;
} 
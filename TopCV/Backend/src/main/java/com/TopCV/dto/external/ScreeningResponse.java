package com.TopCV.dto.external;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ScreeningResponse {
    Boolean success;
    
    @JsonProperty("candidate_decision")
    String candidateDecision; // PASS, FAIL, REVIEW
    
    @JsonProperty("overall_score")
    Float overallScore;
    
    @JsonProperty("matching_points")
    List<String> matchingPoints;
    
    @JsonProperty("not_matching_points")
    List<String> notMatchingPoints;
    
    String recommendation;
    
    @JsonProperty("job_id")
    Integer jobId;
    
    @JsonProperty("job_title")
    String jobTitle;
    
    @JsonProperty("company_name")
    String companyName;
    
    String message;
} 
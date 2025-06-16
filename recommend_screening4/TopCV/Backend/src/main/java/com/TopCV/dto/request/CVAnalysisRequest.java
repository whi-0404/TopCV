package com.TopCV.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CVAnalysisRequest {
    private Integer topK = 5;
    private Double minScore = 0.3;
    private String location;
    private String jobType;
    private Boolean includeAnalysis = true;
    private Integer jobId;
} 
package com.TopCV.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ResumeResponse {
    private int resumeId;
    private String userId;
    private String filePath;
    private String resumeName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String downloadUrl;
}

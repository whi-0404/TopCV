package com.TopCV.dto.response;

import lombok.Data;
import lombok.Getter;

import java.time.LocalDateTime;

@Data
@Getter
public class ResumeResponse {
    private int resumeId;
    private String userId;
    private String filePath;
    private String originalFileName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String downloadUrl;
}
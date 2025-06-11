package com.TopCV.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ResumeRequest {
    @NotBlank(message = "Resume name is required")
    @Size(max = 255, message = "Resume name must not exceed 255 characters")
    private String resumeName;
}

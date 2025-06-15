package com.TopCV.dto.request.Application;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ApplicationRequest {
    @NotNull(message = "JOB_ID_REQUIRED")
    Integer jobId;

    @NotNull(message = "RESUME_ID_REQUIRED")
    Integer resumeId;

    String coverLetter;
}

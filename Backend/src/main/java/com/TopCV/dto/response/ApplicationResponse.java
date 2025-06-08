package com.TopCV.dto.response;

import com.TopCV.dto.response.JobPost.JobPostDashboardResponse;
import com.TopCV.enums.ApplicationStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonIgnoreProperties(ignoreUnknown = true)
public class ApplicationResponse {
    int id;
    LocalDateTime createdAt;
    ApplicationStatus status;

    JobPostDashboardResponse jobPost;

    //employer view
    UserDashboardResponse user;

    String coverLetter;
}

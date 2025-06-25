package com.TopCV.dto.response.JobPost;

import com.TopCV.dto.response.CompanyDashboardResponse;
import com.TopCV.dto.response.JobLevelResponse;
import com.TopCV.dto.response.JobTypeResponse;
import com.TopCV.dto.response.SkillResponse;
import com.TopCV.enums.JobPostStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JobPostResponse {
    int id;
    String title;
    String location;
    String salary;
    String experienceRequired;
    LocalDate deadline;
    String description;
    String requirements;
    String benefits;
    String workingTime;
    int appliedCount;
    int hiringQuota;
    JobPostStatus status;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;

    // Company info
    CompanyDashboardResponse company;

    // Job classification
    JobTypeResponse jobType;
    JobLevelResponse jobLevel;
    List<SkillResponse> skills;

    // Additional flags for user context
    Boolean isFavorite;
    Boolean canApply;
}


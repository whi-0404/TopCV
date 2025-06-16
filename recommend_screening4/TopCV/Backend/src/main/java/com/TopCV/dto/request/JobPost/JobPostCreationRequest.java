package com.TopCV.dto.request.JobPost;

import jakarta.validation.constraints.*;
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
public class JobPostCreationRequest {
    String title;

    String description;

    String requirements;

    String benefits;

    String location;

    String workingTime;

    String salary;

    String experienceRequired;

    @Future(message = "DEADLINE_MUST_BE_FUTURE")
    LocalDate deadline; //yyyy-mm-dd

    int hiringQuota;

    @NotNull(message = "JOB_TYPE_REQUIRED")
    Integer jobTypeId;

    @NotNull(message = "JOB_LEVEL_REQUIRED")
    Integer jobLevelId;

    List<Integer> skillIds;
}

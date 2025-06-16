package com.TopCV.dto.request.JobPost;

import jakarta.validation.constraints.Future;
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
public class JobPostUpdateRequest {

    String title;

    String description;

    String requirements;

    String benefits;

    String location;

    String workingTime;

    String salary;

    String experienceRequired;

    @Future(message = "DEADLINE_MUST_BE_FUTURE")
    LocalDate deadline;

    Integer hiringQuota;

    Integer jobTypeId;
    Integer jobLevelId;
    List<Integer> skillIds;
}

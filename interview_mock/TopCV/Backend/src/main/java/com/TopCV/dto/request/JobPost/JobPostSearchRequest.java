package com.TopCV.dto.request.JobPost;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JobPostSearchRequest {
    String keyword;
    String location;
    List<Integer> jobTypeIds;
    List<Integer> jobLevelIds;
    List<Integer> skillIds;
    List<Integer> companyIds;
    String salaryRange;
    String experienceLevel;

    // Sorting options
    String sortBy; // title, salary, createdAt, deadline
    String sortDirection; // asc, desc
}
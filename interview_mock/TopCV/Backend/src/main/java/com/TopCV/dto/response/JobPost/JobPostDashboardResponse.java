package com.TopCV.dto.response.JobPost;

import com.TopCV.dto.response.JobLevelResponse;
import com.TopCV.dto.response.JobTypeResponse;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JobPostDashboardResponse {
    int id;
    String title;
    JobTypeResponse type;
    JobLevelResponse level;
    String logo;
    String companyName;
    int appliedCount;
    String location;
}

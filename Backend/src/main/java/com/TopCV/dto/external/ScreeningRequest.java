package com.TopCV.dto.external;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ScreeningRequest {
    Integer jobId;
    String jobTitle;
    String companyName;
    String description;
    String requirements;
    String coreSkills;
    String experienceRequired;
    String location;
    String benefits;
}

package com.TopCV.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CompanyReviewResponse {
    String userId;
    String fullName;
    String reviewText;
    int rateStar;
    LocalDateTime reviewDate;
}

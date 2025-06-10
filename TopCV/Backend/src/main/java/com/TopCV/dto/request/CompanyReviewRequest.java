package com.TopCV.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CompanyReviewRequest {
    Integer companyId;

    @NotNull
    @Min(value = 1, message = "STAR_RATE_INVALID")
    @Max(value = 5, message = "STAR_RATE_INVALID")
    Integer rateStar;

    @NotBlank(message = "REVIEW_TEXT_REQUIRED")
    String reviewText;
}

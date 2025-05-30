package com.TopCV.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FollowCompanyRequest {

    @NotNull(message = "COMPANY_ID_REQUIRED")
    Integer companyId;
    
    String email;
}

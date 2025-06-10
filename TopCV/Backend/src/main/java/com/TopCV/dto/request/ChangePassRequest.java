package com.TopCV.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChangePassRequest {
    @NotBlank(message = "PASSWORD_REQUIRED")
    String currentPassword;

    @NotBlank(message = "PASSWORD_REQUIRED")
    String newPassword;
}

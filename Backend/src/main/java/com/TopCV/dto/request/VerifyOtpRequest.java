package com.TopCV.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VerifyOtpRequest {
//    @Email(message = "EMAIL_INVALID")
//    @NotBlank(message = "EMAIL_REQUIRED")
//    String email;

    String keyRedisToken;

    @NotBlank(message = "OTP_REQUIRED")
    String otp;
}

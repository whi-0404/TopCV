package com.TopCV.dto.response;

import com.TopCV.enums.Role;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserDashboardResponse {
    String id;
    String userName;
    String email;
    String fullname;
    String phone;
    String address;
    String avt;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    boolean isActive;
    boolean isEmailVerified;
    LocalDateTime dob;
    Role role;
}

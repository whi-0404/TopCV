package com.TopCV.dto.request;

import com.TopCV.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserCreationRequest {
    private String userName;
    private String password;
    private String email;
    private String fullname;
    private String phone;
    private String address;
    private String avt;
    private LocalDateTime dob;
    private Role role;
} 
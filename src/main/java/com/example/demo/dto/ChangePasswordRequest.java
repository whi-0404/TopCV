package com.example.demo.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class ChangePasswordRequest {
    @NotEmpty(message = "Email không được để trống")
    private String email;
    
    @NotEmpty(message = "OTP không được để trống")
    private String otp;
    
    @NotEmpty(message = "Mật khẩu mới không được để trống")
    private String newPassword;
} 
package com.example.demo.service;

import com.example.demo.dto.JwtAuthResponse;
import com.example.demo.dto.LoginDto;
import com.example.demo.dto.RegisterDto;
import com.example.demo.dto.ChangePasswordRequest;

public interface AuthService {
    JwtAuthResponse login(LoginDto loginDto);
    String register(RegisterDto registerDto);
    String sendOtp(String email);
    String changePassword(ChangePasswordRequest request);
} 
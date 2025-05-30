package com.TopCV.service;

import com.TopCV.enums.OtpType;

import java.util.concurrent.CompletableFuture;

public interface EmailService {
    CompletableFuture<Void> sendOtpEmail(String toEmail, String otpCode, OtpType otpType);
    CompletableFuture<Void> sendWelcomeEmail(String toEmail, String fullName);
    void sendSimpleEmail(String toEmail, String subject, String content);
}

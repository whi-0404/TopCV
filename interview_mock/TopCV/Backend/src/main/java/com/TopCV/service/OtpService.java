package com.TopCV.service;

import com.TopCV.enums.OtpType;

public interface OtpService {
    void generateAndSendOtp(String email, OtpType otpType);

    boolean verifyOtp(String email, String providedOtp);
}

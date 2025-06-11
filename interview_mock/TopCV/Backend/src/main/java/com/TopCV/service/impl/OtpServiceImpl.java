package com.TopCV.service.impl;

import com.TopCV.enums.OtpType;
import com.TopCV.service.EmailService;
import com.TopCV.service.OtpService;
import com.TopCV.service.redis.UserRedisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class OtpServiceImpl implements OtpService {
    private final EmailService emailService;
    private final UserRedisService userRedisService;

    @Value("${app.security.otp.length:6}")
    private int otpLength;

    private static final SecureRandom RANDOM = new SecureRandom();

    @Transactional
    public void generateAndSendOtp(String email, OtpType otpType) {
        String otp = generateOtpCode();

        userRedisService.saveOtp(email, otp);

        emailService.sendOtpEmail(email, otp, otpType)
                .exceptionally(throwable -> {
                    log.error("Failed to send OTP email for {}: {}", email, throwable.getMessage());
                    return null;
                });
    }


    public boolean verifyOtp(String email, String providedOtp) {
        try {
            String storedOtp = userRedisService.getOtp(email);

            if (storedOtp == null) {
                log.warn("No OTP found for email: {}", email);
                return false;
            }

            boolean isValid = storedOtp.equals(providedOtp);

            if (isValid) {
                userRedisService.deleteOtp(email);
                log.info("OTP verified successfully for email: {}", email);
            } else {
                log.warn("Invalid OTP provided for email: {}", email);
            }

            return isValid;

        } catch (Exception e) {
            log.error("Error verifying OTP for email: {}", email, e);
            return false;
        }
    }

    private String generateOtpCode() {
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < otpLength; i++) {
            otp.append(RANDOM.nextInt(10));
        }
        return otp.toString();
    }
}

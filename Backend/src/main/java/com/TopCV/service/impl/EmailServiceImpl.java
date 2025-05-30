package com.TopCV.service.impl;

import com.TopCV.enums.OtpType;
import com.TopCV.service.EmailService;
import jakarta.mail.internet.MimeMessage;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.mail.javamail.JavaMailSender;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailServiceImpl implements EmailService {
    JavaMailSender mailSender;
    TemplateEngine templateEngine;

    @NonFinal
    @Value("${spring.mail.username}")
    private String fromEmail;

    @NonFinal
    @Value("${app.name:TopCV}")
    private String appName;

    @NonFinal
    @Value("${app.url:http://localhost:3000}")
    private String appUrl;

    public CompletableFuture<Void> sendOtpEmail(String toEmail, String otpCode, OtpType otpType) {
        return CompletableFuture.runAsync(() -> {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                helper.setFrom(fromEmail);
                helper.setTo(toEmail);
                helper.setSubject(getEmailSubject(otpType));

                Context context = new Context();
                context.setVariable("otpCode", otpCode);
                context.setVariable("appName", appName);
                context.setVariable("appUrl", appUrl);
                context.setVariable("recipientEmail", toEmail);

                String htmlContent = templateEngine.process(getTemplateName(otpType), context);
                helper.setText(htmlContent, true);

                mailSender.send(message);
                log.info("OTP email sent successfully to: {}", toEmail);

            } catch (Exception e) {
                log.error("Failed to send OTP email to: {}", toEmail, e);
                throw new RuntimeException("Failed to send email", e);
            }
        });
    }

    public CompletableFuture<Void> sendWelcomeEmail(String toEmail, String fullName) {
        return CompletableFuture.runAsync(() -> {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                helper.setFrom(fromEmail);
                helper.setTo(toEmail);
                helper.setSubject("Welcome to " + appName + "!");

                Context context = new Context();
                context.setVariable("fullName", fullName);
                context.setVariable("appName", appName);
                context.setVariable("appUrl", appUrl);

                String htmlContent = templateEngine.process("welcome-email", context);
                helper.setText(htmlContent, true);

                mailSender.send(message);
                log.info("Welcome email sent successfully to: {}", toEmail);

            } catch (Exception e) {
                log.error("Failed to send welcome email to: {}", toEmail, e);
            }
        });
    }

    public void sendSimpleEmail(String toEmail, String subject, String content) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(content);

            mailSender.send(message);
            log.info("Simple email sent successfully to: {}", toEmail);

        } catch (Exception e) {
            log.error("Failed to send simple email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send email", e);
        }
    }

    private String getEmailSubject(OtpType otpType) {
        return switch (otpType) {
            case EMAIL_VERIFICATION -> appName + " - Email Verification Code";
            case PASSWORD_RESET -> appName + " - Password Reset Code";
            case LOGIN_VERIFICATION -> appName + " - Login Verification Code";
        };
    }

    private String getTemplateName(OtpType otpType) {
        return switch (otpType) {
            case EMAIL_VERIFICATION -> "email-verification";
            case PASSWORD_RESET -> "password-reset";
            case LOGIN_VERIFICATION -> "login-verification";
        };
    }
}

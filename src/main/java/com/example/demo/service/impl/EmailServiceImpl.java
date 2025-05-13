package com.example.demo.service.impl;

import com.example.demo.service.EmailService;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendOtpEmail(String to, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(to);
            helper.setSubject("Your OTP Code");
            
            String name = to.split("@")[0]; // Get name from email
            
            String htmlContent = String.format("""
                <div style="background-color: #f5f5f5; padding: 20px; font-family: Arial, sans-serif;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <div style="background-color: #28a745; padding: 20px; border-radius: 5px; text-align: center; margin-bottom: 20px;">
                            <h1 style="color: white; margin: 0;">Your <span style="background-color: #ffc107; padding: 0 5px; color: black;">OTP</span> Code</h1>
                        </div>
                        <div style="text-align: center;">
                            <p style="font-size: 16px;">Hello, %s</p>
                            <p style="font-size: 16px;">We have received a request to verify your email address. Your <span style="font-weight: bold;">OTP</span> code is:</p>
                            <h2 style="font-size: 36px; color: #28a745; letter-spacing: 5px; margin: 30px 0;">%s</h2>
                            <p style="font-size: 14px; color: #666;">This <span style="font-weight: bold;">OTP</span> code is valid for 5 minutes. If you did not request this, please ignore this email.</p>
                            <p style="margin-top: 30px;">Thank you for using our service!</p>
                        </div>
                        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                            <p style="font-size: 12px; color: #666;">© 2025 Bao'Entertainment. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            """, name, otp);
            
            helper.setText(htmlContent, true);
            mailSender.send(message);
            
        } catch (MessagingException e) {
            throw new RuntimeException("Không thể gửi email OTP: " + e.getMessage());
        }
    }
} 
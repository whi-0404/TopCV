package com.TopCV.service.impl;

import com.TopCV.dto.request.UserCreationRequest;
import com.TopCV.dto.request.loginDTO;
import com.TopCV.dto.response.ResponseDTO;
import com.TopCV.dto.response.UserResponse;
import com.TopCV.entity.OTP;
import com.TopCV.entity.User;
import com.TopCV.exception.JobportalException;
import com.TopCV.repository.OTPRespository;
import com.TopCV.repository.UserRepository;
import com.TopCV.service.UserService;
import com.TopCV.ultility.Data;
import jakarta.mail.internet.MimeMessage;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMailMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.TopCV.service.SequenceGeneratorService;

import javax.swing.text.html.Option;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private OTPRespository otpRespository;

    @Autowired
    private JavaMailSender emailSender;
    @Autowired
    private JavaMailSenderImpl mailSender;

    @Override
    public UserCreationRequest registerUser(@NotNull UserCreationRequest userResponse) throws JobportalException {
        Optional<User> existingUser = userRepository.findByEmail(userResponse.getEmail());
        if (existingUser.isPresent()) throw new JobportalException("USER_FOUND");
        userResponse.setId(SequenceGeneratorService.generateSequence("users"));
        userResponse.setPassword(passwordEncoder.encode(userResponse.getPassword()));
        User user = userResponse.toEntity();
        user = userRepository.save(user);
        return user.toDto();
    }
    @Override
    public UserCreationRequest loginUser(loginDTO loginDTO) throws JobportalException {
        User user = userRepository.findByEmail(loginDTO.getEmail()).orElseThrow(()->
                 new JobportalException("USER_NOT_FOUND"));
        if(!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword()))throw new
                JobportalException("INVALID_PASSWORD");
        return user.toDto();

    }
    @Override
    public Boolean sendOtp(String email) throws Exception {
        User user = userRepository.findByEmail(email).orElseThrow(()->
                new JobportalException("USER_NOT_FOUND"));
        MimeMessage mm = mailSender.createMimeMessage();
        MimeMessageHelper message = new MimeMessageHelper(mm,true);
        message.setTo(email);
        message.setSubject("Your OTP Code");
        String genOtp = SequenceGeneratorService.generateOTP();
        OTP otp = new OTP(email,genOtp, LocalDateTime.now());
        otpRespository.save(otp);
        message.setText(Data.getMessageBody(genOtp,user.getName()), true);
        emailSender.send(mm);
        return true;
        
    }
    @Override
    public Boolean verifyOtp(String email,String otp) throws JobportalException{
        OTP otp_entity = otpRespository.findById(email).orElseThrow(()->
                new JobportalException("OTP_NOT_FOUND"));
        if (!otp_entity.getOtpCode().equals(otp))
            throw new JobportalException("INVALID_OTP");

        return true;
    }
    @Override
    public ResponseDTO changePassword(loginDTO loginDTO) throws JobportalException {
        User user = userRepository.findByEmail(loginDTO.getEmail()).orElseThrow(() ->
                new JobportalException("USER_NOT_FOUND"));
        user.setPassword(passwordEncoder.encode(loginDTO.getPassword()));
        userRepository.save(user);
        return new ResponseDTO("Password changed successfully");
    }
}

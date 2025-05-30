package com.TopCV.service.impl;

import com.TopCV.dto.request.ChangePassRequest;
import com.TopCV.dto.request.UserCreationRequest;
import com.TopCV.dto.request.UserUpdateRequest;
import com.TopCV.dto.request.VerifyOtpRequest;
import com.TopCV.dto.response.PageResponse;
import com.TopCV.dto.response.RegistrationResponse;
import com.TopCV.entity.User;
import com.TopCV.enums.OtpType;
import com.TopCV.service.EmailService;
import com.TopCV.service.redis.UserRedisService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.TopCV.dto.response.UserResponse;
import com.TopCV.exception.AppException;
import com.TopCV.exception.ErrorCode;
import com.TopCV.mapper.UserMapper;
import com.TopCV.repository.UserRepository;
import com.TopCV.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserServiceImpl implements UserService {
    UserMapper userMapper;
    UserRepository userRepository;
    PasswordEncoder passwordEncoder;
    OtpServiceImpl otpService;
    EmailService emailService;
    UserRedisService userRedisService;

    @Transactional
    public RegistrationResponse createUser(UserCreationRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }

        UserCreationRequest encryptedRequest = UserCreationRequest.builder()
                .email(request.getEmail())
                .fullname(request.getFullname())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        String keyRedisToken = userRedisService.saveTemporaryRegistration(encryptedRequest);

        otpService.generateAndSendOtp(request.getEmail(), OtpType.EMAIL_VERIFICATION);

        return RegistrationResponse.builder()
                .email(request.getEmail())
                .keyRedisToken(keyRedisToken)
                .build();
    }

    public void resendOtp(String keyRedisToken) {

        UserCreationRequest registrationData = userRedisService.getTemporaryRegistration(keyRedisToken);

        try {
            otpService.generateAndSendOtp(registrationData.getEmail(), OtpType.EMAIL_VERIFICATION);
        } catch (Exception e) {
            throw new AppException(ErrorCode.OTP_SEND_FAILED);
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse getUserById(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return userMapper.toResponse(user);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return userMapper.toResponse(user);
    }

    public UserResponse getMyInfo() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return userMapper.toResponse(user);
    }

    public UserResponse updateCurrentUser(UserUpdateRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        userMapper.updateUser(user, request);
        User updatedUser = userRepository.save(user);

        return userMapper.toResponse(updatedUser);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(String userId) {
        if(!userRepository.existsById(userId))
            throw new AppException(ErrorCode.USER_NOT_EXISTED);

        userRepository.deleteById(userId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public PageResponse<UserResponse> getAllUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());

        Page<User> pageData = userRepository.findByActiveTrue(pageable);

        return PageResponse.<UserResponse>builder()
                .pageSize(pageData.getSize())
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .Data(pageData.getContent().stream()
                        .map(userMapper::toResponse)
                        .toList())
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    public PageResponse<UserResponse> searchUsers(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());

        Page<User> pageData = userRepository.searchUsers(keyword, pageable);

        return PageResponse.<UserResponse>builder()
                .pageSize(pageData.getSize())
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .Data(pageData.getContent().stream()
                        .map(userMapper::toResponse)
                        .toList())
                .build();
    }

    public void sendEmailVerification() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (user.isEmailVerified()) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_VERIFIED);
        }

        otpService.generateAndSendOtp(email, OtpType.EMAIL_VERIFICATION);
    }

    @Transactional
    public UserResponse verifyEmail(VerifyOtpRequest request) {

        UserCreationRequest registrationData = userRedisService.getTemporaryRegistration(request.getKeyRedisToken());

        boolean isOtpValid = otpService.verifyOtp(registrationData.getEmail(), request.getOtp());

        if (!isOtpValid) {
            throw new AppException(ErrorCode.INVALID_OTP);
        }

        if (userRepository.existsByEmail(registrationData.getEmail())) {
            userRedisService.deleteTemporaryRegistration(request.getKeyRedisToken());
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        User user = userMapper.toEntity(registrationData);
        user.setEmailVerified(true);

        User savedUser = userRepository.save(user);

        userRedisService.deleteTemporaryRegistration(request.getKeyRedisToken());

        emailService.sendWelcomeEmail(user.getEmail(), user.getFullname());

        return userMapper.toResponse(savedUser);
    }

    @Transactional
    public void changePassword(ChangePassRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.INVALID_CURRENT_PASSWORD);
        }

        // Update password
        String encodedNewPassword = passwordEncoder.encode(request.getNewPassword());
        userRepository.updatePasswordByEmail(email, encodedNewPassword, LocalDateTime.now());
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void activateUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        user.setActive(true);
        userRepository.save(user);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deactivateUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        userRepository.deactivateUser(userId, LocalDateTime.now());
    }
}

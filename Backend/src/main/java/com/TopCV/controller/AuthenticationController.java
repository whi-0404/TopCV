package com.TopCV.controller;

import com.TopCV.dto.request.AuthenticationRequest;
import com.TopCV.dto.request.ForgotPasswordRequest;
import com.TopCV.dto.request.ResetPasswordRequest;
import com.TopCV.dto.response.ApiResponse;
import com.TopCV.dto.response.AuthenticationResponse;
import com.TopCV.service.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    AuthenticationService authenticationService;

    @PostMapping("/login")
    ApiResponse<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request, HttpServletResponse response) {
        var result = authenticationService.authenticate(request, response);
        return ApiResponse.<AuthenticationResponse>builder().result(result).build();
    }

    @PostMapping("/refresh")
    ApiResponse<AuthenticationResponse> refresh(HttpServletRequest request, HttpServletResponse response) {
        var result = authenticationService.refreshToken(request, response);

        return ApiResponse.<AuthenticationResponse>builder().result(result).build();
    }

    @PostMapping("/logout")
    ApiResponse<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        authenticationService.logout(request, response);

        return ApiResponse.<Void>builder().build();
    }

    @PostMapping("/forgot-password")
    public ApiResponse<String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authenticationService.forgotPassword(request);
        return ApiResponse.<String>builder()
                .result("Password reset OTP sent to your email")
                .build();
    }

    @PostMapping("/reset-password")
    public ApiResponse<String> resetPassword(@Valid @RequestBody ResetPasswordRequest request){
        authenticationService.resetPassword(request);
        return ApiResponse.<String>builder()
                .result("Password reset successfully!!")
                .build();
    }
}

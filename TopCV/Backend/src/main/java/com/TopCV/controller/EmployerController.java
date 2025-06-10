package com.TopCV.controller;

import com.TopCV.dto.request.UserCreationRequest;
import com.TopCV.dto.response.ApiResponse;
import com.TopCV.dto.response.RegistrationResponse;
import com.TopCV.enums.Role;
import com.TopCV.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/employers")
@RequiredArgsConstructor
public class EmployerController {
    private final UserService userService;

    @PostMapping("/register")
    public ApiResponse<RegistrationResponse> createEmployer(@Valid @RequestBody UserCreationRequest request) {
        request.setRole(Role.EMPLOYER.toString());
        return ApiResponse.<RegistrationResponse>builder()
                .result(userService.createUser(request))
                .build();
    }
}

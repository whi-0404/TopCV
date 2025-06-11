package com.TopCV.controller;

import com.TopCV.dto.request.CompanyCreationRequest;
import com.TopCV.dto.request.UserCreationRequest;
import com.TopCV.dto.response.ApiResponse;
import com.TopCV.dto.response.CompanyResponse;
import com.TopCV.dto.response.RegistrationResponse;
import com.TopCV.enums.Role;
import com.TopCV.service.CompanyService;
import com.TopCV.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/employers")
@RequiredArgsConstructor
public class EmployerController {
    private final UserService userService;
    private final CompanyService companyService;

    @PostMapping("/register")
    public ApiResponse<RegistrationResponse> createEmployer(@Valid @RequestBody UserCreationRequest request) {
        request.setRole(Role.EMPLOYER.toString());
        return ApiResponse.<RegistrationResponse>builder()
                .result(userService.createUser(request))
                .build();
    }

    @GetMapping("/my-company")
    public ApiResponse<CompanyResponse> getMyCompany() {
        return ApiResponse.<CompanyResponse>builder()
                .result(companyService.getMyCompany())
                .build();
    }

    @PutMapping("/my-company")
    public ApiResponse<CompanyResponse> updateMyCompany(@Valid @RequestBody CompanyCreationRequest request) {
        return ApiResponse.<CompanyResponse>builder()
                .result(companyService.updateMyCompany(request))
                .build();
    }
}

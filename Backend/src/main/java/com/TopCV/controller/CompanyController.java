package com.TopCV.controller;

import com.TopCV.dto.request.CompanyCreationRequest;
import com.TopCV.dto.request.CompanyUpdateRequest;
import com.TopCV.dto.response.ApiResponse;
import com.TopCV.dto.response.CompanyResponse;

import com.TopCV.service.CompanyService;
import com.TopCV.exception.AppException;
import com.TopCV.exception.ErrorCode;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CompanyController {

    final CompanyService companyService;

    @PostMapping
    public ApiResponse<CompanyResponse> createCompany(@RequestBody @Valid CompanyCreationRequest request) {
        return ApiResponse.<CompanyResponse>builder()
                .result(companyService.createCompany(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<CompanyResponse>> getAllCompanies() {
        return ApiResponse.<List<CompanyResponse>>builder()
                .result(companyService.getAllCompanies())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<CompanyResponse> getCompanyById(@PathVariable Integer id) {
        return ApiResponse.<CompanyResponse>builder()
                .result(companyService.getCompanyById(id))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<CompanyResponse> updateCompany(@PathVariable Integer id, @RequestBody @Valid CompanyUpdateRequest request) {
        return ApiResponse.<CompanyResponse>builder()
                .result(companyService.updateCompany(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteCompany(@PathVariable Integer id) {
        companyService.deleteCompany(id);
        return ApiResponse.<String>builder()
                .result("Company has been deleted")
                .build();
    }
}
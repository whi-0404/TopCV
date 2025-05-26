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
@RequiredArgsConstructor(onConstructor_ = @__(@Autowired))
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CompanyController {

    final CompanyService companyService;

    @PostMapping
    public ApiResponse<CompanyResponse> createCompany(@RequestBody @Valid CompanyCreationRequest request) {
        CompanyResponse createdCompany = companyService.createCompany(request);
        return ApiResponse.<CompanyResponse>builder()
                .result(createdCompany)
                .build();
    }

    @GetMapping
    public ApiResponse<List<CompanyResponse>> getAllCompanies() {
        List<CompanyResponse> companies = companyService.getAllCompanies();
        return ApiResponse.<List<CompanyResponse>>builder()
                .result(companies)
                .message("Companies retrieved successfully")
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<CompanyResponse> getCompanyById(@PathVariable Integer id) {
        CompanyResponse company = companyService.getCompanyById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COMPANY_NOT_FOUND));
        return ApiResponse.<CompanyResponse>builder()
                .result(company)
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<CompanyResponse> updateCompany(@PathVariable Integer id, @RequestBody @Valid CompanyUpdateRequest request) {
        CompanyResponse updatedCompany = companyService.updateCompany(id, request);
        return ApiResponse.<CompanyResponse>builder()
                .result(updatedCompany)
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
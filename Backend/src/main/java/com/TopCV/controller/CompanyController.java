package com.TopCV.controller;

import com.TopCV.dto.request.CompanyCreationRequest;
import com.TopCV.dto.request.CompanyUpdateRequest;
import com.TopCV.dto.response.ApiResponse;
import com.TopCV.dto.response.CompanyResponse;
import com.TopCV.service.CompanyService;
import jakarta.validation.Valid;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor(onConstructor_ = @__(@Autowired))
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CompanyController {

    final CompanyService companyService;

    @PostMapping
    public ApiResponse<CompanyResponse> createCompany(@RequestBody @Valid CompanyCreationRequest request) {
        try {
            CompanyResponse createdCompany = companyService.createCompany(request);
            return ApiResponse.<CompanyResponse>builder()
                    .result(createdCompany)
                    .message("Company created successfully")
                    .build();
        } catch (RuntimeException e) {
            log.error("Error creating company: {}", e.getMessage());
            throw e;
        }
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
        Optional<CompanyResponse> companyOptional = companyService.getCompanyById(id);
        if (companyOptional.isPresent()) {
            return ApiResponse.<CompanyResponse>builder()
                    .result(companyOptional.get())
                    .message("Company retrieved successfully")
                    .build();
        } else {
            throw new RuntimeException("Company not found with id: " + id);
        }
    }

    @PutMapping("/{id}")
    public ApiResponse<CompanyResponse> updateCompany(@PathVariable Integer id, @RequestBody @Valid CompanyUpdateRequest request) {
        try {
            CompanyResponse updatedCompany = companyService.updateCompany(id, request);
            return ApiResponse.<CompanyResponse>builder()
                    .result(updatedCompany)
                    .message("Company updated successfully")
                    .build();
        } catch (RuntimeException e) {
            log.error("Error updating company with id {}: {}", id, e.getMessage());
            throw e;
        }
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteCompany(@PathVariable Integer id) {
        try {
            companyService.deleteCompany(id);
            return ApiResponse.<String>builder()
                    .message("Company deleted successfully")
                    .result("Company with ID " + id + " has been successfully deleted.")
                    .build();
        } catch (RuntimeException e) {
            log.error("Error deleting company with id {}: {}", id, e.getMessage());
            throw e;
        }
    }
}
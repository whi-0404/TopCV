package com.TopCV.controller;

import com.TopCV.dto.request.CompanyCreationRequest;
import com.TopCV.dto.request.CompanySearchRequest;
import com.TopCV.dto.response.ApiResponse;
import com.TopCV.dto.response.CompanyDashboardResponse;
import com.TopCV.dto.response.CompanyResponse;

import com.TopCV.dto.response.PageResponse;
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
@RequestMapping("/api/v1/companies")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CompanyController {

    final CompanyService companyService;


    @GetMapping("/search")
    public ApiResponse<PageResponse<CompanyDashboardResponse>> searchCompanies(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) List<Integer> categoryIds,
            @RequestParam(required = false) String employeeRange,
            @RequestParam(required = false) String status,
            @RequestParam(required = false, defaultValue = "followerCount") String sortBy,
            @RequestParam(required = false, defaultValue = "desc") String sortDirection,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {

        CompanySearchRequest searchRequest = CompanySearchRequest.builder()
                .keyword(keyword)
                .location(location)
                .categoryIds(categoryIds)
                .employeeRange(employeeRange)
                .status(status)
                .sortBy(sortBy)
                .sortDirection(sortDirection)
                .build();

        return ApiResponse.<PageResponse<CompanyDashboardResponse>>builder()
                .result(companyService.searchCompanies(searchRequest, page, size))
                .build();
    }

    @PostMapping
    public ApiResponse<CompanyResponse> createCompany(@RequestBody @Valid CompanyCreationRequest request) {
        return ApiResponse.<CompanyResponse>builder()
                .result(companyService.createCompany(request))
                .build();
    }

    @GetMapping
    public ApiResponse<PageResponse<CompanyDashboardResponse>> getAllCompanies(@RequestParam(value = "page", defaultValue = "1") int page,
                                                                               @RequestParam(value = "size", defaultValue = "10") int size) {
        return ApiResponse.<PageResponse<CompanyDashboardResponse>>builder()
                .result(companyService.getDashBoardCompany(page, size))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<CompanyResponse> getCompanyById(@PathVariable Integer id) {
        return ApiResponse.<CompanyResponse>builder()
                .result(companyService.getCompanyById(id))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<CompanyResponse> updateCompany(@PathVariable Integer id, @RequestBody @Valid CompanyCreationRequest request) {
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

    @PostMapping("/{id}/activate")
    public ApiResponse<String> activateCompany(@PathVariable Integer id){
        companyService.activateCompany(id);
        return ApiResponse.<String>builder()
                .result("Company has been activated")
                .build();
    }

    @PostMapping("/{id}/deactivate")
    public ApiResponse<String> deactivateCompany(@PathVariable Integer id){
        companyService.deactivateCompany(id);
        return ApiResponse.<String>builder()
                .result("Company has been deactivated")
                .build();
    }

    @PostMapping("/{id}/follow")
    public ApiResponse<String> followCompany(@PathVariable Integer id) {
        companyService.followCompany(id);
        return ApiResponse.<String>builder()
                .result("Followed company successfully")
                .build();
    }

    @DeleteMapping("/{id}/follow")
    public ApiResponse<String> unfollowCompany(@PathVariable Integer id) {
        companyService.unfollowCompany(id);
        return ApiResponse.<String>builder()
                .result("Unfollowed company successfully")
                .build();
    }

    @GetMapping("/{id}/follow-status")
    public ApiResponse<Boolean> checkFollowStatus(@PathVariable Integer id) {
        return ApiResponse.<Boolean>builder()
                .result(companyService.isFollowing(id))
                .build();
    }
}
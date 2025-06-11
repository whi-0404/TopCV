package com.TopCV.controller;

import com.TopCV.dto.request.Application.ApplicationRequest;
import com.TopCV.dto.request.Application.ApplicationStatusUpdateRequest;
import com.TopCV.dto.response.ApiResponse;
import com.TopCV.dto.response.ApplicationResponse;
import com.TopCV.dto.response.PageResponse;
import com.TopCV.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/applications")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ApplicationController {
    ApplicationService applicationService;

    @PostMapping
    public ApiResponse<ApplicationResponse> applyForJob(@Valid @RequestBody ApplicationRequest request) {
        return ApiResponse.<ApplicationResponse>builder()
                .result(applicationService.applyForJob(request))
                .build();
    }

    @PostMapping("/{jobId}/resume/{resumeId}")
    public ApiResponse<ApplicationResponse> applyWithResume(@PathVariable Integer jobId,
                                                            @PathVariable Integer resumeId) {
        return ApiResponse.<ApplicationResponse>builder()
                .result(applicationService.applyForJobWithResume(jobId, resumeId))
                .build();
    }

    @DeleteMapping("/{applicationId}/withdraw")
    public ApiResponse<String> withdrawApplication(@PathVariable Integer applicationId) {
        applicationService.withdrawApplication(applicationId);
        return ApiResponse.<String>builder()
                .result("Application withdrawn successfully")
                .build();
    }

    @GetMapping("/my-applications")
    public ApiResponse<PageResponse<ApplicationResponse>> getMyApplications(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.<PageResponse<ApplicationResponse>>builder()
                .result(applicationService.getMyApplications(page, size))
                .build();
    }

    @GetMapping("/job/{jobId}")
    public ApiResponse<PageResponse<ApplicationResponse>> getJobApplications(
            @PathVariable Integer jobId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.<PageResponse<ApplicationResponse>>builder()
                .result(applicationService.getJobApplications(jobId, page, size))
                .build();
    }

    @GetMapping("/employer")
    public ApiResponse<PageResponse<ApplicationResponse>> getAllApplicationsForEmployer(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.<PageResponse<ApplicationResponse>>builder()
                .result(applicationService.getAllApplicationsForEmployer(page, size))
                .build();
    }

    @PatchMapping("/{applicationId}/status")
    public ApiResponse<String> updateApplicationStatus(
            @PathVariable Integer applicationId,
            @Valid @RequestBody ApplicationStatusUpdateRequest request) {
        applicationService.updateApplicationStatus(applicationId, request);
        return ApiResponse.<String>builder()
                .result("Application status updated successfully")
                .build();
    }

    @PatchMapping("/bulk-status-update")
    public ApiResponse<String> bulkUpdateApplicationStatus(
            @Valid @RequestBody ApplicationStatusUpdateRequest request) {
        applicationService.bulkUpdateApplicationStatus(request);
        return ApiResponse.<String>builder()
                .result("Applications status updated successfully")
                .build();
    }

    @GetMapping("/search")
    public ApiResponse<PageResponse<ApplicationResponse>> searchApplications(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.<PageResponse<ApplicationResponse>>builder()
                .result(applicationService.searchApplications(keyword, page, size))
                .build();
    }
}
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

    @PostMapping("/{jobId}")
    public ApiResponse<ApplicationResponse> applyForJob(
            @PathVariable Integer jobId,
            @RequestBody @Valid ApplicationRequest applicationRequest) {
        applicationRequest.setJobId(jobId);
        return ApiResponse.<ApplicationResponse>builder()
                .result(applicationService.applyForJob(applicationRequest))
                .build();
    }

    @PostMapping("/{jobId}/withdraw")
    public ApiResponse<String> withdrawApplication(@PathVariable Integer jobId) {
        applicationService.withdrawApplication(jobId);
        return ApiResponse.<String>builder()
                .result("withdraw application success")
                .build();
    }

    @GetMapping("/employer")
    public ApiResponse<PageResponse<ApplicationResponse>> getAllApplicationsEmployer(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ApiResponse.<PageResponse<ApplicationResponse>>builder()
                .result(applicationService.getAllApplicationsForEmployer(page, size))
                .build();
    }

    @GetMapping("/admin")
    public ApiResponse<PageResponse<ApplicationResponse>> getAllApplicationsAdmin(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ApiResponse.<PageResponse<ApplicationResponse>>builder()
                .result(applicationService.getAllApplicationsForAdmin(page, size))
                .build();
    }

    @GetMapping("/admin/search")
    public ApiResponse<PageResponse<ApplicationResponse>> searchApplicationAdmin(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ){
        return ApiResponse.<PageResponse<ApplicationResponse>>builder()
                .result(applicationService.searchApplicationsAdmin(keyword, page, size))
                .build();
    }

    @GetMapping("/employer/search")
    public ApiResponse<PageResponse<ApplicationResponse>> searchApplicationEmployer(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ){
        return ApiResponse.<PageResponse<ApplicationResponse>>builder()
                .result(applicationService.searchApplicationsEmployer(keyword, page, size))
                .build();
    }

    @GetMapping("/{jobId}")
    public ApiResponse<PageResponse<ApplicationResponse>> getJobApplications(
            @PathVariable Integer jobId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ApiResponse.<PageResponse<ApplicationResponse>>builder()
                .result(applicationService.getJobApplications(jobId, page, size))
                .build();
    }

    @GetMapping("/my")
    public ApiResponse<PageResponse<ApplicationResponse>> getMyApplications(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ApiResponse.<PageResponse<ApplicationResponse>>builder()
                .result(applicationService.getMyApplications(page, size))
                .build();
    }

    @PutMapping("/{jobId}")
    public ApiResponse<ApplicationResponse> updateApplicationStatus(@PathVariable Integer jobId,
                                                                    @RequestBody @Valid ApplicationStatusUpdateRequest request){
        return ApiResponse.<ApplicationResponse>builder()
                .result(applicationService.updateApplicationStatus(jobId, request))
                .build();
    }

    @PutMapping
    public ApiResponse<String> bulkUpdateApplicationStatus(@RequestBody @Valid ApplicationStatusUpdateRequest request){
        applicationService.bulkUpdateApplicationStatus(request);
        return ApiResponse.<String>builder()
                .result("success")
                .build();
    }
}

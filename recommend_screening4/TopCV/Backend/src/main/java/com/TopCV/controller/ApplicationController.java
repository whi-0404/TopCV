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
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/applications")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ApplicationController {
    
    ApplicationService applicationService;

    /**
     * Ứng tuyển việc làm với ApplicationRequest
     * POST /api/v1/applications/apply
     */
    @PostMapping("/apply")
    public ApiResponse<ApplicationResponse> applyForJob(@Valid @RequestBody ApplicationRequest request) {
        log.info("User applying for job with request: {}", request);
        ApplicationResponse response = applicationService.applyForJob(request);
        return ApiResponse.<ApplicationResponse>builder()
                .result(response)
                .build();
    }

    /**
     * Ứng tuyển nhanh với jobId và resumeId
     * POST /api/v1/applications/apply/{jobId}/{resumeId}
     */
    @PostMapping("/apply/{jobId}/{resumeId}")
    public ApiResponse<ApplicationResponse> applyForJobWithResume(
            @PathVariable Integer jobId,
            @PathVariable Integer resumeId) {
        log.info("User applying for job {} with resume {}", jobId, resumeId);
        ApplicationResponse response = applicationService.applyForJobWithResume(jobId, resumeId);
        return ApiResponse.<ApplicationResponse>builder()
                .result(response)
                .build();
    }

    /**
     * Rút đơn ứng tuyển
     * DELETE /api/v1/applications/{applicationId}/withdraw
     */
    @DeleteMapping("/{applicationId}/withdraw")
    public ApiResponse<String> withdrawApplication(@PathVariable Integer applicationId) {
        log.info("User withdrawing application {}", applicationId);
        applicationService.withdrawApplication(applicationId);
        return ApiResponse.<String>builder()
                .result("Đã rút đơn ứng tuyển thành công")
                .build();
    }

    /**
     * Lấy danh sách đơn ứng tuyển của user hiện tại
     * GET /api/v1/applications/my
     */
    @GetMapping("/my")
    public ApiResponse<PageResponse<ApplicationResponse>> getMyApplications(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.info("Getting my applications - page: {}, size: {}", page, size);
        PageResponse<ApplicationResponse> response = applicationService.getMyApplications(page, size);
        return ApiResponse.<PageResponse<ApplicationResponse>>builder()
                .result(response)
                .build();
    }

    /**
     * Lấy danh sách ứng viên của một job post (cho employer)
     * GET /api/v1/applications/job/{jobId}
     */
    @GetMapping("/job/{jobId}")
    public ApiResponse<PageResponse<ApplicationResponse>> getJobApplications(
            @PathVariable Integer jobId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.info("Getting applications for job {} - page: {}, size: {}", jobId, page, size);
        PageResponse<ApplicationResponse> response = applicationService.getJobApplications(jobId, page, size);
        return ApiResponse.<PageResponse<ApplicationResponse>>builder()
                .result(response)
                .build();
    }

    /**
     * Lấy tất cả đơn ứng tuyển cho employer
     * GET /api/v1/applications/employer/all
     */
    @GetMapping("/employer/all")
    public ApiResponse<PageResponse<ApplicationResponse>> getAllApplicationsForEmployer(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.info("Getting all applications for employer - page: {}, size: {}", page, size);
        PageResponse<ApplicationResponse> response = applicationService.getAllApplicationsForEmployer(page, size);
        return ApiResponse.<PageResponse<ApplicationResponse>>builder()
                .result(response)
                .build();
    }

    /**
     * Cập nhật trạng thái đơn ứng tuyển (cho employer)
     * PUT /api/v1/applications/{applicationId}/status
     */
    @PutMapping("/{applicationId}/status")
    public ApiResponse<String> updateApplicationStatus(
            @PathVariable Integer applicationId,
            @Valid @RequestBody ApplicationStatusUpdateRequest request) {
        log.info("Updating application {} status to {}", applicationId, request.getStatus());
        applicationService.updateApplicationStatus(applicationId, request);
        return ApiResponse.<String>builder()
                .result("Đã cập nhật trạng thái đơn ứng tuyển thành công")
                .build();
    }

    /**
     * Cập nhật trạng thái nhiều đơn ứng tuyển cùng lúc (cho employer)
     * PUT /api/v1/applications/bulk-status
     */
    @PutMapping("/bulk-status")
    public ApiResponse<String> bulkUpdateApplicationStatus(
            @Valid @RequestBody ApplicationStatusUpdateRequest request) {
        log.info("Bulk updating applications status to {} for {} applications", 
                request.getStatus(), request.getApplicationIds().size());
        applicationService.bulkUpdateApplicationStatus(request);
        return ApiResponse.<String>builder()
                .result("Đã cập nhật trạng thái các đơn ứng tuyển thành công")
                .build();
    }

    /**
     * Lấy chi tiết một đơn ứng tuyển (cho employer xem thông tin ứng viên)
     * GET /api/v1/applications/{applicationId}
     */
    @GetMapping("/{applicationId}")
    public ApiResponse<ApplicationResponse> getApplicationById(@PathVariable Integer applicationId) {
        log.info("Getting application details for ID: {}", applicationId);
        ApplicationResponse response = applicationService.getApplicationById(applicationId);
        return ApiResponse.<ApplicationResponse>builder()
                .result(response)
                .build();
    }

    /**
     * Tìm kiếm đơn ứng tuyển (cho admin)
     * GET /api/v1/applications/search
     */
    @GetMapping("/search")
    public ApiResponse<PageResponse<ApplicationResponse>> searchApplications(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.info("Searching applications with keyword: {} - page: {}, size: {}", keyword, page, size);
        PageResponse<ApplicationResponse> response = applicationService.searchApplications(keyword, page, size);
        return ApiResponse.<PageResponse<ApplicationResponse>>builder()
                .result(response)
                .build();
    }
}

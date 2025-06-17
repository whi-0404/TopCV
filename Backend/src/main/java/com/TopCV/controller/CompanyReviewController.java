package com.TopCV.controller;

import java.util.List;

import com.TopCV.dto.response.PageResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import com.TopCV.dto.request.CompanyReviewRequest;
import com.TopCV.dto.response.ApiResponse;
import com.TopCV.dto.response.CompanyReviewResponse;
import com.TopCV.service.CompanyReviewService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/companies/{companyId}/reviews")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CompanyReviewController {
    CompanyReviewService reviewService;

    @PostMapping
    public ApiResponse<CompanyReviewResponse> addReview(@PathVariable Integer companyId,
                                                      @Valid @RequestBody CompanyReviewRequest request) {
        request.setCompanyId(companyId);
        return ApiResponse.<CompanyReviewResponse>builder()
                .result(reviewService.addReview(request))
                .build();
    }

    @GetMapping
    public ApiResponse<PageResponse<CompanyReviewResponse>> getReviewsByCompanyId(@PathVariable Integer companyId,
                                                                                  @RequestParam(value = "page", defaultValue = "1") int page,
                                                                                  @RequestParam(value = "size", defaultValue = "10") int size) {
        return ApiResponse.<PageResponse<CompanyReviewResponse>>builder()
                .result(reviewService.getReviewsByCompanyId(companyId, page, size))
                .build();
    }

    @PutMapping
    public ApiResponse<CompanyReviewResponse> updateReview(@PathVariable("companyId") Integer companyId,
                                            @Valid @RequestBody CompanyReviewRequest request) {
        request.setCompanyId(companyId);
        return ApiResponse.<CompanyReviewResponse>builder()
                .result(reviewService.updateReview(request))
                .build();
    }

    @DeleteMapping("/{userId}")
    public ApiResponse<String> deleteReview(@PathVariable("companyId") Integer companyId,
                                            @PathVariable("userId") String userId) {
        reviewService.deleteReview(userId, companyId);
        return ApiResponse.<String>builder()
                .result("Review has been deleted")
                .build();
    }
    @GetMapping( "/user" )
    public ApiResponse<CompanyReviewResponse> getUserReviewForCompany(@PathVariable("companyId") Integer companyId) {
        reviewService.getUserReviewForCompany(companyId);
        return ApiResponse.<CompanyReviewResponse> builder()
                .result(reviewService.getUserReviewForCompany(companyId))
                .build();
    }
}

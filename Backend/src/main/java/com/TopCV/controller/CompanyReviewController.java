package com.TopCV.controller;

import java.util.List;
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
@RequestMapping("/companies/{companyId}/reviews")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CompanyReviewController {
    CompanyReviewService reviewService;

    @PostMapping
    public ApiResponse<CompanyReviewResponse> addReview(@PathVariable Integer companyId,
                                                      @Valid @RequestBody CompanyReviewRequest request) {
        request.setCompanyId(companyId);
        log.info("Adding review for company: {}", companyId);
        return ApiResponse.<CompanyReviewResponse>builder()
                .result(reviewService.addReview(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<CompanyReviewResponse>> getReviewsByCompanyId(@PathVariable Integer companyId) {
        log.info("Getting reviews for company: {}", companyId);
        return ApiResponse.<List<CompanyReviewResponse>>builder()
                .result(reviewService.getReviewsByCompanyId(companyId))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<String> updateReview(@PathVariable Integer companyId,
                                            @PathVariable Integer id,
                                            @Valid @RequestBody CompanyReviewRequest request) {
        request.setCompanyId(companyId);
        log.info("Updating review id: {} for company: {}", id, companyId);
        reviewService.updateReview(id, request);
        return ApiResponse.<String>builder()
                .result("Review has been updated")
                .build();
    }
}

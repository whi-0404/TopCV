package com.TopCV.controller;

import com.TopCV.dto.request.JobCategoryRequest;
import com.TopCV.dto.response.ApiResponse;
import com.TopCV.dto.response.JobCategoryResponse;
import com.TopCV.service.JobCategoryService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-categories")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class JobCategoryController {

    JobCategoryService jobCategoryService;

    @PostMapping
    ApiResponse<JobCategoryResponse> createJobCategory(@RequestBody @Valid JobCategoryRequest request) {
        return ApiResponse.<JobCategoryResponse>builder()
                .result(jobCategoryService.createJobCategory(request))
                .build();
    }

    @GetMapping
    ApiResponse<List<JobCategoryResponse>> getAllJobCategories() {
        return ApiResponse.<List<JobCategoryResponse>>builder()
                .result(jobCategoryService.getAllJobCategories())
                .build();
    }

    @GetMapping("/{category_id}")
    ApiResponse<JobCategoryResponse> getJobCategory(@PathVariable("category_id") Integer categoryId) {
        return ApiResponse.<JobCategoryResponse>builder()
                .result(jobCategoryService.getJobCategoryById(categoryId))
                .build();
    }

    @PutMapping("/{category_id}")
    ApiResponse<JobCategoryResponse> updateJobCategory(
            @PathVariable("category_id") Integer categoryId,
            @RequestBody @Valid JobCategoryRequest request) {
        return ApiResponse.<JobCategoryResponse>builder()
                .result(jobCategoryService.updateJobCategory(categoryId, request))
                .build();
    }

    @DeleteMapping("/{category_id}")
    ApiResponse<String> deleteJobCategory(@PathVariable("category_id") Integer categoryId) {
        jobCategoryService.deleteJobCategory(categoryId);
        return ApiResponse.<String>builder()
                .result("Job Category has been deleted")
                .build();
    }
}
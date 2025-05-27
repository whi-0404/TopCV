package com.TopCV.controller;

import com.TopCV.dto.request.CompanyCategoryRequest;
import com.TopCV.dto.response.ApiResponse;
import com.TopCV.dto.response.CompanyCategoryResponse;
import com.TopCV.service.CompanyCategoryService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/company-categories")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CompanyCategoryController {

    CompanyCategoryService companyCategoryService;

    @PostMapping
    ApiResponse<CompanyCategoryResponse> createCompanyCategory(@RequestBody @Valid CompanyCategoryRequest request) {
        return ApiResponse.<CompanyCategoryResponse>builder()
                .result(companyCategoryService.createCompanyCategory(request))
                .build();
    }

    @GetMapping
    ApiResponse<List<CompanyCategoryResponse>> getAllCompanyCategories() {
        return ApiResponse.<List<CompanyCategoryResponse>>builder()
                .result(companyCategoryService.getAllCompanyCategories())
                .build();
    }

    @GetMapping("/{category_id}")
    ApiResponse<CompanyCategoryResponse> getCompanyCategory(@PathVariable("category_id") Integer categoryId) {
        return ApiResponse.<CompanyCategoryResponse>builder()
                .result(companyCategoryService.getCompanyCategoryById(categoryId))
                .build();
    }

    @PutMapping("/{category_id}")
    ApiResponse<CompanyCategoryResponse> updateCompanyCategory(
            @PathVariable("category_id") Integer categoryId,
            @RequestBody @Valid CompanyCategoryRequest request) {
        return ApiResponse.<CompanyCategoryResponse>builder()
                .result(companyCategoryService.updateCompanyCategory(categoryId, request))
                .build();
    }

    @DeleteMapping("/{category_id}")
    ApiResponse<String> deleteCompanyCategory(@PathVariable Integer category_id) {
        companyCategoryService.deleteCompanyCategory(category_id);
        return ApiResponse.<String>builder()
                .result("Company Category has been deleted")
                .build();
    }
}
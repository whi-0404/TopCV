package com.TopCV.service;

import com.TopCV.dto.request.CompanyCategoryRequest;
import com.TopCV.dto.response.CompanyCategoryResponse;

import java.util.List;

public interface CompanyCategoryService {
    CompanyCategoryResponse createCompanyCategory(CompanyCategoryRequest request);

    List<CompanyCategoryResponse> getAllCompanyCategories();

    CompanyCategoryResponse getCompanyCategoryById(Integer id);

    CompanyCategoryResponse updateCompanyCategory(Integer category_id, CompanyCategoryRequest request);

    void deleteCompanyCategory(Integer category_id);
}

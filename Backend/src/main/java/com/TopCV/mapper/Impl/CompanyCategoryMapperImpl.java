package com.TopCV.mapper.Impl;

import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.TopCV.dto.request.CompanyCategoryRequest;
import com.TopCV.dto.response.CompanyCategoryResponse;
import com.TopCV.entity.CompanyCategory;
import com.TopCV.mapper.CompanyCategoryMapper;

@Component
@RequiredArgsConstructor
@Slf4j
public class CompanyCategoryMapperImpl implements CompanyCategoryMapper {

    @Override
    public CompanyCategory toEntity(CompanyCategoryRequest request) {
        if (request == null) {
            return null;
        }
        return CompanyCategory.builder()
                .name(request.getName())
                .build();
    }

    @Override
    public CompanyCategoryResponse toResponse(CompanyCategory companyCategory) {
        if (companyCategory == null) {
            return null;
        }
        return CompanyCategoryResponse.builder()
                .id(companyCategory.getId())
                .name(companyCategory.getName())
                .build();
    }

    @Override
    public void updateEntity(CompanyCategory category, CompanyCategoryRequest request) {
        if (category == null || request == null) {
            return;
        }
        if (request.getName() != null) {
            category.setName(request.getName());
        }
    }
}
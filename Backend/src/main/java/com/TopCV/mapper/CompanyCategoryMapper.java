package com.TopCV.mapper;

import com.TopCV.dto.response.CompanyCategoryResponse;
import com.TopCV.dto.request.CompanyCategoryRequest;
import com.TopCV.entity.CompanyCategory;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CompanyCategoryMapper {
    CompanyCategory toEntity(CompanyCategoryRequest request);
    CompanyCategoryResponse toResponse(CompanyCategory companyCategory);
    void updateEntity(@MappingTarget CompanyCategory category, CompanyCategoryRequest request);
}

package com.TopCV.mapper;

import com.TopCV.dto.request.CompanyCreationRequest;
import com.TopCV.dto.response.CompanyDashboardResponse;
import com.TopCV.dto.response.CompanyResponse;
import com.TopCV.entity.Company;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

public interface CompanyMapper {

    CompanyResponse toResponse(Company company);

    Company toEntity(CompanyCreationRequest request);

    void updateEntity(@MappingTarget Company company, CompanyCreationRequest request);

    CompanyDashboardResponse toCompanyDashboard(Company company);
}
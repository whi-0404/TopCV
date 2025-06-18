package com.TopCV.mapper.Impl;

import com.TopCV.dto.response.CompanyCategoryResponse;
import com.TopCV.dto.response.CompanyDashboardResponse;
import com.TopCV.mapper.CompanyCategoryMapper;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.TopCV.dto.request.CompanyCreationRequest;
import com.TopCV.dto.response.CompanyResponse;
import com.TopCV.entity.Company;
import com.TopCV.mapper.CompanyMapper;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class CompanyMapperImpl implements CompanyMapper {
    private final CompanyCategoryMapper companyCategoryMapper;

    public CompanyResponse toResponse(Company company) {
        if (company == null) {
            return null;
        } else {
            CompanyResponse.CompanyResponseBuilder companyResponse = CompanyResponse.builder();
            companyResponse.id(company.getId());
            companyResponse.name(company.getName());
            companyResponse.description(company.getDescription());
            companyResponse.logo(company.getLogo());
            companyResponse.website(company.getWebsite());
            companyResponse.employeeRange(company.getEmployeeRange());
            companyResponse.followerCount(company.getFollowerCount());
            companyResponse.address(company.getAddress());

            if(company.getCategories() != null && !company.getCategories().isEmpty()){
                companyResponse.categories(company.getCategories().stream()
                        .map(companyCategoryMapper::toResponse)
                        .toList());
            }
            else {
                companyResponse.categories(List.of());
            }

            companyResponse.jobCount(company.getJobPosts() != null ? company.getJobPosts().size() : 0);
            return companyResponse.build();
        }
    }

    public Company toEntity(CompanyCreationRequest request) {
        if (request == null) {
            return null;
        } else {
            Company.CompanyBuilder company = Company.builder();
            company.name(request.getName());
            company.description(request.getDescription());
            company.logo(request.getLogo());
            company.website(request.getWebsite());
            company.employeeRange(request.getEmployeeRange());
            company.address(request.getAddress());
            return company.build();
        }
    }

    public void updateEntity(Company company, CompanyCreationRequest request) {
        if (request != null) {
            company.setName(request.getName());
            company.setDescription(request.getDescription());
            company.setLogo(request.getLogo());
            company.setWebsite(request.getWebsite());
            company.setEmployeeRange(request.getEmployeeRange());

            company.setAddress(request.getAddress());
        }
    }

    public CompanyDashboardResponse toCompanyDashboard(Company company) {
        CompanyDashboardResponse response = new CompanyDashboardResponse();
        response.setId(company.getId());
        response.setDescription(company.getDescription());
        response.setName(company.getName());
        response.setLogo(company.getLogo());

        if (company.getCategories() != null && !company.getCategories().isEmpty()) {
        List<CompanyCategoryResponse> categories = company.getCategories().stream()
                .map(companyCategoryMapper::toResponse)
                .collect(Collectors.toList());
            response.setCategories(categories);
        } else {
            response.setCategories(List.of());
        }

        response.setJobCount(company.getJobPosts() != null ? company.getJobPosts().size() : 0);
        return response;
    }
}
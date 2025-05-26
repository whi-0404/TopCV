package com.TopCV.mapper.Impl;

import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.TopCV.dto.request.CompanyCreationRequest;
import com.TopCV.dto.request.CompanyUpdateRequest;
import com.TopCV.dto.response.CompanyResponse;
import com.TopCV.entity.Company;
import com.TopCV.mapper.CompanyMapper;

@Component
@RequiredArgsConstructor
@Slf4j
public class CompanyMapperImpl implements CompanyMapper {

    @Override
    public CompanyResponse toResponse(Company company) {
        if (company == null) {
            return null;
        }
        return CompanyResponse.builder()
                .id(company.getId())
                .name(company.getName())
                .description(company.getDescription())
                .logo(company.getLogo())
                .website(company.getWebsite())
                .employeeRange(company.getEmployeeRange())
                .followerCount(company.getFollowerCount())
                .address(company.getAddress())
                // .categoryId(company.getCategory() != null ? company.getCategory().getId() : null) // Uncomment if needed
                // .userId(company.getUser() != null ? company.getUser().getId() : null) // Uncomment if needed
                .build();
    }

    @Override
    public Company toEntity(CompanyCreationRequest request) {
        if (request == null) {
            return null;
        }
        return Company.builder()
                .name(request.getName())
                .description(request.getDescription())
                .logo(request.getLogo())
                .website(request.getWebsite())
                .employeeRange(request.getEmployeeRange())
//                .followerCount(request.getFollowerCount() != null ? request.getFollowerCount() : 0)
                .address(request.getAddress())
                // .category(category) // Set this if you have category info in request
                // .user(user) // Set this if you have user info in request
                .build();
    }

    @Override
    public void updateEntity(Company company, CompanyUpdateRequest request) {
        if (company == null || request == null) {
            return;
        }
        if (request.getName() != null) {
            company.setName(request.getName());
        }
        if (request.getDescription() != null) {
            company.setDescription(request.getDescription());
        }
        if (request.getLogo() != null) {
            company.setLogo(request.getLogo());
        }
        if (request.getWebsite() != null) {
            company.setWebsite(request.getWebsite());
        }
        if (request.getEmployeeRange() != null) {
            company.setEmployeeRange(request.getEmployeeRange());
        }
        if (request.getFollowerCount() != null) {
            company.setFollowerCount(request.getFollowerCount());
        }
        if (request.getAddress() != null) {
            company.setAddress(request.getAddress());
        }
    }
}
package com.TopCV.service;

import com.TopCV.dto.request.CompanyCreationRequest;
import com.TopCV.dto.request.CompanyUpdateRequest;
import com.TopCV.dto.response.CompanyResponse;

import java.util.List;
import java.util.Optional;

public interface CompanyService {
    CompanyResponse createCompany(CompanyCreationRequest request);
    List<CompanyResponse> getAllCompanies();
    Optional<CompanyResponse> getCompanyById(Integer id);
    CompanyResponse updateCompany(Integer id, CompanyUpdateRequest request);
    void deleteCompany(Integer id);
    boolean isCompanyNameExists(String name);
}
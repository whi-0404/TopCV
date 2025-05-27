package com.TopCV.service;

import com.TopCV.dto.request.CompanyCreationRequest;
import com.TopCV.dto.request.CompanyUpdateRequest;
import com.TopCV.dto.response.CompanyResponse;

import java.util.List;

public interface CompanyService {
    CompanyResponse createCompany(CompanyCreationRequest request);
    List<CompanyResponse> getAllCompanies();
    CompanyResponse getCompanyById(Integer id);  // Returns CompanyResponse directly
    CompanyResponse updateCompany(Integer id, CompanyUpdateRequest request);
    void deleteCompany(Integer id);
}
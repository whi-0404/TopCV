package com.TopCV.service;

import com.TopCV.dto.request.CompanyCreationRequest;
import com.TopCV.dto.request.CompanySearchRequest;
import com.TopCV.dto.response.CompanyDashboardResponse;
import com.TopCV.dto.response.CompanyResponse;
import com.TopCV.dto.response.PageResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CompanyService {
    PageResponse<CompanyDashboardResponse> searchCompanies(CompanySearchRequest request, int page, int size);
    CompanyResponse createCompany(CompanyCreationRequest request, MultipartFile file);
    PageResponse<CompanyDashboardResponse> getDashBoardCompany(int page, int size);
    CompanyResponse getCompanyById(Integer id);  // Returns CompanyResponse directly
    CompanyResponse updateCompany(Integer id, CompanyCreationRequest request, MultipartFile file);
    void deleteCompany(Integer id);
    void activateCompany(Integer id);
    void deactivateCompany(Integer id);
    void followCompany(Integer companyId);
    void unfollowCompany(Integer companyId);
    boolean isFollowing(Integer companyId);
}
package com.TopCV.service.impl;

import com.TopCV.entity.Company;
import com.TopCV.dto.request.CompanyCreationRequest;
import com.TopCV.dto.request.CompanyUpdateRequest;
import com.TopCV.dto.response.CompanyResponse;
import com.TopCV.repository.CompanyRepository;
import com.TopCV.service.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CompanyServiceImpl implements CompanyService {

    @Autowired
    private CompanyRepository companyRepository;

    @Override
    public CompanyResponse createCompany(CompanyCreationRequest request) {
        if (companyRepository.existsByName(request.getName())) {
            throw new RuntimeException("Company name already exists: " + request.getName());
        }

        Company company = new Company();
        company.setName(request.getName());
        company.setDescription(request.getDescription());
        company.setLogo(request.getLogo());
        company.setWebsite(request.getWebsite());
        company.setEmployeeRange(request.getEmployeeRange());
        company.setFollowerCount(request.getFollowerCount());
        company.setAddress(request.getAddress());

        company.setCategory(null);
        company.setUser(null);

        Company savedCompany = companyRepository.save(company);
        return convertToCompanyResponse(savedCompany);
    }

    @Override
    public List<CompanyResponse> getAllCompanies() {
        return companyRepository.findAll().stream()
                .map(this::convertToCompanyResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<CompanyResponse> getCompanyById(Integer id) {
        return companyRepository.findById(id)
                .map(this::convertToCompanyResponse);
    }

    @Override
    public CompanyResponse updateCompany(Integer id, CompanyUpdateRequest request) {
        Optional<Company> existingCompanyOptional = companyRepository.findById(id);
        if (existingCompanyOptional.isEmpty()) {
            throw new RuntimeException("Company not found with id: " + id);
        }

        Company existingCompany = existingCompanyOptional.get();

        if (request.getName() != null) {
            existingCompany.setName(request.getName());
        }
        if (request.getDescription() != null) {
            existingCompany.setDescription(request.getDescription());
        }
        if (request.getLogo() != null) {
            existingCompany.setLogo(request.getLogo());
        }
        if (request.getWebsite() != null) {
            existingCompany.setWebsite(request.getWebsite());
        }
        if (request.getEmployeeRange() != null) {
            existingCompany.setEmployeeRange(request.getEmployeeRange());
        }
        if (request.getFollowerCount() != null) {
            existingCompany.setFollowerCount(request.getFollowerCount());
        }
        if (request.getAddress() != null) {
            existingCompany.setAddress(request.getAddress());
        }

        Company updatedCompany = companyRepository.save(existingCompany);
        return convertToCompanyResponse(updatedCompany);
    }

    @Override
    public void deleteCompany(Integer id) {
        if (!companyRepository.existsById(id)) {
            throw new RuntimeException("Company not found with id: " + id);
        }
        companyRepository.deleteById(id);
    }

    @Override
    public boolean isCompanyNameExists(String name) {
        return companyRepository.existsByName(name);
    }

    private CompanyResponse convertToCompanyResponse(Company company) {
        return CompanyResponse.builder()
                .id(company.getId())
                .name(company.getName())
                .description(company.getDescription())
                .logo(company.getLogo())
                .website(company.getWebsite())
                .employeeRange(company.getEmployeeRange())
                .followerCount(company.getFollowerCount())
                .address(company.getAddress())
                .build();
    }
}
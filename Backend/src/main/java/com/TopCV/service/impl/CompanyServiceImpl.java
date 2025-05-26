package com.TopCV.service.impl;

import com.TopCV.dto.request.CompanyCreationRequest;
import com.TopCV.dto.request.CompanyUpdateRequest;
import com.TopCV.dto.response.CompanyResponse;
import com.TopCV.entity.Company;
import com.TopCV.exception.AppException;
import com.TopCV.exception.ErrorCode;
import com.TopCV.mapper.CompanyMapper;
import com.TopCV.repository.CompanyRepository;
import com.TopCV.service.CompanyService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CompanyServiceImpl implements CompanyService {

    CompanyRepository companyRepository;
    CompanyMapper companyMapper;

    @Override
    @Transactional
    public CompanyResponse createCompany(CompanyCreationRequest request) {
        if (companyRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.COMPANY_NAME_EXISTS);
        }
        Company company = companyMapper.toEntity(request);
        Company savedCompany = companyRepository.save(company);
        return companyMapper.toResponse(savedCompany);
    }

    @Override
    public List<CompanyResponse> getAllCompanies() {
        return companyRepository.findAll().stream()
                .map(companyMapper::toResponse)
                .toList();
    }

    @Override
    public Optional<CompanyResponse> getCompanyById(Integer id) {
        return companyRepository.findById(id)
                .map(companyMapper::toResponse);
    }

    @Override
    @Transactional
    public CompanyResponse updateCompany(Integer id, CompanyUpdateRequest request) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COMPANY_NOT_FOUND));
        companyMapper.updateEntity(company, request);
        Company updatedCompany = companyRepository.save(company);
        return companyMapper.toResponse(updatedCompany);
    }

    @Override
    @Transactional
    public void deleteCompany(Integer id) {
        if (!companyRepository.existsById(id)) {
            throw new AppException(ErrorCode.COMPANY_NOT_FOUND);
        }
        companyRepository.deleteById(id);
    }

    @Override
    public boolean isCompanyNameExists(String name) {
        return companyRepository.existsByName(name);
    }
}
package com.TopCV.service.impl;

import com.TopCV.dto.request.CompanyCategoryRequest;
import com.TopCV.dto.response.CompanyCategoryResponse;
import com.TopCV.entity.CompanyCategory;
import com.TopCV.exception.AppException;
import com.TopCV.exception.ErrorCode;
import com.TopCV.mapper.CompanyCategoryMapper;
import com.TopCV.repository.CompanyCategoryRepository;
import com.TopCV.service.CompanyCategoryService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CompanyCategoryServiceImpl implements CompanyCategoryService {

    CompanyCategoryRepository companyCategoryRepository;
    CompanyCategoryMapper companyCategoryMapper;

    @Override
    @Transactional
    public CompanyCategoryResponse createCompanyCategory(CompanyCategoryRequest request) {
        if (companyCategoryRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.CATEGORY_NAME_EXISTS);
        }

        CompanyCategory category = companyCategoryMapper.toEntity(request);
        return companyCategoryMapper.toResponse(companyCategoryRepository.save(category));
    }

    @Override
    public List<CompanyCategoryResponse> getAllCompanyCategories() {
        return companyCategoryRepository.findAll().stream()
                .map(companyCategoryMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CompanyCategoryResponse getCompanyCategoryById(Integer id) {
        CompanyCategory category = companyCategoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTS));
        return companyCategoryMapper.toResponse(category);
    }

    @Override
    @Transactional
    public CompanyCategoryResponse updateCompanyCategory(Integer category_id, CompanyCategoryRequest request) {
        CompanyCategory category = companyCategoryRepository.findById(category_id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTS));

        companyCategoryMapper.updateEntity(category, request);
        return companyCategoryMapper.toResponse(companyCategoryRepository.save(category));
    }

    @Override
    @Transactional
    public void deleteCompanyCategory(Integer category_id) {
        if (!companyCategoryRepository.existsById(category_id)) {
            throw new AppException(ErrorCode.CATEGORY_NOT_EXISTS);
        }
        companyCategoryRepository.deleteById(category_id);
    }
}

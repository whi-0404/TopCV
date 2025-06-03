package com.TopCV.service.impl;

import com.TopCV.dto.request.CompanyCreationRequest;
import com.TopCV.dto.response.*;
import com.TopCV.entity.Company;
import com.TopCV.entity.CompanyCategory;
import com.TopCV.entity.User;
import com.TopCV.exception.AppException;
import com.TopCV.exception.ErrorCode;
import com.TopCV.mapper.CompanyCategoryMapper;
import com.TopCV.mapper.CompanyMapper;
import com.TopCV.mapper.CompanyReviewMapper;
import com.TopCV.repository.CompanyCategoryRepository;
import com.TopCV.repository.CompanyRepository;
import com.TopCV.repository.CompanyReviewRepository;
import com.TopCV.repository.UserRepository;
import com.TopCV.service.CompanyCategoryService;
import com.TopCV.service.CompanyReviewService;
import com.TopCV.service.CompanyService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CompanyServiceImpl implements CompanyService {
    CompanyReviewService reviewService;
    CompanyRepository companyRepository;
    CompanyMapper companyMapper;
    UserRepository userRepository;
    CompanyCategoryRepository categoryRepository;
    CompanyCategoryMapper categoryMapper;

    @Override
    @Transactional
    @PreAuthorize("hasRole('EMPLOYER')")
    public CompanyResponse createCompany(CompanyCreationRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (companyRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.COMPANY_NAME_EXISTED);
        }

        List<CompanyCategory> companyCategories = List.of();
        if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
            companyCategories = categoryRepository.findAllById(request.getCategoryIds());

            if (companyCategories.size() != request.getCategoryIds().size()) {
                throw new AppException(ErrorCode.CATEGORY_NOT_EXISTED);
            }
        }

        Company company = companyMapper.toEntity(request);
        company.setUser(user);
        company.setCategories(companyCategories);

        return companyMapper.toResponse(companyRepository.save(company));
    }

    @Override
    public PageResponse<CompanyDashboardResponse> getDashBoardCompany(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("followerCount").descending());

        Page<Company> pageData = companyRepository.findAllByActiveTrue(pageable);


        return PageResponse.<CompanyDashboardResponse>builder()
                .pageSize(pageData.getSize())
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .Data(pageData.getContent().stream()
                        .map(this::convertCompanyDashboard)
                        .toList())
                .build();
    }

    @Override
    public CompanyResponse getCompanyById(Integer id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COMPANY_NOT_EXISTED));
        CompanyResponse response = companyMapper.toResponse(company);

        response.setReviewStats( reviewService.getReviewStats(id) );

        return response;
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('EMPLOYER')")
    public CompanyResponse updateCompany(Integer id, CompanyCreationRequest request) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COMPANY_NOT_EXISTED));

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (!company.getUser().getId().equals(currentUser.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        if (request.getName() != null &&
                !company.getName().equals(request.getName()) &&
                companyRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.COMPANY_NAME_EXISTED);
        }

        companyMapper.updateEntity(company, request);

        if (request.getCategoryIds() != null) {
            if (request.getCategoryIds().isEmpty()) {
                company.setCategories(List.of());
            } else {
                List<CompanyCategory> companyCategories = categoryRepository.findAllById(request.getCategoryIds());

                if (companyCategories.size() != request.getCategoryIds().size()) {
                    throw new AppException(ErrorCode.CATEGORY_NOT_EXISTED);
                }

                company.setCategories(companyCategories);
            }
        }
        return companyMapper.toResponse(companyRepository.save(company));
    }

    @Override
    @Transactional
    public void deleteCompany(Integer id) {
        if (!companyRepository.existsById(id)) {
            throw new AppException(ErrorCode.COMPANY_NOT_EXISTED);
        }
        companyRepository.deleteById(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void activateCompany(Integer id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COMPANY_NOT_EXISTED));

        company.setActive(true);
        companyRepository.save(company);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deactivateCompany(Integer id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COMPANY_NOT_EXISTED));

        company.setActive(false);
        companyRepository.save(company);
    }

    private CompanyDashboardResponse convertCompanyDashboard(Company company) {
        CompanyDashboardResponse response = new CompanyDashboardResponse();
        response.setId(company.getId());
        response.setDescription(company.getDescription());
        response.setName(company.getName());
        response.setLogo(company.getLogo());

        List<CompanyCategoryResponse> categories = company.getCategories().stream()
                .map(categoryMapper::toResponse)
                .collect(Collectors.toList());

        response.setCategories(categories);
        response.setJobCount(company.getJobPosts().size());
        return response;
    }
}

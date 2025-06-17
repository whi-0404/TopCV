package com.TopCV.service.impl;

import com.TopCV.dto.request.CompanyCreationRequest;
import com.TopCV.dto.request.CompanySearchRequest;
import com.TopCV.dto.request.JobPost.JobPostSearchRequest;
import com.TopCV.dto.response.*;
import com.TopCV.dto.response.JobPost.JobPostDashboardResponse;
import com.TopCV.entity.*;
import com.TopCV.enums.FileType;
import com.TopCV.enums.JobPostStatus;
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
import com.TopCV.service.FileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import static com.google.common.io.Files.getFileExtension;

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
    FileService fileService;

    @Override
    @Transactional
    @PreAuthorize("hasRole('EMPLOYER')")
    public CompanyResponse createCompany(CompanyCreationRequest request, MultipartFile file) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (companyRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.COMPANY_NAME_EXISTED);
        }

        if(companyRepository.existsByUserId(user.getId())){
            throw new AppException(ErrorCode.COMPANY_EXISTED);
        }

        List<CompanyCategory> companyCategories = List.of();
        if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
            companyCategories = categoryRepository.findAllById(request.getCategoryIds());

            if (companyCategories.size() != request.getCategoryIds().size()) {
                throw new AppException(ErrorCode.CATEGORY_NOT_EXISTED);
            }
        }

        //logo
        validateFile(file);
        String filePath;

        try {
             filePath = fileService.uploadFile(file, FileType.COMPANY_LOGO.getDirectory());

        } catch (Exception e) {
            log.error("Failed to upload logo company for user {}: {}", user.getEmail(), e.getMessage(), e);
            throw new AppException(ErrorCode.LOGO_COMPANY_UPLOAD_FAILED);
        }

        Company company = companyMapper.toEntity(request);
        company.setUser(user);
        company.setCategories(companyCategories);
        company.setLogo(filePath);

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
                        .map(companyMapper::toCompanyDashboard)
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
    public CompanyResponse updateCompany(Integer id, CompanyCreationRequest request, MultipartFile file) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COMPANY_NOT_EXISTED));

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (!company.getUser().getId().equals(currentUser.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        if (request!=null && request.getName() != null &&
                !company.getName().equals(request.getName()) &&
                companyRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.COMPANY_NAME_EXISTED);
        }

        companyMapper.updateEntity(company, request);

        // Update categories if provided
        if (request!=null && request.getCategoryIds() != null) {
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

        // Handle logo update if file is provided
        if (file != null && !file.isEmpty()) {
            // Validate the new file
            validateFile(file);

            // Store old logo path for deletion
            String oldLogoPath = company.getLogo();

            try {
                // Upload new logo
                String newFilePath = fileService.uploadFile(file, FileType.COMPANY_LOGO.getDirectory());
                company.setLogo(newFilePath);

                // Delete old logo file if it exists
                if (oldLogoPath != null && !oldLogoPath.trim().isEmpty()) {
                    try {
                        fileService.deleteFile(oldLogoPath);
                        log.info("Successfully deleted old logo: {}", oldLogoPath);
                    } catch (Exception e) {
                        log.warn("Failed to delete old logo file {}: {}", oldLogoPath, e.getMessage());
                        // Don't throw exception here, as the main operation succeeded
                    }
                }

            } catch (Exception e) {
                log.error("Failed to upload new logo for company {}: {}", id, e.getMessage(), e);
                throw new AppException(ErrorCode.LOGO_COMPANY_UPLOAD_FAILED);
            }
        }

        return companyMapper.toResponse(companyRepository.save(company));
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
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

    @Override
    @Transactional
    public void followCompany(Integer companyId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new AppException(ErrorCode.COMPANY_NOT_EXISTED));

        if (!company.getActive()) {
            throw new AppException(ErrorCode.COMPANY_NOT_ACTIVE);
        }

        if (user.getFollowCompanies().contains(company)) {
            throw new AppException(ErrorCode.ALREADY_FOLLOWING_COMPANY);
        }

        user.getFollowCompanies().add(company);
        company.setFollowerCount(company.getFollowerCount() + 1);

        userRepository.save(user);
        companyRepository.save(company);
    }

    @Override
    @Transactional
    public void unfollowCompany(Integer companyId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new AppException(ErrorCode.COMPANY_NOT_EXISTED));


        if (!user.getFollowCompanies().contains(company)) {
            throw new AppException(ErrorCode.NOT_FOLLOWING_COMPANY);
        }

        user.getFollowCompanies().remove(company);
        company.setFollowerCount(Math.max(0, company.getFollowerCount() - 1));

        userRepository.save(user);
        companyRepository.save(company);
    }

    @Override
    public boolean isFollowing(Integer companyId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return user.getFollowCompanies().stream()
                .anyMatch(company -> company.getId() == companyId);
    }


    private Specification<Company> buildCompanySearchSpecification(CompanySearchRequest request) {
        return (root, query, criteriaBuilder) -> {
            var predicates = criteriaBuilder.conjunction();

            // Default: Only show active companies (unless status is specified)
            if (request.getStatus() == null) {
                predicates = criteriaBuilder.and(predicates,
                        criteriaBuilder.equal(root.get("active"), true));
            } else {
                // Filter by specific status if provided
                try {
                    boolean isActive = "ACTIVE".equalsIgnoreCase(request.getStatus()) ||
                            "TRUE".equalsIgnoreCase(request.getStatus());
                    predicates = criteriaBuilder.and(predicates,
                            criteriaBuilder.equal(root.get("active"), isActive));
                } catch (Exception e) {
                    log.warn("Invalid company status: {}", request.getStatus());
                }
            }

            // Keyword search (name, description)
            if (request.getKeyword() != null && !request.getKeyword().trim().isEmpty()) {
                String keyword = "%" + request.getKeyword().toLowerCase() + "%";
                var keywordPredicate = criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), keyword),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), keyword)
                );
                predicates = criteriaBuilder.and(predicates, keywordPredicate);
            }

            // Location filter (address)
            if (request.getLocation() != null && !request.getLocation().trim().isEmpty()) {
                String location = "%" + request.getLocation().toLowerCase() + "%";
                predicates = criteriaBuilder.and(predicates,
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("address")), location));
            }

            // Category filter
            if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
                var categoryJoin = root.join("categories");
                predicates = criteriaBuilder.and(predicates,
                        categoryJoin.get("id").in(request.getCategoryIds()));
            }

            // Employee range filter
            if (request.getEmployeeRange() != null && !request.getEmployeeRange().trim().isEmpty()) {
                predicates = criteriaBuilder.and(predicates,
                        criteriaBuilder.equal(root.get("employeeRange"), request.getEmployeeRange()));
            }

            return predicates;
        };
    }

    @Override
    public PageResponse<CompanyDashboardResponse> searchCompanies(CompanySearchRequest request, int page, int size) {
        Specification<Company> spec = buildCompanySearchSpecification(request);
        Sort sort = buildSort(request.getSortBy(), request.getSortDirection());
        Pageable pageable = PageRequest.of(page - 1, size, sort);

        Page<Company> pageData = companyRepository.findAll(spec, pageable);

        return PageResponse.<CompanyDashboardResponse>builder()
                .pageSize(pageData.getSize())
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .Data(pageData.getContent().stream()
                        .map(companyMapper::toCompanyDashboard)
                        .toList())
                .build();
    }


    private Sort buildSort(String sortBy, String sortDirection) {
        Sort.Direction direction = "asc".equalsIgnoreCase(sortDirection)
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        String sortField = "followerCount"; // Default sort by popularity

        if (sortBy != null && !sortBy.trim().isEmpty()) {
            switch (sortBy.toLowerCase()) {
                case "name" -> sortField = "name";
                case "followercount", "followers", "popular", "popularity" -> sortField = "followerCount";
                case "createdat", "created" -> sortField = "createdAt";
                case "updatedat", "updated" -> sortField = "updatedAt";
                case "employeerange", "size" -> sortField = "employeeRange";
                case "location", "address" -> sortField = "address";
                default -> {
                    log.debug("Unknown sort field: {}, using default", sortBy);
                    sortField = "followerCount";
                }
            }
        }

        return Sort.by(direction, sortField);
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new AppException(ErrorCode.LOGO_EMPTY);
        }

        if (file.getSize() > FileType.COMPANY_LOGO.getMaxFileSize()) {
            throw new AppException(ErrorCode.LOGO_TOO_LARGE);
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.trim().isEmpty()) {
            throw new AppException(ErrorCode.LOGO_INVALID_FORMAT);
        }

        if (!isValidLogoFormat(originalFilename)) {
            log.error("Invalid logo format. File: {}, Allowed formats: {}",
                    originalFilename, FileType.COMPANY_LOGO.getAllowedExtensions());
            throw new AppException(ErrorCode.LOGO_INVALID_FORMAT);
        }
    }

    private boolean isValidLogoFormat(String filename) {
        if (filename == null || filename.trim().isEmpty()) {
            return false;
        }

        if (!filename.contains(".")) {
            return false;
        }

        String extension = getFileExtension(filename).toLowerCase();
        boolean isValidExtension = FileType.COMPANY_LOGO.isExtensionAllowed(extension);

        if (!isValidExtension) {
            log.warn("Invalid file extension: {}. Allowed formats: {}",
                    extension, FileType.COMPANY_LOGO.getAllowedExtensions());
        }

        return isValidExtension;
    }
}

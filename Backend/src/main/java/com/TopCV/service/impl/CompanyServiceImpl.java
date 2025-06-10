package com.TopCV.service.impl;

import com.TopCV.dto.request.CompanyCreationRequest;
import com.TopCV.dto.request.CompanySearchRequest;
import com.TopCV.dto.response.*;
import com.TopCV.entity.Company;
import com.TopCV.entity.CompanyCategory;
import com.TopCV.entity.User;
import com.TopCV.exception.AppException;
import com.TopCV.exception.ErrorCode;
import com.TopCV.mapper.CompanyCategoryMapper;
import com.TopCV.mapper.CompanyMapper;
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
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.criteria.Predicate;
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

    @Override
    public PageResponse<CompanyDashboardResponse> searchCompanies(CompanySearchRequest request, int page, int size) {
        Specification<Company> spec = buildSearchSpecification(request);
        
        Sort sort = buildSort(request.getSortBy(), request.getSortDirection());
        Pageable pageable = PageRequest.of(page - 1, size, sort);

        Page<Company> pageData = ((org.springframework.data.jpa.repository.JpaSpecificationExecutor<Company>) companyRepository).findAll(spec, pageable);

        return PageResponse.<CompanyDashboardResponse>builder()
                .pageSize(pageData.getSize())
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .Data(pageData.getContent().stream()
                        .map(companyMapper::toCompanyDashboard)
                        .toList())
                .build();
    }

    private Specification<Company> buildSearchSpecification(CompanySearchRequest request) {
        return (root, query, criteriaBuilder) -> {
            var predicates = criteriaBuilder.conjunction();

            // Only show active companies for public search
            predicates = criteriaBuilder.and(predicates,
                    criteriaBuilder.equal(root.get("active"), true));

            if (request.getKeyword() != null && !request.getKeyword().trim().isEmpty()) {
                String keyword = "%" + request.getKeyword().toLowerCase() + "%";
                var keywordPredicate = criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), keyword),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), keyword)
                );
                predicates = criteriaBuilder.and(predicates, keywordPredicate);
            }

            if (request.getLocation() != null && !request.getLocation().trim().isEmpty()) {
                String location = "%" + request.getLocation().toLowerCase() + "%";
                predicates = criteriaBuilder.and(predicates,
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("address")), location));
            }

            if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
                var categoryJoin = root.join("categories");
                predicates = criteriaBuilder.and(predicates,
                        categoryJoin.get("id").in(request.getCategoryIds()));
            }

            if (request.getEmployeeRange() != null && !request.getEmployeeRange().trim().isEmpty()) {
                String employeeRange = "%" + request.getEmployeeRange().toLowerCase() + "%";
                predicates = criteriaBuilder.and(predicates,
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("employeeRange")), employeeRange));
            }

            return predicates;
        };
    }

    private Sort buildSort(String sortBy, String sortDirection) {
        if (sortBy == null || sortBy.isEmpty()) {
            sortBy = "followerCount"; // Default sort by follower count
        }

        Sort.Direction direction = Sort.Direction.fromString(sortDirection != null ? sortDirection : "DESC");
        return Sort.by(direction, sortBy);
    }
}

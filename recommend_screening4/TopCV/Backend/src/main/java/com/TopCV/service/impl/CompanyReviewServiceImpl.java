package com.TopCV.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import com.TopCV.dto.response.CompanyReviewStatsResponse;
import com.TopCV.dto.response.PageResponse;
import com.TopCV.enums.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.TopCV.dto.request.CompanyReviewRequest;
import com.TopCV.dto.response.CompanyReviewResponse;
import com.TopCV.entity.CompanyReview;
import com.TopCV.entity.User;
import com.TopCV.entity.serializable.CompanyReviewKey;
import com.TopCV.exception.AppException;
import com.TopCV.exception.ErrorCode;
import com.TopCV.mapper.CompanyReviewMapper;
import com.TopCV.repository.CompanyRepository;
import com.TopCV.repository.CompanyReviewRepository;
import com.TopCV.repository.UserRepository;
import com.TopCV.service.CompanyReviewService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CompanyReviewServiceImpl implements CompanyReviewService {
    CompanyReviewRepository reviewRepository;
    UserRepository userRepository;
    CompanyRepository companyRepository;
    CompanyReviewMapper reviewMapper;

    @Override
    @Transactional
    public CompanyReviewResponse addReview(CompanyReviewRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (!companyRepository.existsById(request.getCompanyId())) {
            throw new AppException(ErrorCode.COMPANY_NOT_EXISTED);
        }

        CompanyReviewKey reviewKey = new CompanyReviewKey();
        reviewKey.setUserId(user.getId());
        reviewKey.setCompanyId(request.getCompanyId());

        if (reviewRepository.existsById(reviewKey)) {
            throw new AppException(ErrorCode.REVIEW_ALREADY_EXISTED);
        }

        CompanyReview review = reviewMapper.toEntity(request);
        review.setUser(user);
        review.setId(reviewKey);

        reviewRepository.save(review);
        return reviewMapper.toResponse(review);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<CompanyReviewResponse> getReviewsByCompanyId(Integer companyId, int page, int size) {
        if (!companyRepository.existsById(companyId)) {
            throw new AppException(ErrorCode.COMPANY_NOT_EXISTED);
        }

        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("reviewDate").descending());
        Page<CompanyReview> reviewPage = reviewRepository.findByCompanyId(companyId, pageable);

        return PageResponse.<CompanyReviewResponse>builder()
                .pageSize(reviewPage.getSize())
                .totalPages(reviewPage.getTotalPages())
                .totalElements(reviewPage.getTotalElements())
                .data(reviewPage.getContent().stream()
                        .map(reviewMapper::toResponse)
                        .toList())
                .build();
    }

    @Override
    @Transactional
    public CompanyReviewResponse updateReview(CompanyReviewRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (!companyRepository.existsById(request.getCompanyId())) {
            throw new AppException(ErrorCode.COMPANY_NOT_EXISTED);
        }

        CompanyReviewKey reviewKey = new CompanyReviewKey();
        reviewKey.setUserId(user.getId());
        reviewKey.setCompanyId(request.getCompanyId());

        CompanyReview review = reviewRepository.findById(reviewKey)
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_EXISTED));

        review.setRateStar(request.getRateStar());
        review.setReviewText(request.getReviewText());

        reviewRepository.save(review);

        return reviewMapper.toResponse(review);
    }

    @Override
    public void deleteReview(String userId, Integer companyId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (!companyRepository.existsById(companyId)) {
            throw new AppException(ErrorCode.COMPANY_NOT_EXISTED);
        }

        CompanyReviewKey reviewKey = new CompanyReviewKey();
        reviewKey.setUserId(userId);
        reviewKey.setCompanyId(companyId);

        if (!reviewRepository.existsById(reviewKey)) {
            throw new AppException(ErrorCode.REVIEW_NOT_EXISTED);
        }

        if (user.getRole() != Role.ADMIN) {
            if (!userId.equals(user.getId())) {
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }
        }

        reviewRepository.deleteById(reviewKey);
    }

    @Override
    @Transactional(readOnly = true)
    public CompanyReviewResponse getUserReviewForCompany(Integer companyId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        CompanyReviewKey reviewKey = new CompanyReviewKey();
        reviewKey.setUserId(user.getId());
        reviewKey.setCompanyId(companyId);

        CompanyReview review = reviewRepository.findById(reviewKey)
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_EXISTED));

        return reviewMapper.toResponse(review);
    }

    @Override
    @Transactional(readOnly = true)
    public CompanyReviewStatsResponse getReviewStats(Integer companyId) {
        if (!companyRepository.existsById(companyId)) {
            throw new AppException(ErrorCode.COMPANY_NOT_EXISTED);
        }

        Double avgRating = reviewRepository.getAverageRatingByCompanyId(companyId);
        Integer reviewCount = reviewRepository.countByCompanyId(companyId);

        return CompanyReviewStatsResponse.builder()
                .averageRating(avgRating != null ? avgRating : 0.0)
                .totalReviews(reviewCount != null ? reviewCount : 0)
                .build();
    }
}
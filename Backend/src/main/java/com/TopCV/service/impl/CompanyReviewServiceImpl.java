package com.TopCV.service.impl;

import java.util.List;
import java.util.stream.Collectors;

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
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (!companyRepository.existsById(request.getCompanyId())) {
            throw new AppException(ErrorCode.COMPANY_NOT_EXISTS);
        }

        CompanyReviewKey reviewKey = new CompanyReviewKey();
        reviewKey.setUserId(user.getId());
        reviewKey.setCompanyId(request.getCompanyId());

        if (reviewRepository.existsById(reviewKey)) {
            throw new AppException(ErrorCode.REVIEW_ALREADY_EXISTS);
        }

        CompanyReview review = reviewMapper.toEntity(request);
        review.setUser(user);
        review.setId(reviewKey);

        reviewRepository.save(review);
        return reviewMapper.toResponse(review);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CompanyReviewResponse> getReviewsByCompanyId(Integer companyId) {
        if (!companyRepository.existsById(companyId)) {
            throw new AppException(ErrorCode.COMPANY_NOT_EXISTS);
        }

        List<CompanyReview> reviews = reviewRepository.findByCompanyId(companyId);
        return reviews.stream()
                .map(reviewMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void updateReview(Integer id, CompanyReviewRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (!companyRepository.existsById(request.getCompanyId())) {
            throw new AppException(ErrorCode.COMPANY_NOT_EXISTS);
        }

        CompanyReviewKey reviewKey = new CompanyReviewKey();
        reviewKey.setUserId(id);
        reviewKey.setCompanyId(request.getCompanyId());

        CompanyReview review = reviewRepository.findById(reviewKey)
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_EXISTS));

        review.setRateStar(request.getRateStar());
        review.setReviewText(request.getReviewText());

        reviewRepository.save(review);
    }
}
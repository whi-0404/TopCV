package com.TopCV.mapper.Impl;

import org.springframework.stereotype.Component;
import com.TopCV.dto.request.CompanyReviewRequest;
import com.TopCV.dto.response.CompanyReviewResponse;
import com.TopCV.entity.Company;
import com.TopCV.entity.CompanyReview;
import com.TopCV.entity.User;
import com.TopCV.mapper.CompanyReviewMapper;
import com.TopCV.repository.CompanyRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class CompanyReviewMapperImpl implements CompanyReviewMapper {

    public CompanyReview toEntity(CompanyReviewRequest request) {
        if (request == null) {
            return null;
        } else {
            CompanyReview.CompanyReviewBuilder review = CompanyReview.builder();
            review.reviewText(request.getReviewText());
            review.rateStar(request.getRateStar());
            review.company(Company.builder().id(request.getCompanyId()).build());
            return review.build();
        }
    }

    public CompanyReviewResponse toResponse(CompanyReview companyReview) {
        if (companyReview == null) {
            return null;
        } else {
            CompanyReviewResponse.CompanyReviewResponseBuilder response = CompanyReviewResponse.builder();
            response.userId(this.reviewUserId(companyReview));
            response.fullName(this.fullName(companyReview));
            response.reviewText(companyReview.getReviewText());
            response.rateStar(companyReview.getRateStar());
            response.reviewDate(companyReview.getReviewDate());
            return response.build();
        }
    }

    public void updateReview(CompanyReview review, CompanyReviewRequest request) {
        if (request == null) {
            return;
        }
        if (request.getReviewText() != null) {
            review.setReviewText(request.getReviewText());
        }
        if (request.getRateStar() != null) {
            review.setRateStar(request.getRateStar());
        }
    }

    private String reviewUserId(CompanyReview review) {
        if (review == null) {
            return null;
        } else {
            User user = review.getUser();
            if (user == null) {
                return null;
            } else {
                return user.getId();
            }
        }
    }

    private String fullName(CompanyReview review) {
        if (review == null) {
            return null;
        } else {
            User user = review.getUser();
            if (user == null) {
                return null;
            } else {
                return user.getFullname();
            }
        }
    }
}

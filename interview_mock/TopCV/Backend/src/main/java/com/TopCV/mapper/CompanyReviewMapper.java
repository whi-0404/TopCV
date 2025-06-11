package com.TopCV.mapper;

import org.mapstruct.Mapping;
import com.TopCV.dto.request.CompanyReviewRequest;
import com.TopCV.dto.response.CompanyReviewResponse;
import com.TopCV.entity.CompanyReview;

public interface CompanyReviewMapper {
    CompanyReview toEntity(CompanyReviewRequest request);

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "companyId", source = "company.id")
    CompanyReviewResponse toResponse(CompanyReview review);

    void updateReview(CompanyReview review, CompanyReviewRequest request);
}

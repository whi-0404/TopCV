package com.TopCV.service;

import java.util.List;
import com.TopCV.dto.request.CompanyReviewRequest;
import com.TopCV.dto.response.CompanyReviewResponse;
import com.TopCV.dto.response.CompanyReviewStatsResponse;
import com.TopCV.dto.response.PageResponse;

public interface CompanyReviewService {
    CompanyReviewResponse addReview(CompanyReviewRequest request);
    
    PageResponse<CompanyReviewResponse> getReviewsByCompanyId(Integer companyId, int page, int size);

    CompanyReviewResponse updateReview(CompanyReviewRequest request);

    CompanyReviewResponse getUserReviewForCompany(Integer companyId);

    void deleteReview(String userId, Integer companyId);

    CompanyReviewStatsResponse getReviewStats(Integer companyId);
}

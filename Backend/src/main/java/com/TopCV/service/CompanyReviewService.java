package com.TopCV.service;

import java.util.List;
import com.TopCV.dto.request.CompanyReviewRequest;
import com.TopCV.dto.response.CompanyReviewResponse;

public interface CompanyReviewService {
    CompanyReviewResponse addReview(CompanyReviewRequest request);
    
    List<CompanyReviewResponse> getReviewsByCompanyId(Integer companyId);
    
    void updateReview(Integer id, CompanyReviewRequest request);
}

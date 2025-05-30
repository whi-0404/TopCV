package com.TopCV.service;

import java.util.List;
import com.TopCV.dto.request.FollowCompanyRequest;
import com.TopCV.dto.response.FollowCompanyResponse;
import jakarta.persistence.criteria.CriteriaBuilder;

public interface FollowCompanyService {
    FollowCompanyResponse addFollow(FollowCompanyRequest request);
    
    List<FollowCompanyResponse> getFollowsByCompanyId(Integer companyId);
    
//    List<FollowCompanyResponse> getFollowsByUserId(Integer userId);
    
    void unfollow(FollowCompanyRequest request);
}

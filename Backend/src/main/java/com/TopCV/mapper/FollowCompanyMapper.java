package com.TopCV.mapper;

import com.TopCV.dto.request.FollowCompanyRequest;
import com.TopCV.dto.response.FollowCompanyResponse;
import com.TopCV.entity.FollowCompany;

public interface FollowCompanyMapper {
    FollowCompany toEntity(FollowCompanyRequest request);
    FollowCompanyResponse toResponse(FollowCompany followCompany);
}

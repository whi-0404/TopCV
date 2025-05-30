package com.TopCV.mapper.Impl;

import org.springframework.stereotype.Component;
import com.TopCV.dto.request.FollowCompanyRequest;
import com.TopCV.dto.response.FollowCompanyResponse;
import com.TopCV.entity.Company;
import com.TopCV.entity.FollowCompany;
import com.TopCV.entity.User;
import com.TopCV.mapper.FollowCompanyMapper;
import com.TopCV.repository.CompanyRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class FollowCompanyMapperImpl implements FollowCompanyMapper {
    CompanyRepository companyRepository;

    public FollowCompany toEntity(FollowCompanyRequest request) {
        if (request == null) {
            return null;
        } else {
            FollowCompany.FollowCompanyBuilder follow = FollowCompany.builder();
            follow.company(Company.builder().id(request.getCompanyId()).build());
            return follow.build();
        }
    }

    public FollowCompanyResponse toResponse(FollowCompany followCompany) {
        if (followCompany == null) {
            return null;
        } else {
            FollowCompanyResponse.FollowCompanyResponseBuilder response = FollowCompanyResponse.builder();
            response.userId(this.followUserId(followCompany));
            response.companyId(followCompany.getCompany().getId());
            return response.build();
        }
    }

    private Integer followUserId(FollowCompany follow) {
        if (follow == null) {
            return null;
        } else {
            User user = follow.getUser();
            if (user == null) {
                return null;
            } else {
                return user.getId();
            }
        }
    }
}

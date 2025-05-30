package com.TopCV.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.TopCV.dto.request.FollowCompanyRequest;
import com.TopCV.dto.response.FollowCompanyResponse;
import com.TopCV.entity.FollowCompany;
import com.TopCV.entity.User;
import com.TopCV.entity.serializable.FollowCompanyKey;
import com.TopCV.exception.AppException;
import com.TopCV.exception.ErrorCode;
import com.TopCV.mapper.FollowCompanyMapper;
import com.TopCV.repository.CompanyRepository;
import com.TopCV.repository.FollowCompanyRepository;
import com.TopCV.repository.UserRepository;
import com.TopCV.service.FollowCompanyService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class FollowCompanyServiceImpl implements FollowCompanyService {
    private final FollowCompanyRepository followCompanyRepository;
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final FollowCompanyMapper followCompanyMapper;

    @Transactional
    public FollowCompanyResponse addFollow(FollowCompanyRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (!companyRepository.existsById(request.getCompanyId()))
            throw new AppException(ErrorCode.COMPANY_NOT_EXISTED);

        FollowCompanyKey followKey = new FollowCompanyKey(user.getId(), request.getCompanyId());

        if (followCompanyRepository.existsById(followKey)) {
            throw new AppException(ErrorCode.FOLLOW_EXISTED);
        }

        FollowCompany follow = followCompanyMapper.toEntity(request);
        follow.setId(followKey);
        follow.setUser(user);

        followCompanyRepository.save(follow);
        return followCompanyMapper.toResponse(follow);
    }

    @Transactional(readOnly = true)
    public List<FollowCompanyResponse> getFollowsByCompanyId(Integer companyId) {
        if (!companyRepository.existsById(companyId)) {
            throw new AppException(ErrorCode.COMPANY_NOT_EXISTED);
        }

        List<FollowCompany> follows = followCompanyRepository.findByCompanyId(companyId);
        return follows.stream()
                .map(followCompanyMapper::toResponse)
                .collect(Collectors.toList());
    }

//    @Transactional(readOnly = true)
//    public List<FollowCompanyResponse> getFollowsByUserId(Integer userId) {
//        if (!userRepository.existsById(userId)) {
//            throw new AppException(ErrorCode.USER_NOT_EXISTED);
//        }
//
//        List<FollowCompany> follows = followCompanyRepository.findByUserId(userId);
//        return follows.stream()
//                .map(followCompanyMapper::toResponse)
//                .collect(Collectors.toList());
//    }

    @Transactional
    public void unfollow(FollowCompanyRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (!companyRepository.existsById(request.getCompanyId()))
            throw new AppException(ErrorCode.COMPANY_NOT_EXISTED);

        FollowCompanyKey followKey = new FollowCompanyKey(user.getId(), request.getCompanyId());
        FollowCompany follow = followCompanyRepository.findById(followKey)
                .orElseThrow(() -> new AppException(ErrorCode.FOLLOW_NOT_EXISTED));

        followCompanyRepository.delete(follow);
    }
}

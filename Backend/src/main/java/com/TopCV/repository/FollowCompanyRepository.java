package com.TopCV.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.TopCV.entity.FollowCompany;
import com.TopCV.entity.serializable.FollowCompanyKey;

@Repository
public interface FollowCompanyRepository extends JpaRepository<FollowCompany, FollowCompanyKey> {
    List<FollowCompany> findByCompanyId(Integer companyId);

    List<FollowCompany> findByUserId(Integer userId);
}

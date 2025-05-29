package com.TopCV.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.TopCV.entity.CompanyReview;
import com.TopCV.entity.serializable.CompanyReviewKey;

@Repository
public interface CompanyReviewRepository extends JpaRepository<CompanyReview, CompanyReviewKey> {
    List<CompanyReview> findByCompanyId(Integer companyId);
    
    boolean existsById(CompanyReviewKey id);
    
    Optional<CompanyReview> findById(CompanyReviewKey id);
}

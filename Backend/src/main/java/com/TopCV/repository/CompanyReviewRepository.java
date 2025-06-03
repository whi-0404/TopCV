package com.TopCV.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.TopCV.entity.CompanyReview;
import com.TopCV.entity.serializable.CompanyReviewKey;

@Repository
public interface CompanyReviewRepository extends JpaRepository<CompanyReview, CompanyReviewKey> {
    Page<CompanyReview> findByCompanyId(Integer companyId, Pageable pageable);
    
    boolean existsById(CompanyReviewKey id);
    
    Optional<CompanyReview> findById(CompanyReviewKey id);

    @Query("SELECT AVG(r.rateStar) FROM CompanyReview r WHERE r.company.id = :companyId")
    Double getAverageRatingByCompanyId(Integer companyId);

    @Query("SELECT COUNT(r.id) FROM CompanyReview r WHERE r.company.id = :companyId")
    Integer countByCompanyId(Integer companyId);
}

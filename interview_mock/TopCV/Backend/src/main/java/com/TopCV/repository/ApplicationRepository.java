package com.TopCV.repository;

import com.TopCV.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Integer> {
    boolean existsByUserIdAndJobPostId(String userId, Integer jobPostId);
    Page<Application> findByUserId(String userId, Pageable pageable);
    Page<Application> findByJobPostId(Integer jobPostId, Pageable pageable);
    
    @Query("SELECT a FROM Application a WHERE a.employer.id = :employerId")
    Page<Application> findAllByEmployer(@Param("employerId") String employerId, Pageable pageable);
    
    @Query("SELECT a FROM Application a WHERE LOWER(a.user.fullname) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(a.jobPost.title) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Application> searchApplications(@Param("keyword") String keyword, Pageable pageable);
}

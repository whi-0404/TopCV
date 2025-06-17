package com.TopCV.repository;

import com.TopCV.entity.Application;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Integer> {
    boolean existsByUserIdAndJobPostId(String userId, Integer jobPostId);

    Page<Application> findByUserId(String userId, Pageable pageable);

    Page<Application> findByJobPostId(Integer jobPostId, Pageable pageable);

    @Query("Select a from Application a WHERE a.employer.id= :employerId")
    Page<Application> findAllByEmployer(@Param("employerId") String employerId, Pageable pageable);

    @Query("SELECT a FROM Application a WHERE " +
            "LOWER(a.user.fullname) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(a.user.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(a.jobPost.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(a.jobPost.company.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Application> searchApplicationsAdmin(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT a FROM Application a WHERE " +
            "a.employer.id= :employerId AND " +
            "LOWER(a.user.fullname) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(a.user.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(a.jobPost.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(a.jobPost.company.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Application> searchApplicationsEmployer(@Param("employerId") String employerId
            ,@Param("keyword") String keyword, Pageable pageable);
}

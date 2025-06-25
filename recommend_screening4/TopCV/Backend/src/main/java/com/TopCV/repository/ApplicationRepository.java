package com.TopCV.repository;

import com.TopCV.entity.Application;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

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
    Page<Application> searchApplications(@Param("keyword") String keyword, Pageable pageable);

    // Fetch application with resume using JOIN FETCH to avoid lazy loading
    @Query("SELECT a FROM Application a " +
           "LEFT JOIN FETCH a.resumes " +
           "LEFT JOIN FETCH a.jobPost jp " +
           "LEFT JOIN FETCH jp.company " +
           "WHERE a.id = :applicationId")
    Optional<Application> findByIdWithResume(@Param("applicationId") Integer applicationId);
}

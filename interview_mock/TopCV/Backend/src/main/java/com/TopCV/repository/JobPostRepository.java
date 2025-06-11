package com.TopCV.repository;

import com.TopCV.entity.JobPost;
import com.TopCV.enums.JobPostStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobPostRepository extends JpaRepository<JobPost, Integer> {
    Page<JobPost> findByCompanyId(Integer companyId, Pageable pageable);

    Page<JobPost> findByCompanyIdAndStatus(Integer companyId, JobPostStatus status, Pageable pageable);
    
    // Find active job posts from active companies
    Page<JobPost> findByStatusAndCompanyActiveTrue(JobPostStatus status, Pageable pageable);
    
    // Search job posts with multiple criteria
    @Query("SELECT j FROM JobPost j WHERE " +
           "j.status = :status AND j.company.active = true AND " +
           "(:keyword IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:jobTypeId IS NULL OR j.type.id = :jobTypeId) AND " +
           "(:jobLevelId IS NULL OR j.level.id = :jobLevelId) AND " +
           "(:skillIds IS NULL OR EXISTS (SELECT s FROM j.skills s WHERE s.id IN :skillIds))")
    Page<JobPost> searchJobPosts(@Param("keyword") String keyword,
                                @Param("location") String location,
                                @Param("jobTypeId") Integer jobTypeId,
                                @Param("jobLevelId") Integer jobLevelId,
                                @Param("skillIds") List<Integer> skillIds,
                                @Param("status") JobPostStatus status,
                                Pageable pageable);
}

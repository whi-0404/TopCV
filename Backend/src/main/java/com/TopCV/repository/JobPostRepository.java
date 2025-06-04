package com.TopCV.repository;

import com.TopCV.entity.JobPost;
import com.TopCV.enums.JobPostStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobPostRepository extends JpaRepository<JobPost, Integer> {
    Page<JobPost> findByCompanyId(Integer companyId, Pageable pageable);

    Page<JobPost> findByCompanyIdAndStatus(Integer companyId, JobPostStatus status, Pageable pageable);
}

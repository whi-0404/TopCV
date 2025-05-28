package com.TopCV.repository;

import com.TopCV.entity.JobCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobCategoryRepository extends JpaRepository<JobCategory, Integer> {
    boolean existsByName(String name);
}
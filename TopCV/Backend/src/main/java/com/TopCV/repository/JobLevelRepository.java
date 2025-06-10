package com.TopCV.repository;

import com.TopCV.entity.JobLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobLevelRepository extends JpaRepository<JobLevel, Integer> {
    boolean existsByName(String name);
    java.util.Optional<JobLevel> findByName(String name);
}
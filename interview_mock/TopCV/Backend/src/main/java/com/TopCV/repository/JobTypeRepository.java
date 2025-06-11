package com.TopCV.repository;

import com.TopCV.entity.JobType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobTypeRepository extends JpaRepository<JobType, Integer> {
    boolean existsByName(String name);
    java.util.Optional<JobType> findByName(String name);
}
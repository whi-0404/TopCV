package com.TopCV.repository;

import com.TopCV.entity.CompanyCategory;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface CompanyCategoryRepository extends JpaRepository<CompanyCategory, Integer> {
    boolean existsByName(String name);
}

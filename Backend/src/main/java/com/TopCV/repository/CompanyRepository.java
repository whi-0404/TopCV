package com.TopCV.repository;

import com.TopCV.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Integer> {
    List<Company> findAllByOrderByNameAsc();
    boolean existsByName(String name);
}
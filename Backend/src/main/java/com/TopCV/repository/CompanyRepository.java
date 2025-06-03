package com.TopCV.repository;

import com.TopCV.entity.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Integer> {
    List<Company> findAllByOrderByNameAsc();
    boolean existsByName(String name);

    Page<Company> findAllByActiveTrue(Pageable pageable);
}
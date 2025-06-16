package com.TopCV.repository;

import com.TopCV.entity.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Integer>, JpaSpecificationExecutor<Company> {
    List<Company> findAllByOrderByNameAsc();
    boolean existsByName(String name);

    Page<Company> findAllByActiveTrue(Pageable pageable);

    Optional<Company> findByUserId(String userId);
}
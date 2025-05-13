package com.example.demo.repository;

import com.example.demo.entity.CompanyImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyImageRepository extends JpaRepository<CompanyImage, Long> {
} 
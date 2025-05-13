package com.example.demo.repository;

import com.example.demo.entity.SeekerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SeekerProfileRepository extends JpaRepository<SeekerProfile, Long> {
} 
package com.TopCV.repository;

import com.TopCV.entity.Resumes;
import com.TopCV.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResumeRepository extends JpaRepository<Resumes, Integer> {
    List<Resumes> findByUser(User user);
}

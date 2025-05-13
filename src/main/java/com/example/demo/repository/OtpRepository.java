package com.example.demo.repository;

import com.example.demo.entity.OtpEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<OtpEntity, Long> {
    Optional<OtpEntity> findByEmailAndOtpAndUsedFalse(String email, String otp);
    
    @Modifying
    @Query("DELETE FROM OtpEntity o WHERE o.expiryTime < ?1 OR o.used = true")
    void deleteExpiredOtps(LocalDateTime now);
} 
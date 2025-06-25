package com.TopCV.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "cv_screening_results")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CVScreeningResult {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "job_id", nullable = false)
    private Integer jobId;
    
    @Column(name = "candidate_name")
    private String candidateName;
    
    @Column(name = "candidate_email")
    private String candidateEmail;
    
    @Column(name = "cv_file_name")
    private String cvFileName;
    
    @Column(name = "candidate_decision", nullable = false)
    private String candidateDecision; // PASS, FAIL, REVIEW
    
    @Column(name = "overall_score")
    private Double overallScore;
    
    @Column(name = "matching_points", columnDefinition = "TEXT")
    private String matchingPoints; // JSON string
    
    @Column(name = "not_matching_points", columnDefinition = "TEXT")
    private String notMatchingPoints; // JSON string
    
    @Column(name = "recommendation", columnDefinition = "TEXT")
    private String recommendation;
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "status", nullable = false)
    private String status = "NEW"; // NEW, REVIEWED, APPROVED, REJECTED
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Relations
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", insertable = false, updatable = false)
    private JobPost jobPost;
} 
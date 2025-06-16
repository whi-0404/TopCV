package com.TopCV.entity;

import com.TopCV.enums.ApplicationStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "applications")
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employer_id")
    User employer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id")
    JobPost jobPost;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id")
    Resume resumes;

    @Enumerated(EnumType.STRING)
    ApplicationStatus status;

    @Column(name = "cover_letter", columnDefinition = "TEXT")
    String coverLetter;

    @Column(name = "created_at")
    LocalDateTime createdAt;
    
    // CV Screening Results - Lưu kết quả AI screening
    @Column(name = "screening_decision")
    String screeningDecision; // PASS, FAIL, REVIEW
    
    @Column(name = "screening_score")
    Double screeningScore; // 0-5.0
    
    @Column(name = "matching_points", columnDefinition = "TEXT")
    String matchingPoints; // JSON array string
    
    @Column(name = "not_matching_points", columnDefinition = "TEXT") 
    String notMatchingPoints; // JSON array string
    
    @Column(name = "screening_recommendation", columnDefinition = "TEXT")
    String screeningRecommendation;
    
    @Column(name = "screened_at")
    LocalDateTime screenedAt;
    
    @Column(name = "cv_file_name")
    String cvFileName;

    @PrePersist
    void createdAt() {
        this.createdAt = LocalDateTime.now();
    }
}

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
    @JoinColumn(name = "job_id")
    JobPost jobPost;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id")
    Resumes resumes;

    ApplicationStatus status;

    @Column(name = "created_at")
    LocalDateTime createdAt;

    @PrePersist
    void createdAt() {
        this.createdAt = LocalDateTime.now();
    }
}

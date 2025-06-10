package com.TopCV.entity;

import com.TopCV.enums.JobPostStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "job_posts")
public class JobPost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    String title;

    @Column(columnDefinition = "TEXT")
    String description;

    @Column(columnDefinition = "TEXT")
    String requirements;

    @Column(columnDefinition = "TEXT")
    String benefits;

    String location;

    @Column(name = "working_time", columnDefinition = "TEXT")
    String workingTime;

    String salary;

    @Column(name = "experience_required")
    String experienceRequired;

    LocalDate deadline;

    @Column(name = "applied_count")
    @Builder.Default
    Integer appliedCount = 0;

    @Column(name = "hiring_quota")
    @Builder.Default
    Integer hiringQuota = 1;

    @Enumerated(EnumType.STRING)
    JobPostStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    Company company;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_type_id")
    JobType type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_level_id")
    JobLevel level;

    @ManyToMany
    @JoinTable(
            name = "job_skills",
            joinColumns = @JoinColumn(name = "job_id"),
            inverseJoinColumns = @JoinColumn(name = "skill_id"))
    List<Skill> skills = new ArrayList<>();

    @Column(name = "created_at")
    LocalDateTime createdAt;

    @Column(name = "updated_at")
    LocalDateTime updatedAt;

    @PrePersist
    void createdAt() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    @PreUpdate
    void updatedAt() {
        this.updatedAt = LocalDateTime.now();
    }
}

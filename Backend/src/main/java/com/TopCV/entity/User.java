package com.TopCV.entity;

import com.TopCV.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "users")
public class User {
        @Id
        @GeneratedValue(strategy = GenerationType.UUID)
        String id;

        @Column(name = "user_name", unique = true)
        String userName;

        String password;

        @Column(unique = true)
        String email;

        @Column(name = "full_name")
        String fullname;

        String phone;

        String address;

        String avt;

        @Column(name = "created_at")
        LocalDateTime createdAt;

        @Column(name = "updated_at")
        LocalDateTime updatedAt;

        @Column(name = "is_active")
        @Builder.Default
        boolean active = true;

        @Column(name = "is_email_verified")
        boolean emailVerified;

        LocalDateTime dob;

//        @OneToOne(mappedBy = "user")
//        Company company;

        @ManyToMany
        @JoinTable(
                name = "favor_job",
                joinColumns = @JoinColumn(name = "user_id"),
                inverseJoinColumns = @JoinColumn(name = "job_id"))
        List<JobPost> favoriteJobs = new ArrayList<>();

        @ManyToMany
        @JoinTable(
                name = "follow_company",
                joinColumns = @JoinColumn(name = "user_id"),
                inverseJoinColumns = @JoinColumn(name = "company_id"))
        List<Company> followCompanies = new ArrayList<>();

        @OneToMany(mappedBy = "user")
        List<Application> applications;

        @OneToMany(mappedBy = "user")
        List<Resume> resumes;

        @Enumerated(EnumType.STRING)
        Role role;

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

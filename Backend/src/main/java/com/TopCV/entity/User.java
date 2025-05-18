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
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        int id;

        @Column(name = "user_name")
        String userName;

        String password;

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
        boolean isActive;

        LocalDateTime dob;

        @OneToOne(mappedBy = "user")
        Company company;

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
        List<Resumes> resumes;

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

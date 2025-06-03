package com.TopCV.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
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
@Table(name = "companies")
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    String name;

    @Column(columnDefinition = "TEXT")
    String description;

    @Column(name = "logo_url")
    String logo;

    @Column(name = "website_url")
    String website;

    @Column(name = "employee_range")
    String employeeRange;

    @Column(name = "follower_count")
    int followerCount;

    String address;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    User user;

    @OneToMany(mappedBy = "company")
    List<JobPost> jobPosts;

    @Column(name = "is_active")
    @Builder.Default
    Boolean active = false;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "categories_companies",
            joinColumns = @JoinColumn(name = "company_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id"))
    List<CompanyCategory> categories = new ArrayList<>();

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

package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Company")
public class Company {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "company_id")
    private Long companyId;
    
    @ManyToOne
    @JoinColumn(name = "registered_by_user_id", nullable = false)
    private UserAccount registeredByUser;
    
    @Column(name = "company_name", nullable = false, unique = true)
    private String companyName;
    
    @Column(name = "profile_description")
    private String profileDescription;
    
    @Column(name = "establishment_date")
    private LocalDate establishmentDate;
    
    @Column(name = "company_website_url")
    private String companyWebsiteUrl;
    
    @Column(name = "company_email", nullable = false)
    private String companyEmail;
    
    @Column(name = "company_logo_url")
    private String companyLogoUrl;
    
    @Column(name = "address")
    private String address;
    
    @Column(name = "company_size")
    private String companySize;
    
    @Column(name = "industry")
    private String industry;
    
    @Column(name = "tax_code")
    private String taxCode;
    
    @Column(name = "status")
    private String status = "Chờ duyệt";
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL)
    private List<CompanyImage> images;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
} 
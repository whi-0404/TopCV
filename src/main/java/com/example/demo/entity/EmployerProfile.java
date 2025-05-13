package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "employer_profile")
public class EmployerProfile {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "user_account_id", nullable = false)
    private UserAccount userAccount;
    
    @Column(name = "company_name", nullable = false)
    private String companyName;
    
    @Column(name = "company_size")
    private String companySize;
    
    @Column(name = "industry")
    private String industry;
    
    @Column(name = "company_location")
    private String companyLocation;
    
    @Column(name = "company_website")
    private String companyWebsite;
    
    @Column(name = "company_description")
    private String companyDescription;
    
    @Column(name = "company_logo")
    private String companyLogo;
    
    @Column(name = "tax_code")
    private String taxCode;
} 
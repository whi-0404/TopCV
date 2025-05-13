package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Seeker_Profile")
public class SeekerProfile {

    @Id
    @Column(name = "user_account_id")
    private Long userAccountId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_account_id")
    private UserAccount userAccount;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(name = "current_salary", precision = 15, scale = 2)
    private BigDecimal currentSalary;

    @Column(name = "is_annually_monthly", length = 1)
    private Boolean isAnnuallyMonthly;

    @Column(name = "currency", length = 10)
    private String currency;

    @Column(name = "email_contact")
    private String emailContact;

    @Column(name = "file_cv")
    private String fileCV;

    @Column(name = "bio")
    private String bio;
} 
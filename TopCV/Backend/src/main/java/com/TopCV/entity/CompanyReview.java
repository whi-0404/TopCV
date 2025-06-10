package com.TopCV.entity;

import com.TopCV.entity.serializable.CompanyReviewKey;
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
@Table(name = "company_reviews")
public class CompanyReview {
    @EmbeddedId
    CompanyReviewKey id;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    User user;

    @ManyToOne
    @MapsId("companyId")
    @JoinColumn(name = "company_id", insertable = false, updatable = false)
    Company company;

    @Column(name = "review_text")
    String reviewText;

    @Column(name = "rate_star")
    int rateStar;

    @Column(name = "review_date")
    LocalDateTime reviewDate;

    @PrePersist
    void createdAt() {
        this.reviewDate = LocalDateTime.now();
    }
}

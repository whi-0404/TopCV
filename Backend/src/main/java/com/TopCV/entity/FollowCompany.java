package com.TopCV.entity;

import com.TopCV.entity.serializable.FollowCompanyKey;
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
@Table(name = "follow_companies")
public class FollowCompany {
    @EmbeddedId
    FollowCompanyKey id;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    User user;

    @ManyToOne
    @MapsId("companyId")
    @JoinColumn(name = "company_id", insertable = false, updatable = false)
    Company company;
}

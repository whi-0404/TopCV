package com.TopCV.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CompanySearchRequest {
    String keyword;
    String location;
    List<Integer> categoryIds;
    String employeeRange;
    String sortBy; // "name", "followerCount", "jobCount", "createdAt"
    String sortDirection; // "ASC", "DESC"
} 
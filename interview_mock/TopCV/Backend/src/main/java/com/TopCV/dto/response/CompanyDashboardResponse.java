package com.TopCV.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CompanyDashboardResponse {
    Integer id;
    String name;
    String logo;
    String description;
    int jobCount;
    List<CompanyCategoryResponse> categories;
}

package com.TopCV.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CompanyResponse {
    private Integer id;
    private String name;
    private String description;
    private String logo;
    private String website;
    private String employeeRange;
    private Integer followerCount;
    private String address;
}
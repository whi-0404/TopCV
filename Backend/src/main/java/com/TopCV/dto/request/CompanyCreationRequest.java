package com.TopCV.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CompanyCreationRequest {
    private String name;
    private String description;
    private String website;
    private String employeeRange;
    private String address;
    private List<Integer> categoryIds;
}
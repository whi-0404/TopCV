package com.TopCV.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CompanyCreationRequest {
    @NotNull
    @Size(max = 255)
    private String name;

    @Size(max = 1000)
    private String description;
    private String logo;
    private String website;

    @NotNull
    private String employeeRange;

    @Size(max = 500)
    private String address;
}
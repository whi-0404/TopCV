package com.TopCV.dto.request.Application;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ApplicationStatusUpdateRequest {
    @NotNull(message = "STATUS_REQUIRED")
    String status;
//
//    String feedback;
//    String notes;

    // For bulk operations
    List<Integer> applicationIds;
}

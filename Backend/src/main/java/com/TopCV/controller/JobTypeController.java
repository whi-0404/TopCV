package com.TopCV.controller;

import com.TopCV.dto.request.JobTypeRequest;
import com.TopCV.dto.response.ApiResponse;
import com.TopCV.dto.response.JobTypeResponse;
import com.TopCV.service.JobTypeService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/job-types")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class JobTypeController {

    JobTypeService jobTypeService;

    @PostMapping
    ApiResponse<JobTypeResponse> createJobType(@RequestBody @Valid JobTypeRequest request) {
        return ApiResponse.<JobTypeResponse>builder()
                .result(jobTypeService.createJobType(request))
                .build();
    }

    @GetMapping
    ApiResponse<List<JobTypeResponse>> getAllJobTypes() {
        return ApiResponse.<List<JobTypeResponse>>builder()
                .result(jobTypeService.getAllJobTypes())
                .build();
    }

    @GetMapping("/{type_id}")
    ApiResponse<JobTypeResponse> getJobType(@PathVariable("type_id") Integer typeId) {
        return ApiResponse.<JobTypeResponse>builder()
                .result(jobTypeService.getJobTypeById(typeId))
                .build();
    }

    @PutMapping("/{type_id}")
    ApiResponse<JobTypeResponse> updateJobType(
            @PathVariable("type_id") Integer typeId,
            @RequestBody @Valid JobTypeRequest request) {
        return ApiResponse.<JobTypeResponse>builder()
                .result(jobTypeService.updateJobType(typeId, request))
                .build();
    }

    @DeleteMapping("/{type_id}")
    ApiResponse<String> deleteJobType(@PathVariable("type_id") Integer typeId) {
        jobTypeService.deleteJobType(typeId);
        return ApiResponse.<String>builder()
                .result("Job Type has been deleted")
                .build();
    }
}
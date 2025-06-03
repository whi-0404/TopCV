package com.TopCV.controller;

import com.TopCV.dto.request.JobLevelRequest;
import com.TopCV.dto.response.ApiResponse;
import com.TopCV.dto.response.JobLevelResponse;
import com.TopCV.service.JobLevelService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/job-levels")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class JobLevelController {

    JobLevelService jobLevelService;

    @PostMapping
    ApiResponse<JobLevelResponse> createJobLevel(@RequestBody @Valid JobLevelRequest request) {
        return ApiResponse.<JobLevelResponse>builder()
                .result(jobLevelService.createJobLevel(request))
                .build();
    }

    @GetMapping
    ApiResponse<List<JobLevelResponse>> getAllJobLevels() {
        return ApiResponse.<List<JobLevelResponse>>builder()
                .result(jobLevelService.getAllJobLevels())
                .build();
    }

    @GetMapping("/{level_id}")
    ApiResponse<JobLevelResponse> getJobLevel(@PathVariable("level_id") Integer levelId) {
        return ApiResponse.<JobLevelResponse>builder()
                .result(jobLevelService.getJobLevelById(levelId))
                .build();
    }

    @PutMapping("/{level_id}")
    ApiResponse<JobLevelResponse> updateJobLevel(
            @PathVariable("level_id") Integer levelId,
            @RequestBody @Valid JobLevelRequest request) {
        return ApiResponse.<JobLevelResponse>builder()
                .result(jobLevelService.updateJobLevel(levelId, request))
                .build();
    }

    @DeleteMapping("/{level_id}")
    ApiResponse<String> deleteJobLevel(@PathVariable("level_id") Integer levelId) {
        jobLevelService.deleteJobLevel(levelId);
        return ApiResponse.<String>builder()
                .result("Job Level has been deleted")
                .build();
    }
}
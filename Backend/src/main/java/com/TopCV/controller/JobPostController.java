package com.TopCV.controller;

import com.TopCV.dto.request.JobPost.JobPostCreationRequest;
import com.TopCV.dto.request.JobPost.JobPostUpdateRequest;
import com.TopCV.dto.response.ApiResponse;
import com.TopCV.dto.response.JobPost.JobPostDashboardResponse;
import com.TopCV.dto.response.JobPost.JobPostResponse;
import com.TopCV.dto.response.PageResponse;
import com.TopCV.service.JobPostService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.Parameter;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/job-posts")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class JobPostController {
    JobPostService jobPostService;

    @GetMapping("/company/{companyId}")
    public ApiResponse<PageResponse<JobPostDashboardResponse>> getJobPostsByCompany(
            @PathVariable Integer companyId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size){
        return ApiResponse.<PageResponse<JobPostDashboardResponse>> builder()
                .result(jobPostService.getJobPostsByCompany(companyId, page, size))
                .build();
    }

    @PostMapping
    public ApiResponse<JobPostResponse> createJobPost(@Valid @RequestBody JobPostCreationRequest request){
        return ApiResponse.<JobPostResponse>builder()
                .result(jobPostService.createJobPost(request))
                .build();
    }

    @PutMapping("/{jobId}")
    public ApiResponse<JobPostResponse> updateJobPost(
            @PathVariable Integer jobId,
            @Valid @RequestBody JobPostUpdateRequest request){
        return ApiResponse.<JobPostResponse>builder()
                .result(jobPostService.updateJobPost(jobId, request))
                .build();
    }

    @DeleteMapping("/{jobId}")
    public ApiResponse<String> deleteJobPost(@PathVariable Integer jobId){
        jobPostService.deleteJobPost(jobId);
        return ApiResponse.<String>builder()
                .result("job post has been deleted!!")
                .build();
    }

    @GetMapping("/my-posts")
    public ApiResponse<PageResponse<JobPostResponse>> getMyJobPosts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ApiResponse.<PageResponse<JobPostResponse>>builder()
                .result(jobPostService.getMyJobPosts(page, size))
                .build();
    }

}

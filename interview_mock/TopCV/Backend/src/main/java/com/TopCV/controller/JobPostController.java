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

    @GetMapping("/dashboard")
    public ApiResponse<PageResponse<JobPostDashboardResponse>> getDashboardJobPost(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size){
        return ApiResponse.<PageResponse<JobPostDashboardResponse>>builder()
                .result(jobPostService.getDashboardJobPost(page, size))
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

    @PatchMapping("/{jobId}/close")
    public ApiResponse<String> closeJobPost(@PathVariable Integer jobId){
        jobPostService.closeJobPost(jobId);
        return ApiResponse.<String>builder()
                .result("job post has been closed!!")
                .build();
    }

    @PatchMapping("/{jobId}/reopen")
    public ApiResponse<String> reopenJobPost(@PathVariable Integer jobId){
        jobPostService.reopenJobPost(jobId);
        return ApiResponse.<String>builder()
                .result("job post has been reopened!!")
                .build();
    }

    @PatchMapping("/admin/{jobId}/approve")
    public ApiResponse<String> approveJobPost(@PathVariable Integer jobId){
        jobPostService.approveJobPost(jobId);
        return ApiResponse.<String>builder()
                .result("job post has been approved!!")
                .build();
    }

    @PatchMapping("/admin/{jobId}/reject")
    public ApiResponse<String> rejectJobPost(@PathVariable Integer jobId){
        jobPostService.rejectJobPost(jobId);
        return ApiResponse.<String>builder()
                .result("job post has been rejected!!")
                .build();
    }

    @PatchMapping("/admin/{jobId}/suspend")
    public ApiResponse<String> suspendJobPost(@PathVariable Integer jobId){
        jobPostService.suspendJobPost(jobId);
        return ApiResponse.<String>builder()
                .result("job post has been suspended!!")
                .build();
    }

    @PostMapping("/{jobId}/favorite")
    public ApiResponse<String> favoriteJob(@PathVariable Integer jobId) {

        jobPostService.favoriteJob(jobId);

        return ApiResponse.<String>builder()
                .result("Job added to favorites successfully!!")
                .build();
    }

    @DeleteMapping("/{jobId}/favorite")
    public ApiResponse<String> unFavoriteJob(@PathVariable Integer jobId) {

        jobPostService.unFavoriteJob(jobId);

        return ApiResponse.<String>builder()
                .result("Job removed to favorites successfully!!")
                .build();
    }

    @GetMapping("/{jobId}/isFavorite")
    public ApiResponse<Boolean> isFavoriteJob(@PathVariable Integer jobId) {
        return ApiResponse.<Boolean>builder()
                .result(jobPostService.isFavoriteJob(jobId))
                .build();
    }

    @GetMapping
    public ApiResponse<PageResponse<JobPostResponse>> getAllJobPosts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.<PageResponse<JobPostResponse>>builder()
                .result(jobPostService.getAllJobPosts(page, size))
                .build();
    }

    @GetMapping("/search")
    public ApiResponse<PageResponse<JobPostResponse>> searchJobPosts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer jobTypeId,
            @RequestParam(required = false) Integer jobLevelId,
            @RequestParam(required = false) java.util.List<Integer> skillIds,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.<PageResponse<JobPostResponse>>builder()
                .result(jobPostService.searchJobPosts(keyword, location, jobTypeId, jobLevelId, skillIds, page, size))
                .build();
    }
}

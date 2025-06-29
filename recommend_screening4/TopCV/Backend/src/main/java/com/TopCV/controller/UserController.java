package com.TopCV.controller;

import com.TopCV.dto.request.ChangePassRequest;
import com.TopCV.dto.request.UserCreationRequest;
import com.TopCV.dto.request.UserUpdateRequest;
import com.TopCV.dto.request.VerifyOtpRequest;
import com.TopCV.dto.response.*;
import com.TopCV.dto.response.JobPost.JobPostDashboardResponse;
import com.TopCV.enums.Role;
import com.TopCV.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/register")
    public ApiResponse<RegistrationResponse> createUser(@Valid @RequestBody UserCreationRequest request) {
        request.setRole(Role.USER.toString());
        return ApiResponse.<RegistrationResponse>builder()
                .result(userService.createUser(request))
                .build();
    }

    @GetMapping("/my-info")
    public ApiResponse<UserResponse> getMyInfo() {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getMyInfo())
                .build();
    }

    @PutMapping("/my-info")
    public ApiResponse<UserResponse> updateCurrentUser(@Valid @RequestBody UserUpdateRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.updateCurrentUser(request))
                .build();
    }

    @GetMapping("/{userId}")
    public ApiResponse<UserResponse> getUserById(@PathVariable String userId) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getUserById(userId))
                .build();
    }

    @DeleteMapping("/{userId}")
    public ApiResponse<String> deleteUser(@PathVariable String userId) {
        userService.deleteUser(userId);
        return ApiResponse.<String>builder()
                .result("User has been deleted")
                .build();
    }

    @GetMapping
    public ApiResponse<PageResponse<UserResponse>> getAllUsers(@RequestParam(value = "page", defaultValue = "1") int page,
                                                               @RequestParam(value = "size", defaultValue = "10") int size) {
        return ApiResponse.<PageResponse<UserResponse>>builder()
                .result(userService.getAllUsers(page, size))
                .build();
    }

    @GetMapping("/search")
    public ApiResponse<PageResponse<UserResponse>> searchUsers(@RequestParam(value = "keyword", defaultValue = "") String keyword,
                                                               @RequestParam(value = "page", defaultValue = "1") int page,
                                                               @RequestParam(value = "size", defaultValue = "10") int size) {
        return ApiResponse.<PageResponse<UserResponse>>builder()
                .result(userService.searchUsers(keyword, page, size))
                .build();
    }

//    @PostMapping("/send-email-verification")
//    public ApiResponse<String> sendEmailVerification() {
//        userService.sendEmailVerification();
//        return ApiResponse.<String>builder()
//                .result("Email verification OTP sent successfully!!")
//                .build();
//    }

    @PostMapping("/verify-email")
    public ApiResponse<UserResponse> verifyEmail(@Valid @RequestBody VerifyOtpRequest request){
        return ApiResponse.<UserResponse>builder()
                .result(userService.verifyEmail(request))
                .build();
    }

    @PostMapping("/change-password")
    public ApiResponse<String> changePassword(@Valid @RequestBody ChangePassRequest request) {
        userService.changePassword(request);
        return ApiResponse.<String>builder()
                .result("Password changed successfully!!")
                .build();
    }

    @PutMapping("/{userId}/activate")
    public ApiResponse<String> activeUser(@PathVariable String userId){
        userService.activateUser(userId);
        return ApiResponse.<String>builder()
                .result("User activated successfully!!")
                .build();
    }

    @PutMapping("/{userId}/deactivate")
    public ApiResponse<String> deactiveUser(@PathVariable String userId){
        userService.deactivateUser(userId);
        return ApiResponse.<String>builder()
                .result("User deactivated successfully!!")
                .build();
    }

    @GetMapping("/followed")
    public ApiResponse<PageResponse<CompanyDashboardResponse>> getFollowedCompanies(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ApiResponse.<PageResponse<CompanyDashboardResponse>>builder()
                .result(userService.getFollowedCompanies(page, size))
                .build();
    }

    @GetMapping("/job-posts-favorite")
    public ApiResponse<PageResponse<JobPostDashboardResponse>> getFavoriteJobs(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ApiResponse.<PageResponse<JobPostDashboardResponse>>builder()
                .result(userService.getFavoriteJobs(page, size))
                .build();
    }

    @GetMapping("/candidate/{applicationId}")
    public ApiResponse<UserResponse> getCandidateByApplicationId(@PathVariable Long applicationId) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getCandidateByApplicationId(applicationId))
                .build();
    }
}

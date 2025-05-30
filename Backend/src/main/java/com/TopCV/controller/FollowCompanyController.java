package com.TopCV.controller;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import com.TopCV.dto.request.FollowCompanyRequest;
import com.TopCV.dto.response.ApiResponse;
import com.TopCV.dto.response.FollowCompanyResponse;
import com.TopCV.service.FollowCompanyService;

import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/follows")
@RequiredArgsConstructor
public class FollowCompanyController {
    private final FollowCompanyService followCompanyService;

    @PostMapping
    public ApiResponse<FollowCompanyResponse> addFollow(@Valid @RequestBody FollowCompanyRequest request) {
        return ApiResponse.<FollowCompanyResponse>builder()
                .result(followCompanyService.addFollow(request))
                .build();
    }

    @GetMapping("/companies/{companyId}")
    public ApiResponse<List<FollowCompanyResponse>> getFollowsByCompanyId(@PathVariable Integer companyId) {
        return ApiResponse.<List<FollowCompanyResponse>>builder()
                .result(followCompanyService.getFollowsByCompanyId(companyId))
                .build();
    }

    @DeleteMapping
    public ApiResponse<String> unfollow(@Valid @RequestBody FollowCompanyRequest request) {
        followCompanyService.unfollow(request);
        return ApiResponse.<String>builder()
                .result("Unfollowed successfully")
                .build();
    }
}

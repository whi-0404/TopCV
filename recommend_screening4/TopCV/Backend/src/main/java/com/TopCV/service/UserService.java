package com.TopCV.service;

import com.TopCV.dto.request.ChangePassRequest;
import com.TopCV.dto.request.UserCreationRequest;
import com.TopCV.dto.request.UserUpdateRequest;
import com.TopCV.dto.request.VerifyOtpRequest;
import com.TopCV.dto.response.CompanyDashboardResponse;
import com.TopCV.dto.response.JobPost.JobPostDashboardResponse;
import com.TopCV.dto.response.PageResponse;
import com.TopCV.dto.response.RegistrationResponse;
import com.TopCV.dto.response.UserResponse;
import com.TopCV.entity.User;
import org.springframework.stereotype.Service;


public interface UserService {
    RegistrationResponse createUser(UserCreationRequest request);

    UserResponse updateCurrentUser(UserUpdateRequest request);

    UserResponse getUserById(String userId);
    
    User getUserEntityById(String userId); // Lấy User entity cho screening

    UserResponse getUserByEmail(String email);

    UserResponse getMyInfo();

    void deleteUser(String userId);

    PageResponse<UserResponse> getAllUsers(int page, int size);

    PageResponse<UserResponse> searchUsers(String keyword, int page, int size);

    void sendEmailVerification();

    UserResponse verifyEmail(VerifyOtpRequest request);

    void changePassword(ChangePassRequest request);

    void activateUser(String userId);

    void deactivateUser(String userId);

    PageResponse<CompanyDashboardResponse> getFollowedCompanies(int page, int size);

    PageResponse<JobPostDashboardResponse> getFavoriteJobs(int page, int size);
}

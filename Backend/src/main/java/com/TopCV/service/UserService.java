package com.TopCV.service;

import com.TopCV.dto.request.ChangePassRequest;
import com.TopCV.dto.request.UserCreationRequest;
import com.TopCV.dto.request.UserUpdateRequest;
import com.TopCV.dto.request.VerifyOtpRequest;
import com.TopCV.dto.response.PageResponse;
import com.TopCV.dto.response.RegistrationResponse;
import com.TopCV.dto.response.UserResponse;
import org.springframework.stereotype.Service;


public interface UserService {
    RegistrationResponse createUser(UserCreationRequest request);

    UserResponse updateCurrentUser(UserUpdateRequest request);

    UserResponse getUserById(String userId);

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
}

package com.TopCV.service;

import com.TopCV.dto.request.UserCreationRequest;
import com.TopCV.dto.response.UserResponse;
import com.TopCV.dto.request.UserUpdateRequest;

import java.util.List;

public interface UserService {
    UserResponse createUser(UserCreationRequest request);

    List<UserResponse> getUsers();

    UserResponse getUser(Integer userId);

    UserResponse getMyInfo();

    UserResponse updateUser(Integer userId, UserUpdateRequest request);

    void deleteUser(Integer userId);

    void deactivateUser(Integer userId);
}

package com.TopCV.service;

import com.TopCV.exception.JobportalException;
import org.springframework.stereotype.Service;
import com.TopCV.dto.request.UserCreationRequest;


public interface UserService {
    public UserCreationRequest registerUser(UserCreationRequest userRequest) throws JobportalException;
}

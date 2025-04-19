package com.TopCV.service;

import com.TopCV.dto.request.loginDTO;
import com.TopCV.dto.response.ResponseDTO;
import com.TopCV.exception.JobportalException;
import org.springframework.stereotype.Service;
import com.TopCV.dto.request.UserCreationRequest;


public interface UserService {
    public UserCreationRequest registerUser(UserCreationRequest userRequest) throws JobportalException;
    public UserCreationRequest loginUser(loginDTO LoginDTO) throws JobportalException;
    public Boolean sendOtp(String email) throws Exception;
    public Boolean verifyOtp(String email, String otp) throws JobportalException;
    public ResponseDTO changePassword(loginDTO logindto) throws JobportalException;
}

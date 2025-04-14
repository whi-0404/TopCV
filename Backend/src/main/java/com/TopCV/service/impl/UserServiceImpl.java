package com.TopCV.service.impl;

import com.TopCV.dto.request.UserCreationRequest;
import com.TopCV.dto.response.UserResponse;
import com.TopCV.entity.User;
import com.TopCV.exception.JobportalException;
import com.TopCV.repository.UserRepository;
import com.TopCV.service.UserService;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.TopCV.service.SequenceGeneratorService;
@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserCreationRequest registerUser(@NotNull UserCreationRequest userResponse) throws JobportalException {
        userResponse.setId(SequenceGeneratorService.generateSequence("users"));
        userResponse.setPassword(passwordEncoder.encode(userResponse.getPassword()));
        User user = userResponse.toEntity();
        user = userRepository.save(user);
        return user.toDto();
    }
}

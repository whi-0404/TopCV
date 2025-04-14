package com.TopCV.controller;

import com.TopCV.dto.request.UserCreationRequest;
import com.TopCV.exception.JobportalException;
import com.TopCV.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserCreationRequest> registerUser(@RequestBody @Valid UserCreationRequest userRequest) throws JobportalException {
        userRequest= userService.registerUser(userRequest);
        return new ResponseEntity<>(userRequest, HttpStatus.CREATED);
    }
}

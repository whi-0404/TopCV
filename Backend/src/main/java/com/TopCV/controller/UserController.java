package com.TopCV.controller;

import com.TopCV.dto.request.UserCreationRequest;
import com.TopCV.dto.request.loginDTO;
import com.TopCV.dto.response.ResponseDTO;
import com.TopCV.exception.JobportalException;
import com.TopCV.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserCreationRequest> registerUser(@RequestBody @Valid UserCreationRequest userRequest) throws JobportalException {
        userRequest= userService.registerUser(userRequest);
        return new ResponseEntity<>(userRequest, HttpStatus.CREATED);
    }
    @PostMapping("/login")
    public ResponseEntity<UserCreationRequest> loginUser(@RequestBody @Valid loginDTO loginDTO) throws JobportalException {

        return new ResponseEntity<>(userService.loginUser(loginDTO), HttpStatus.OK);
    }
    @PostMapping("/sendOTP/{email}")
    public ResponseEntity<ResponseDTO> sendOtp(@PathVariable String email) throws Exception {
        userService.sendOtp(email);
        return new ResponseEntity<>(new ResponseDTO("OTP sent successfully"), HttpStatus.OK);

    }

    @GetMapping("/verifyOtp/{email}/{otp}")
    public ResponseEntity<ResponseDTO> verifyOTP(@PathVariable String email, @PathVariable String otp) throws JobportalException{
        userService.verifyOtp(email,otp);
        return new ResponseEntity<>(new ResponseDTO("OTP has been verified"), HttpStatus.OK);

    }

    @PostMapping("/changePassword")
    public ResponseEntity<ResponseDTO> changePass(@RequestBody @Valid loginDTO logindto) throws Exception {
        return new ResponseEntity<>(userService.changePassword(logindto), HttpStatus.OK);

    }
}


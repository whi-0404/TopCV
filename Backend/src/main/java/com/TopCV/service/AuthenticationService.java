package com.TopCV.service;

import com.TopCV.dto.request.AuthenticationRequest;
import com.TopCV.dto.request.ForgotPasswordRequest;
import com.TopCV.dto.request.IntrospectRequest;
import com.TopCV.dto.request.ResetPasswordRequest;
import com.TopCV.dto.response.AuthenticationResponse;
import com.TopCV.dto.response.IntrospectResponse;
import com.nimbusds.jose.JOSEException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.text.ParseException;

public interface AuthenticationService{
    AuthenticationResponse authenticate(AuthenticationRequest request, HttpServletResponse response);

    IntrospectResponse introspect(IntrospectRequest request);

    void logout(HttpServletRequest request, HttpServletResponse response);

    void forgotPassword(ForgotPasswordRequest request);

    void resetPassword(ResetPasswordRequest request);

    AuthenticationResponse refreshToken(HttpServletRequest request, HttpServletResponse response);

//    AuthenticationResponse outboundAuthenticate(String code, HttpServletResponse httpServletResponse);
}

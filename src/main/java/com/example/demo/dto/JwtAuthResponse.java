package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JwtAuthResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private Long userId;
    private String email;
    private String userType;
    
    public JwtAuthResponse(String accessToken, Long userId, String email, String userType) {
        this.accessToken = accessToken;
        this.userId = userId;
        this.email = email;
        this.userType = userType;
    }
} 
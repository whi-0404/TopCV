package com.TopCV.client;

import feign.Response;
import feign.codec.ErrorDecoder;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class ScreeningServiceErrorDecoder implements ErrorDecoder {
    
    @Override
    public Exception decode(String methodKey, Response response) {
        log.error("Screening Service Error - Method: {}, Status: {}, Reason: {}", 
                  methodKey, response.status(), response.reason());
        
        switch (response.status()) {
            case 400:
                return new RuntimeException("Bad request to screening service: " + response.reason());
            case 404:
                return new RuntimeException("Screening service endpoint not found: " + response.reason());
            case 500:
                return new RuntimeException("Internal error in screening service: " + response.reason());
            case 503:
                return new RuntimeException("Screening service temporarily unavailable: " + response.reason());
            default:
                return new RuntimeException("Screening service error: " + response.status() + " " + response.reason());
        }
    }
} 
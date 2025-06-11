package com.TopCV.exception;

import lombok.Getter;

import java.util.Map;

@Getter
public class ValidationException extends AppException {
    private final Map<String, String> fieldErrors;

    public ValidationException(ErrorCode errorCode, Map<String, String> fieldErrors) {
        super(errorCode);
        this.fieldErrors = fieldErrors;
    }
}
package com.TopCV.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Invalid message key", HttpStatus.BAD_REQUEST),
    USER_EXISTED(1002, "User existed", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1003, "Username must be at least 3 characters", HttpStatus.BAD_REQUEST),
    PASSWORD_INVALID(1004, "Password must be at least 8 characters", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1005, "User not existed", HttpStatus.BAD_REQUEST),

    UNAUTHENTICATED(1006, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1007, "You do not permission", HttpStatus.FORBIDDEN),
    ROLE_NOT_EXISTED(1008, "Role not existed", HttpStatus.BAD_REQUEST),

    COMPANY_NAME_EXISTS(1009, "Company name already exists", HttpStatus.BAD_REQUEST),
    COMPANY_NOT_EXISTS(1010, "Company not exists", HttpStatus.BAD_REQUEST),

    CATEGORY_NAME_EXISTS(1011, "Category name already exists", HttpStatus.BAD_REQUEST),
    CATEGORY_NOT_EXISTS(1012, "Category not exists", HttpStatus.BAD_REQUEST),

    TYPE_NAME_EXISTS(1013, "Job type name already exists", HttpStatus.BAD_REQUEST),
    TYPE_NOT_EXISTS(1014, "Job type not exists", HttpStatus.BAD_REQUEST),

    LEVEL_NAME_EXISTS(1015, "Job level name already exists", HttpStatus.BAD_REQUEST),
    LEVEL_NOT_EXISTS(1016, "Job level not exists", HttpStatus.BAD_REQUEST),

    REVIEW_ALREADY_EXISTS(1017, "Review already exists", HttpStatus.BAD_REQUEST),
    REVIEW_NOT_EXISTS(1018, "Review not exists", HttpStatus.BAD_REQUEST);


    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
}

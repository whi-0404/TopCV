package com.TopCV.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Invalid message key", HttpStatus.BAD_REQUEST),

    USER_EXISTED(1002, "User already exists", HttpStatus.BAD_REQUEST),
    EMAIL_EXISTED(1003, "Email already exists", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1004, "Username must be at least 3 characters", HttpStatus.BAD_REQUEST),
    PASSWORD_INVALID(1005, "Password must be at least 8 characters", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1006, "User not found", HttpStatus.NOT_FOUND),
    USER_DEACTIVATED(1007, "User account has been deactivated", HttpStatus.FORBIDDEN),

    UNAUTHENTICATED(1101, "Invalid credentials", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1102, "You do not have permission", HttpStatus.FORBIDDEN),
    EXPIRED_TOKEN(1103, "Token has expired", HttpStatus.UNAUTHORIZED),
    INVALID_CURRENT_PASSWORD(1104, "Current password is incorrect", HttpStatus.BAD_REQUEST),

    // Email verification errors
    EMAIL_NOT_VERIFIED(1201, "Email address not verified", HttpStatus.FORBIDDEN),
    EMAIL_ALREADY_VERIFIED(1202, "Email address already verified", HttpStatus.BAD_REQUEST),

    // OTP related errors
    INVALID_OTP(1301, "Invalid or incorrect OTP code", HttpStatus.BAD_REQUEST),
    OTP_SEND_FAILED(1302, "otp send failed", HttpStatus.TOO_MANY_REQUESTS),

    // Validation errors
    EMAIL_REQUIRED(1401, "Email is required", HttpStatus.BAD_REQUEST),
    EMAIL_INVALID(1402, "Email format is invalid", HttpStatus.BAD_REQUEST),
    PASSWORD_REQUIRED(1403, "Password is required", HttpStatus.BAD_REQUEST),
    USERNAME_REQUIRED(1404, "Username is required", HttpStatus.BAD_REQUEST),
    FULLNAME_REQUIRED(1405, "Full name is required", HttpStatus.BAD_REQUEST),
    OTP_REQUIRED(1406, "OTP code is required", HttpStatus.BAD_REQUEST),

    // System errors
    EMAIL_SEND_FAILED(1501, "Failed to send email", HttpStatus.INTERNAL_SERVER_ERROR),
    ROLE_NOT_EXISTED(1502, "Role not found", HttpStatus.BAD_REQUEST);

    COMPANY_NAME_EXISTED(1601, "Company name already exists", HttpStatus.BAD_REQUEST),
    COMPANY_NOT_EXISTED(1602, "Company not exists", HttpStatus.BAD_REQUEST),

    CATEGORY_NAME_EXISTED(1701, "Category name already exists", HttpStatus.BAD_REQUEST),
    CATEGORY_NOT_EXISTED(1702, "Category not exists", HttpStatus.BAD_REQUEST),

    TYPE_NAME_EXISTED(1801, "Job type name already exists", HttpStatus.BAD_REQUEST),
    TYPE_NOT_EXISTED(1802, "Job type not exists", HttpStatus.BAD_REQUEST),

    LEVEL_NAME_EXISTED(1901, "Job level name already exists", HttpStatus.BAD_REQUEST),
    LEVEL_NOT_EXISTED(1902, "Job level not exists", HttpStatus.BAD_REQUEST),

    REVIEW_ALREADY_EXISTED(2001, "Review already exists", HttpStatus.BAD_REQUEST),
    REVIEW_NOT_EXISTED(2002, "Review not exists", HttpStatus.BAD_REQUEST),

    FOLLOW_EXISTED(2101, "Follow already exists", HttpStatus.BAD_REQUEST),
    FOLLOW_NOT_EXISTED(2102, "Follow not exists", HttpStatus.BAD_REQUEST);

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;

    public boolean isClientError() {
        return statusCode.is4xxClientError();
    }

    public boolean isServerError() {
        return statusCode.is5xxServerError();
    }
}

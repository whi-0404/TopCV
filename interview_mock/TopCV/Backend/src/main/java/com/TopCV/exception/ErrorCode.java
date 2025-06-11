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
    ROLE_NOT_EXISTED(1502, "Role not found", HttpStatus.BAD_REQUEST),

    COMPANY_NAME_EXISTED(1601, "Company name already exists", HttpStatus.BAD_REQUEST),
    COMPANY_NOT_EXISTED(1602, "Company not exists", HttpStatus.BAD_REQUEST),
    COMPANY_NOT_ACTIVE(1603, "Company not active", HttpStatus.BAD_REQUEST),
    ALREADY_FOLLOWING_COMPANY(1604, "Already following this company", HttpStatus.BAD_REQUEST),
    NOT_FOLLOWING_COMPANY(1605, "Not following this company", HttpStatus.BAD_REQUEST),

    CATEGORY_NAME_EXISTED(1701, "Category name already exists", HttpStatus.BAD_REQUEST),
    CATEGORY_NOT_EXISTED(1702, "Category not exists", HttpStatus.BAD_REQUEST),

    TYPE_NAME_EXISTED(1801, "Job type name already exists", HttpStatus.BAD_REQUEST),
    TYPE_NOT_EXISTED(1802, "Job type not exists", HttpStatus.BAD_REQUEST),

    LEVEL_NAME_EXISTED(1901, "Job level name already exists", HttpStatus.BAD_REQUEST),
    LEVEL_NOT_EXISTED(1902, "Job level not exists", HttpStatus.BAD_REQUEST),

    REVIEW_ALREADY_EXISTED(2001, "Review already exists", HttpStatus.BAD_REQUEST),
    REVIEW_NOT_EXISTED(2002, "Review not exists", HttpStatus.BAD_REQUEST),

    SKILL_NAME_EXISTED(2101, "Skill name already exists", HttpStatus.BAD_REQUEST),
    SKILL_NOT_EXISTED(2102, "Skill not exists", HttpStatus.BAD_REQUEST),

    JOB_POST_NOT_EXISTED(2201, "Job post not exists", HttpStatus.BAD_REQUEST),
    CANNOT_UPDATE_JOB_POST(2202, "Can't update job post", HttpStatus.BAD_REQUEST),
    CANNOT_DELETE_JOB_POST_WITH_APPLICATIONS(2203, "Can't delete job post with applications", HttpStatus.BAD_REQUEST),
    CANNOT_CLOSE_INACTIVE_JOB_POST(2204, "Can't close inactive job post", HttpStatus.BAD_REQUEST),
    CANNOT_REOPEN_ACTIVE_JOB_POST(2205, "Can't reopen active job post", HttpStatus.BAD_REQUEST),
    JOB_POST_DEADLINE_EXPIRED(2206, "Job post deadline expired", HttpStatus.BAD_REQUEST),
    JOB_POST_NOT_PENDING(2207, "Job post not pending", HttpStatus.BAD_REQUEST),
    JOB_POST_NOT_ACTIVE(2208, "Job post not active", HttpStatus.BAD_REQUEST),
    ALREADY_FAVORITED_JOB(2209, "Job already favorited", HttpStatus.BAD_REQUEST),
    NOT_FAVORITED_JOB(2210, "Job not favorited", HttpStatus.BAD_REQUEST),

    // Recommendation service errors
    INVALID_CV_FILE(2301, "Invalid CV file format", HttpStatus.BAD_REQUEST),
    UNSUPPORTED_FILE_TYPE(2302, "Unsupported file type", HttpStatus.BAD_REQUEST),
    FILE_TOO_LARGE(2303, "File size too large", HttpStatus.BAD_REQUEST),
    CV_ANALYSIS_ERROR(2304, "Error analyzing CV content", HttpStatus.INTERNAL_SERVER_ERROR),
    RECOMMENDATION_PROCESSING_ERROR(2305, "Error processing recommendation", HttpStatus.INTERNAL_SERVER_ERROR),
    RECOMMENDATION_SERVICE_ERROR(2306, "Recommendation service error", HttpStatus.INTERNAL_SERVER_ERROR),
    SERVICE_UNAVAILABLE(2307, "Recommendation service unavailable", HttpStatus.SERVICE_UNAVAILABLE),
    PROCESSING_TIMEOUT(2308, "Processing timeout", HttpStatus.REQUEST_TIMEOUT),
    SAMPLE_DATA_INITIALIZATION_ERROR(2309, "Error initializing sample data", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_REQUEST(2310, "Invalid request parameters", HttpStatus.BAD_REQUEST),
    NOT_FOUND(2311, "Resource not found", HttpStatus.NOT_FOUND),

    RESUME_NOT_EXISTED(3001, "Resume not exists", HttpStatus.BAD_REQUEST),
    RESUME_EMPTY(3002, "Resume file is empty", HttpStatus.BAD_REQUEST),
    RESUME_TOO_LARGE(3003, "Resume file too large", HttpStatus.BAD_REQUEST),
    RESUME_INVALID_FORMAT(3004, "Resume file format invalid", HttpStatus.BAD_REQUEST),
    RESUME_UPLOAD_FAILED(3005, "Resume upload failed", HttpStatus.INTERNAL_SERVER_ERROR),
    RESUME_NOT_BELONGS_TO_USER(3006, "Resume does not belong to user", HttpStatus.FORBIDDEN),
    RESUME_DOWNLOAD_FAILED(3007, "Resume download failed", HttpStatus.INTERNAL_SERVER_ERROR),
    RESUME_DELETE_FAILED(3008, "Resume delete failed", HttpStatus.INTERNAL_SERVER_ERROR),
    ALREADY_APPLIED_JOB(3101, "Already applied for this job", HttpStatus.BAD_REQUEST),
    APPLICATION_NOT_EXISTED(3102, "Application not exists", HttpStatus.BAD_REQUEST),
    CANNOT_WITHDRAW_APPLICATION(3103, "Cannot withdraw application", HttpStatus.BAD_REQUEST),
    INVALID_APPLICATION_STATUS(3104, "Invalid application status", HttpStatus.BAD_REQUEST),
    INVALID_STATUS_TRANSITION(3105, "Invalid status transition", HttpStatus.BAD_REQUEST),
    APPLICATION_IDS_REQUIRED(3106, "Application IDs required", HttpStatus.BAD_REQUEST),
    SOME_APPLICATIONS_NOT_FOUND(3107, "Some applications not found", HttpStatus.BAD_REQUEST),;

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

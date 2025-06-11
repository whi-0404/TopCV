package com.TopCV.client;

import com.TopCV.exception.AppException;
import com.TopCV.exception.ErrorCode;
import feign.Response;
import feign.codec.ErrorDecoder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;

@Slf4j
public class RecommendationServiceErrorDecoder implements ErrorDecoder {
    
    private final ErrorDecoder defaultErrorDecoder = new Default();
    
    @Override
    public Exception decode(String methodKey, Response response) {
        HttpStatus status = HttpStatus.valueOf(response.status());
        
        log.error("Error calling Python recommendation service. Method: {}, Status: {}, Reason: {}", 
                methodKey, response.status(), response.reason());
        
        return switch (status) {
            case BAD_REQUEST -> new AppException(ErrorCode.INVALID_REQUEST);
            case UNAUTHORIZED -> new AppException(ErrorCode.UNAUTHENTICATED);
            case FORBIDDEN -> new AppException(ErrorCode.UNAUTHORIZED);
            case NOT_FOUND -> new AppException(ErrorCode.NOT_FOUND);
            case REQUEST_TIMEOUT -> new AppException(ErrorCode.PROCESSING_TIMEOUT);
            case UNPROCESSABLE_ENTITY -> new AppException(ErrorCode.INVALID_CV_FILE);
            case INTERNAL_SERVER_ERROR -> new AppException(ErrorCode.RECOMMENDATION_SERVICE_ERROR);
            case SERVICE_UNAVAILABLE -> new AppException(ErrorCode.SERVICE_UNAVAILABLE);
            default -> {
                log.error("Unexpected error from recommendation service: {}", response);
                yield new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
            }
        };
    }
} 
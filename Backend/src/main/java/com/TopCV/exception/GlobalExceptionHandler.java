package com.TopCV.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GlobalExceptionHandler {
    private String errorMessage;
    private int errorCode;
    private LocalDateTime timestamp;

}

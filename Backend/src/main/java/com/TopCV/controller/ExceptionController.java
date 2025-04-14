package com.TopCV.controller;

import com.TopCV.exception.GlobalExceptionHandler;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@RestControllerAdvice
public class ExceptionController {
    @ExceptionHandler(Exception.class)
    public ResponseEntity<GlobalExceptionHandler>generalException(Exception exception) {
        GlobalExceptionHandler errorInfo = new GlobalExceptionHandler(
                exception.getMessage(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                LocalDateTime.now());

        return new ResponseEntity<>(errorInfo, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler({MethodArgumentNotValidException.class, ConstraintViolationException.class})
    public ResponseEntity<GlobalExceptionHandler>validatorException(Exception exception) {
        String msg = "";
        if (exception instanceof MethodArgumentNotValidException manException) {
            msg = manException.getAllErrors().stream().map(ObjectError::getDefaultMessage).collect(Collectors.joining(","));
        }
        else{
            ConstraintViolationException cvException = (ConstraintViolationException) exception;
            msg = cvException.getConstraintViolations().stream().map(ConstraintViolation::getMessage).collect(Collectors.joining(","));
        }
        GlobalExceptionHandler errorInfo = new GlobalExceptionHandler(
                msg,
                HttpStatus.BAD_REQUEST.value(),
                LocalDateTime.now());

        return new ResponseEntity<>(errorInfo, HttpStatus.BAD_REQUEST);
    }
}

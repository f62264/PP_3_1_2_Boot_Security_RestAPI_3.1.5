package ru.kata.spring.boot_security.demo.util;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class UserGlobalExceptionHandler {

    @ExceptionHandler
    public ResponseEntity<UserErrorResponse> handleException (UserNotFoundException exception) {
        UserErrorResponse response = new UserErrorResponse();
        response.setMessage(exception.getMessage());

        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler
    public ResponseEntity<UserErrorResponse> handleException (Exception exception) {
        UserErrorResponse response = new UserErrorResponse();
        response.setMessage(exception.getMessage());

        return new ResponseEntity<>(response,HttpStatus.BAD_REQUEST);
    }
}

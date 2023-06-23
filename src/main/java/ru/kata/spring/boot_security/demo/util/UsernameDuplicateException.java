package ru.kata.spring.boot_security.demo.util;

public class UsernameDuplicateException extends RuntimeException {
    public UsernameDuplicateException (String message) {
        super(message);
    }
}

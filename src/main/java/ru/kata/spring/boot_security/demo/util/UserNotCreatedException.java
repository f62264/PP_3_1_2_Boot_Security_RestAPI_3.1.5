package ru.kata.spring.boot_security.demo.util;

import ru.kata.spring.boot_security.demo.models.User;

public class UserNotCreatedException extends RuntimeException{
    public UserNotCreatedException(String msg) {
        super(msg);
    }
}

package ru.kata.spring.boot_security.demo.services;

import ru.kata.spring.boot_security.demo.models.User;

import java.util.List;

public interface UserService {

    List<User> findAll();

    User saveUser(User user);

    void deleteById(Long id);

    User findById(Long id);

    User findByUsername(String username);
 }

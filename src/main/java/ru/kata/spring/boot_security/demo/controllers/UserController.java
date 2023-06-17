package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.repositories.RoleRepository;
import ru.kata.spring.boot_security.demo.services.UserService;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Controller
public class UserController {

    private final UserService userService;
    private final RoleRepository roleRepository;

    @Autowired
    public UserController(UserService userService, RoleRepository roleRepository) {
        this.userService = userService;
        this.roleRepository = roleRepository;
    }

    @GetMapping("/login")
    public String liginPage() {
        return "login";
    }

    @GetMapping("/admin/users")
    public String findAll(Model model, Authentication authentication) {
        List<User> users = userService.findAll();
        User user = userService.findByUsername(authentication.getName());
        model.addAttribute("user", user);
        model.addAttribute("authentication", authentication);
        model.addAttribute("users", users);
        model.addAttribute("roles", roleRepository.findAll());
        return "user-list-bs";
    }

    @PostMapping("/admin/addUser")
    public String createUser(@ModelAttribute("user") User user, @RequestParam("listRoles") ArrayList<Long> roles) {
        Set<Role> userRoles = new HashSet<>(roleRepository.findAllById(roles));
        user.setRoles(userRoles);
        userService.saveUser(user);
        return "redirect:/admin/users";
    }

    @PostMapping("/admin/user-delete/{id}")
    public String deleteUser(@PathVariable Long id) {
        userService.deleteById(id);
        return "redirect:/admin/users";
    }

    @PostMapping("/admin/user-update/{id}")
    public String update(@ModelAttribute("user") User user, @RequestParam("EditListRoles") ArrayList<Long> roles) {
        Set<Role> userRoles = new HashSet<>(roleRepository.findAllById(roles));
        user.setRoles(userRoles);
        userService.saveUser(user);
        return "redirect:/admin/users";
    }

}

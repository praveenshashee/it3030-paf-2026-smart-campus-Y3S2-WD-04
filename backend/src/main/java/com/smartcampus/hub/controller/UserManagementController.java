package com.smartcampus.hub.controller;

import com.smartcampus.hub.dto.AuthUserResponseDto;
import com.smartcampus.hub.dto.UserRoleUpdateRequestDto;
import com.smartcampus.hub.entity.User;
import com.smartcampus.hub.enums.Role;
import com.smartcampus.hub.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserManagementController {

    private final UserRepository userRepository;

    public UserManagementController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<AuthUserResponseDto>> getAllUsers() {
        List<AuthUserResponseDto> users = userRepository.findAll()
                .stream()
                .map(user -> new AuthUserResponseDto(
                        user.getId(),
                        user.getEmail(),
                        user.getFullName(),
                        user.getProfileImageUrl(),
                        user.getRole()))
                .toList();

        return ResponseEntity.ok(users);
    }

    @GetMapping("/technicians")
    public ResponseEntity<List<AuthUserResponseDto>> getTechnicians() {
        List<AuthUserResponseDto> technicians = userRepository.findByRole(Role.TECHNICIAN)
                .stream()
                .map(user -> new AuthUserResponseDto(
                        user.getId(),
                        user.getEmail(),
                        user.getFullName(),
                        user.getProfileImageUrl(),
                        user.getRole()))
                .toList();

        return ResponseEntity.ok(technicians);
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<AuthUserResponseDto> updateUserRole(
            @PathVariable Long id,
            @RequestBody UserRoleUpdateRequestDto request) {
        User user = userRepository.findById(id).orElse(null);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        Role newRole = request.getRole();

        if (newRole == null) {
            return ResponseEntity.badRequest().build();
        }

        user.setRole(newRole);
        User savedUser = userRepository.save(user);

        AuthUserResponseDto response = new AuthUserResponseDto(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getFullName(),
                savedUser.getProfileImageUrl(),
                savedUser.getRole());

        return ResponseEntity.ok(response);
    }
}

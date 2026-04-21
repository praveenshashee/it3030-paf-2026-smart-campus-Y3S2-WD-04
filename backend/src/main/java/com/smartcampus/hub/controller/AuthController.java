package com.smartcampus.hub.controller;

import com.smartcampus.hub.dto.AuthUserResponseDto;
import com.smartcampus.hub.dto.SessionUserDto;
import com.smartcampus.hub.entity.User;
import com.smartcampus.hub.enums.Role;
import com.smartcampus.hub.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/ping")
    public String ping() {
        return "auth controller working";
    }

    @GetMapping("/me")
    public ResponseEntity<AuthUserResponseDto> getCurrentUser(
            @AuthenticationPrincipal OidcUser oidcUser,
            HttpSession session) {
        // Temporary dev-login session user support.
        SessionUserDto sessionUser = (SessionUserDto) session.getAttribute("devUser");

        if (sessionUser != null) {
            return ResponseEntity.ok(
                    new AuthUserResponseDto(
                            sessionUser.getId(),
                            sessionUser.getEmail(),
                            sessionUser.getFullName(),
                            sessionUser.getProfileImageUrl(),
                            sessionUser.getRole()));
        }

        if (oidcUser == null) {
            return ResponseEntity.status(401).build();
        }

        String email = oidcUser.getEmail();
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return ResponseEntity.status(404).build();
        }

        AuthUserResponseDto responseDto = new AuthUserResponseDto(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getProfileImageUrl(),
                user.getRole());

        return ResponseEntity.ok(responseDto);
    }

    @PostMapping("/dev-login/user")
    public ResponseEntity<AuthUserResponseDto> devLoginUser(HttpSession session) {
        return ResponseEntity.ok(loginAsRole(session, "dev-user@smartcampus.local", "Demo User", Role.USER));
    }

    @PostMapping("/dev-login/admin")
    public ResponseEntity<AuthUserResponseDto> devLoginAdmin(HttpSession session) {
        return ResponseEntity.ok(loginAsRole(session, "dev-admin@smartcampus.local", "Demo Admin", Role.ADMIN));
    }

    @PostMapping("/dev-login/technician")
    public ResponseEntity<AuthUserResponseDto> devLoginTechnician(HttpSession session) {
        return ResponseEntity
                .ok(loginAsRole(session, "dev-tech@smartcampus.local", "Demo Technician", Role.TECHNICIAN));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        session.removeAttribute("devUser");
        session.invalidate();
        return ResponseEntity.ok().build();
    }

    private AuthUserResponseDto loginAsRole(HttpSession session, String email, String fullName, Role role) {
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setFullName(fullName);
            user.setGoogleId(null);
            user.setProfileImageUrl(null);
            user.setRole(role);
            user.setCreatedAt(LocalDateTime.now());
        } else {
            user.setFullName(fullName);
            user.setRole(role);
        }

        User savedUser = userRepository.save(user);

        SessionUserDto sessionUser = new SessionUserDto(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getFullName(),
                savedUser.getProfileImageUrl(),
                savedUser.getRole());

        session.setAttribute("devUser", sessionUser);

        return new AuthUserResponseDto(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getFullName(),
                savedUser.getProfileImageUrl(),
                savedUser.getRole());
    }
}
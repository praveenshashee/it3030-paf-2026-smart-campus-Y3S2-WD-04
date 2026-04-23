package com.smartcampus.hub.service;

import com.smartcampus.hub.dto.SessionUserDto;
import com.smartcampus.hub.entity.User;
import com.smartcampus.hub.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserService {

    private final UserRepository userRepository;

    public CurrentUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof SessionUserDto sessionUser) {
            return userRepository.findById(sessionUser.getId()).orElse(null);
        }

        if (principal instanceof OidcUser oidcUser) {
            return userRepository.findByEmail(oidcUser.getEmail()).orElse(null);
        }

        return null;
    }
}

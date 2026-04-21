package com.smartcampus.hub.service;

import com.smartcampus.hub.entity.User;
import com.smartcampus.hub.enums.Role;
import com.smartcampus.hub.repository.UserRepository;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class CustomOidcUserService extends OidcUserService {

    private final UserRepository userRepository;

    public CustomOidcUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        OidcUser oidcUser = super.loadUser(userRequest);

        String googleId = oidcUser.getSubject();
        String email = oidcUser.getEmail();
        String fullName = oidcUser.getFullName();
        String profileImageUrl = null;

        System.out.println("OIDC login user email: " + email);

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setGoogleId(googleId);
            user.setFullName(fullName);
            user.setProfileImageUrl(profileImageUrl);
            user.setRole(Role.USER);
            user.setCreatedAt(LocalDateTime.now());
        } else {
            user.setGoogleId(googleId);
            user.setFullName(fullName);
            user.setProfileImageUrl(profileImageUrl);
        }

        userRepository.save(user);

        return oidcUser;
    }
}
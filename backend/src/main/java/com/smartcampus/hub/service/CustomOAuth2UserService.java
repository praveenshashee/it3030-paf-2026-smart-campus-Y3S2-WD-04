package com.smartcampus.hub.service;

import com.smartcampus.hub.entity.User;
import com.smartcampus.hub.enums.Role;
import com.smartcampus.hub.repository.UserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserRepository userRepository;
    private final DefaultOAuth2UserService defaultOAuth2UserService = new DefaultOAuth2UserService();

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = defaultOAuth2UserService.loadUser(userRequest);

        Map<String, Object> attributes = oauth2User.getAttributes();

        String googleId = (String) attributes.get("sub");
        String email = (String) attributes.get("email");
        String fullName = (String) attributes.get("name");
        String profileImageUrl = (String) attributes.get("picture");

        System.out.println("OAuth login user email: " + email);

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
            // Keep local user info in sync with the latest Google profile data.
            user.setGoogleId(googleId);
            user.setFullName(fullName);
            user.setProfileImageUrl(profileImageUrl);
        }

        userRepository.save(user);

        return oauth2User;
    }
}
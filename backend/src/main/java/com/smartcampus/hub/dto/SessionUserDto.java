package com.smartcampus.hub.dto;

import com.smartcampus.hub.enums.Role;

import java.io.Serializable;

public class SessionUserDto implements Serializable {

    private Long id;
    private String email;
    private String fullName;
    private String profileImageUrl;
    private Role role;

    public SessionUserDto(Long id, String email, String fullName, String profileImageUrl, Role role) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.profileImageUrl = profileImageUrl;
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getFullName() {
        return fullName;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public Role getRole() {
        return role;
    }
}
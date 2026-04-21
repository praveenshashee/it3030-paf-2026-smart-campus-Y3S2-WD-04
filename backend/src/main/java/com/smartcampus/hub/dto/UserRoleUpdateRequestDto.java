package com.smartcampus.hub.dto;

import com.smartcampus.hub.enums.Role;

public class UserRoleUpdateRequestDto {

    private Role role;

    public UserRoleUpdateRequestDto() {
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
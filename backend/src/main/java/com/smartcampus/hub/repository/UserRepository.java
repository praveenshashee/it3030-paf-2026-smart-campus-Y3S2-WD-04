package com.smartcampus.hub.repository;

import com.smartcampus.hub.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import com.smartcampus.hub.enums.Role;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByGoogleId(String googleId);

    List<User> findByRole(Role role);
}

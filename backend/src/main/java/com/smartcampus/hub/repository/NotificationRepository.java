package com.smartcampus.hub.repository;

import com.smartcampus.hub.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
}
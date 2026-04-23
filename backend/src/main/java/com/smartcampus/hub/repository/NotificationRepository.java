package com.smartcampus.hub.repository;

import com.smartcampus.hub.entity.Notification;
import com.smartcampus.hub.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByRecipient(User recipient);
}

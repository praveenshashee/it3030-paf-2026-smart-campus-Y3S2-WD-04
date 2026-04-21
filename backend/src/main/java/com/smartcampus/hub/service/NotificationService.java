package com.smartcampus.hub.service;

import com.smartcampus.hub.dto.NotificationResponseDto;
import com.smartcampus.hub.entity.Notification;
import com.smartcampus.hub.enums.NotificationType;
import com.smartcampus.hub.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<NotificationResponseDto> getAllNotifications() {
        return notificationRepository.findAll()
                .stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(this::mapToResponseDto)
                .toList();
    }

    public NotificationResponseDto markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id).orElse(null);

        if (notification == null) {
            return null;
        }

        notification.setIsRead(true);
        Notification updatedNotification = notificationRepository.save(notification);

        return mapToResponseDto(updatedNotification);
    }

    // Reusable helper so other services can create notifications easily.
    public void createNotification(NotificationType type, String title, String message) {
        Notification notification = new Notification();
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setIsRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        notificationRepository.save(notification);
    }

    private NotificationResponseDto mapToResponseDto(Notification notification) {
        return new NotificationResponseDto(
                notification.getId(),
                notification.getType(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getIsRead(),
                notification.getCreatedAt());
    }
}
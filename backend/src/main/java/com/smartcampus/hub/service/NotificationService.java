package com.smartcampus.hub.service;

import com.smartcampus.hub.dto.NotificationResponseDto;
import com.smartcampus.hub.entity.Notification;
import com.smartcampus.hub.entity.User;
import com.smartcampus.hub.enums.NotificationType;
import com.smartcampus.hub.enums.Role;
import com.smartcampus.hub.repository.NotificationRepository;
import com.smartcampus.hub.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;

    public NotificationService(
            NotificationRepository notificationRepository,
            UserRepository userRepository,
            CurrentUserService currentUserService) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.currentUserService = currentUserService;
    }

    public List<NotificationResponseDto> getAllNotifications() {
        User currentUser = currentUserService.getCurrentUser();

        if (currentUser == null) {
            return List.of();
        }

        return notificationRepository.findByRecipient(currentUser)
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

        User currentUser = currentUserService.getCurrentUser();

        if (currentUser == null ||
                notification.getRecipient() == null ||
                !notification.getRecipient().getId().equals(currentUser.getId())) {
            return null;
        }

        notification.setIsRead(true);
        Notification updatedNotification = notificationRepository.save(notification);

        return mapToResponseDto(updatedNotification);
    }

    public void createNotification(User recipient, NotificationType type, String title, String message) {
        if (recipient == null) {
            return;
        }

        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setIsRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        notificationRepository.save(notification);
    }

    public void notifyAdmins(NotificationType type, String title, String message) {
        userRepository.findByRole(Role.ADMIN)
                .forEach(admin -> createNotification(admin, type, title, message));
    }

    private NotificationResponseDto mapToResponseDto(Notification notification) {
        User recipient = notification.getRecipient();

        return new NotificationResponseDto(
                notification.getId(),
                recipient != null ? recipient.getId() : null,
                recipient != null ? recipient.getFullName() : null,
                notification.getType(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getIsRead(),
                notification.getCreatedAt());
    }
}

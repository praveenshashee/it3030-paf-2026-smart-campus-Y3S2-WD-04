package com.smartcampus.hub.dto;

import com.smartcampus.hub.enums.NotificationType;

import java.time.LocalDateTime;

public class NotificationResponseDto {

    private Long id;
    private Long recipientUserId;
    private String recipientName;
    private NotificationType type;
    private String title;
    private String message;
    private Boolean isRead;
    private LocalDateTime createdAt;

    public NotificationResponseDto(
            Long id,
            Long recipientUserId,
            String recipientName,
            NotificationType type,
            String title,
            String message,
            Boolean isRead,
            LocalDateTime createdAt) {
        this.id = id;
        this.recipientUserId = recipientUserId;
        this.recipientName = recipientName;
        this.type = type;
        this.title = title;
        this.message = message;
        this.isRead = isRead;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public Long getRecipientUserId() {
        return recipientUserId;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public NotificationType getType() {
        return type;
    }

    public String getTitle() {
        return title;
    }

    public String getMessage() {
        return message;
    }

    public Boolean getIsRead() {
        return isRead;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}

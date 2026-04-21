package com.smartcampus.hub.controller;

import com.smartcampus.hub.dto.NotificationResponseDto;
import com.smartcampus.hub.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<List<NotificationResponseDto>> getAllNotifications() {
        return ResponseEntity.ok(notificationService.getAllNotifications());
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationResponseDto> markAsRead(@PathVariable Long id) {
        NotificationResponseDto updatedNotification = notificationService.markAsRead(id);

        if (updatedNotification == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedNotification);
    }
}
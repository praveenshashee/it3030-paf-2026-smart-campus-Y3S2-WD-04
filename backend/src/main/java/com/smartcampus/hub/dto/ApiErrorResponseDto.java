package com.smartcampus.hub.dto;

import java.time.LocalDateTime;

public class ApiErrorResponseDto {

    private String message;
    private LocalDateTime timestamp;

    public ApiErrorResponseDto(String message) {
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }

    public String getMessage() {
        return message;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }
}

package com.smartcampus.hub.dto;

import com.smartcampus.hub.enums.BookingStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class BookingResponseDto {

    private Long id;
    private Long resourceId;
    private String resourceName;
    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String purpose;
    private Integer expectedAttendees;
    private BookingStatus status;
    private String adminReason;
    private LocalDateTime createdAt;

    public BookingResponseDto(
            Long id,
            Long resourceId,
            String resourceName,
            LocalDate bookingDate,
            LocalTime startTime,
            LocalTime endTime,
            String purpose,
            Integer expectedAttendees,
            BookingStatus status,
            String adminReason,
            LocalDateTime createdAt) {
        this.id = id;
        this.resourceId = resourceId;
        this.resourceName = resourceName;
        this.bookingDate = bookingDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.purpose = purpose;
        this.expectedAttendees = expectedAttendees;
        this.status = status;
        this.adminReason = adminReason;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public Long getResourceId() {
        return resourceId;
    }

    public String getResourceName() {
        return resourceName;
    }

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public String getPurpose() {
        return purpose;
    }

    public Integer getExpectedAttendees() {
        return expectedAttendees;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public String getAdminReason() {
        return adminReason;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
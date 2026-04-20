package com.smartcampus.hub.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

public class BookingRequestDto {

    @NotNull(message = "Resource id is required.")
    private Long resourceId;

    @NotNull(message = "Booking date is required.")
    private LocalDate bookingDate;

    @NotNull(message = "Start time is required.")
    private LocalTime startTime;

    @NotNull(message = "End time is required.")
    private LocalTime endTime;

    @NotBlank(message = "Purpose is required.")
    private String purpose;

    @NotNull(message = "Expected attendees is required.")
    @Min(value = 1, message = "Expected attendees must be at least 1.")
    private Integer expectedAttendees;

    public BookingRequestDto() {
    }

    public Long getResourceId() {
        return resourceId;
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

    public void setResourceId(Long resourceId) {
        this.resourceId = resourceId;
    }

    public void setBookingDate(LocalDate bookingDate) {
        this.bookingDate = bookingDate;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public void setExpectedAttendees(Integer expectedAttendees) {
        this.expectedAttendees = expectedAttendees;
    }
}
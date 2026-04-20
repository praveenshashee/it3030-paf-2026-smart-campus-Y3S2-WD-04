package com.smartcampus.hub.dto;

public class BookingStatusUpdateRequestDto {

    private String reason;

    public BookingStatusUpdateRequestDto() {
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
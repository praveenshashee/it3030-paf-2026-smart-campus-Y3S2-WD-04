package com.smartcampus.hub.dto;

import com.smartcampus.hub.enums.TicketPriority;
import com.smartcampus.hub.enums.TicketStatus;

import java.time.LocalDateTime;

public class TicketResponseDto {

    private Long id;
    private Long resourceId;
    private String resourceName;
    private String locationText;
    private String category;
    private String description;
    private TicketPriority priority;
    private String preferredContact;
    private TicketStatus status;
    private String assignedTechnicianName;
    private String resolutionNotes;
    private String rejectionReason;
    private LocalDateTime createdAt;

    public TicketResponseDto(
            Long id,
            Long resourceId,
            String resourceName,
            String locationText,
            String category,
            String description,
            TicketPriority priority,
            String preferredContact,
            TicketStatus status,
            String assignedTechnicianName,
            String resolutionNotes,
            String rejectionReason,
            LocalDateTime createdAt) {
        this.id = id;
        this.resourceId = resourceId;
        this.resourceName = resourceName;
        this.locationText = locationText;
        this.category = category;
        this.description = description;
        this.priority = priority;
        this.preferredContact = preferredContact;
        this.status = status;
        this.assignedTechnicianName = assignedTechnicianName;
        this.resolutionNotes = resolutionNotes;
        this.rejectionReason = rejectionReason;
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

    public String getLocationText() {
        return locationText;
    }

    public String getCategory() {
        return category;
    }

    public String getDescription() {
        return description;
    }

    public TicketPriority getPriority() {
        return priority;
    }

    public String getPreferredContact() {
        return preferredContact;
    }

    public TicketStatus getStatus() {
        return status;
    }

    public String getAssignedTechnicianName() {
        return assignedTechnicianName;
    }

    public String getResolutionNotes() {
        return resolutionNotes;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
package com.smartcampus.hub.dto;

import com.smartcampus.hub.enums.TicketPriority;
import com.smartcampus.hub.enums.TicketStatus;

import java.time.LocalDateTime;

public class TicketResponseDto {

    private Long id;
    private Long createdByUserId;
    private String createdByName;
    private String createdByEmail;
    private Long resourceId;
    private String resourceName;
    private String locationText;
    private String category;
    private String description;
    private TicketPriority priority;
    private String preferredContact;
    private TicketStatus status;
    private Long assignedTechnicianId;
    private String assignedTechnicianName;
    private String resolutionNotes;
    private String rejectionReason;
    private LocalDateTime createdAt;

    public TicketResponseDto(
            Long id,
            Long createdByUserId,
            String createdByName,
            String createdByEmail,
            Long resourceId,
            String resourceName,
            String locationText,
            String category,
            String description,
            TicketPriority priority,
            String preferredContact,
            TicketStatus status,
            Long assignedTechnicianId,
            String assignedTechnicianName,
            String resolutionNotes,
            String rejectionReason,
            LocalDateTime createdAt) {
        this.id = id;
        this.createdByUserId = createdByUserId;
        this.createdByName = createdByName;
        this.createdByEmail = createdByEmail;
        this.resourceId = resourceId;
        this.resourceName = resourceName;
        this.locationText = locationText;
        this.category = category;
        this.description = description;
        this.priority = priority;
        this.preferredContact = preferredContact;
        this.status = status;
        this.assignedTechnicianId = assignedTechnicianId;
        this.assignedTechnicianName = assignedTechnicianName;
        this.resolutionNotes = resolutionNotes;
        this.rejectionReason = rejectionReason;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public Long getCreatedByUserId() {
        return createdByUserId;
    }

    public String getCreatedByName() {
        return createdByName;
    }

    public String getCreatedByEmail() {
        return createdByEmail;
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

    public Long getAssignedTechnicianId() {
        return assignedTechnicianId;
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

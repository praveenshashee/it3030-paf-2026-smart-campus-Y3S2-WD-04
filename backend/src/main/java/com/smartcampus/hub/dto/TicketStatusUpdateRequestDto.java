package com.smartcampus.hub.dto;

import com.smartcampus.hub.enums.TicketStatus;
import jakarta.validation.constraints.NotNull;

public class TicketStatusUpdateRequestDto {

    @NotNull(message = "Status is required.")
    private TicketStatus status;

    private String assignedTechnicianName;
    private String resolutionNotes;
    private String rejectionReason;

    public TicketStatusUpdateRequestDto() {
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

    public void setStatus(TicketStatus status) {
        this.status = status;
    }

    public void setAssignedTechnicianName(String assignedTechnicianName) {
        this.assignedTechnicianName = assignedTechnicianName;
    }

    public void setResolutionNotes(String resolutionNotes) {
        this.resolutionNotes = resolutionNotes;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }
}
package com.smartcampus.hub.entity;

import com.smartcampus.hub.enums.TicketPriority;
import com.smartcampus.hub.enums.TicketStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tickets")
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // A ticket can optionally be linked to a specific resource.
    @ManyToOne
    @JoinColumn(name = "resource_id")
    private Resource resource;

    @ManyToOne
    @JoinColumn(name = "created_by_user_id")
    private User createdBy;

    @ManyToOne
    @JoinColumn(name = "assigned_technician_user_id")
    private User assignedTechnician;

    private String locationText;

    private String category;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    private TicketPriority priority;

    private String preferredContact;

    @Enumerated(EnumType.STRING)
    private TicketStatus status;

    private String assignedTechnicianName;

    @Column(length = 1000)
    private String resolutionNotes;

    private String rejectionReason;

    private LocalDateTime createdAt;

    public Ticket() {
    }

    public Long getId() {
        return id;
    }

    public Resource getResource() {
        return resource;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public User getAssignedTechnician() {
        return assignedTechnician;
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

    public void setId(Long id) {
        this.id = id;
    }

    public void setResource(Resource resource) {
        this.resource = resource;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public void setAssignedTechnician(User assignedTechnician) {
        this.assignedTechnician = assignedTechnician;
    }

    public void setLocationText(String locationText) {
        this.locationText = locationText;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setPriority(TicketPriority priority) {
        this.priority = priority;
    }

    public void setPreferredContact(String preferredContact) {
        this.preferredContact = preferredContact;
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

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

package com.smartcampus.hub.dto;

import com.smartcampus.hub.enums.TicketPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class TicketRequestDto {

    private Long resourceId;

    @NotBlank(message = "Location is required.")
    private String locationText;

    @NotBlank(message = "Category is required.")
    private String category;

    @NotBlank(message = "Description is required.")
    private String description;

    @NotNull(message = "Priority is required.")
    private TicketPriority priority;

    @NotBlank(message = "Preferred contact is required.")
    private String preferredContact;

    public TicketRequestDto() {
    }

    public Long getResourceId() {
        return resourceId;
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

    public void setResourceId(Long resourceId) {
        this.resourceId = resourceId;
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
}
package com.smartcampus.hub.dto;

import com.smartcampus.hub.enums.ResourceStatus;
import com.smartcampus.hub.enums.ResourceType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalTime;

public class ResourceRequestDto {

    @NotBlank(message = "Resource name is required.")
    private String name;

    @NotNull(message = "Resource type is required.")
    private ResourceType type;

    @NotNull(message = "Capacity is required.")
    @Min(value = 1, message = "Capacity must be at least 1.")
    private Integer capacity;

    @NotBlank(message = "Location is required.")
    private String location;

    private LocalTime availableFromTime;

    private LocalTime availableToTime;

    @NotNull(message = "Resource status is required.")
    private ResourceStatus status;

    public ResourceRequestDto() {
        // Needed so Spring can convert incoming JSON into this object.
    }

    public ResourceRequestDto(
            String name,
            ResourceType type,
            Integer capacity,
            String location,
            LocalTime availableFromTime,
            LocalTime availableToTime,
            ResourceStatus status) {
        this.name = name;
        this.type = type;
        this.capacity = capacity;
        this.location = location;
        this.availableFromTime = availableFromTime;
        this.availableToTime = availableToTime;
        this.status = status;
    }

    public String getName() {
        return name;
    }

    public ResourceType getType() {
        return type;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public String getLocation() {
        return location;
    }

    public LocalTime getAvailableFromTime() {
        return availableFromTime;
    }

    public LocalTime getAvailableToTime() {
        return availableToTime;
    }

    public ResourceStatus getStatus() {
        return status;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setType(ResourceType type) {
        this.type = type;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setAvailableFromTime(LocalTime availableFromTime) {
        this.availableFromTime = availableFromTime;
    }

    public void setAvailableToTime(LocalTime availableToTime) {
        this.availableToTime = availableToTime;
    }

    public void setStatus(ResourceStatus status) {
        this.status = status;
    }
}

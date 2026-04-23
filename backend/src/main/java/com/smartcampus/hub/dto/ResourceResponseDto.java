package com.smartcampus.hub.dto;

import com.smartcampus.hub.enums.ResourceStatus;
import com.smartcampus.hub.enums.ResourceType;

import java.time.LocalTime;

public class ResourceResponseDto {

    private Long id;
    private String name;
    private ResourceType type;
    private Integer capacity;
    private String location;
    private LocalTime availableFromTime;
    private LocalTime availableToTime;
    private ResourceStatus status;

    public ResourceResponseDto(Long id, String name, ResourceType type, Integer capacity, String location,
            LocalTime availableFromTime, LocalTime availableToTime,
            ResourceStatus status) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.capacity = capacity;
        this.location = location;
        this.availableFromTime = availableFromTime;
        this.availableToTime = availableToTime;
        this.status = status;
    }

    public Long getId() {
        return id;
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
}

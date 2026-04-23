package com.smartcampus.hub.entity;

import com.smartcampus.hub.enums.ResourceStatus;
import com.smartcampus.hub.enums.ResourceType;
import jakarta.persistence.*;

import java.time.LocalTime;

@Entity
@Table(name = "resources")
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Enumerated(EnumType.STRING)
    private ResourceType type;

    private Integer capacity;

    private String location;

    private LocalTime availableFromTime;

    private LocalTime availableToTime;

    @Enumerated(EnumType.STRING)
    private ResourceStatus status;

    public Resource() {
    }

    public Resource(Long id, String name, ResourceType type, Integer capacity, String location, ResourceStatus status) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.capacity = capacity;
        this.location = location;
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

    public void setId(Long id) {
        this.id = id;
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

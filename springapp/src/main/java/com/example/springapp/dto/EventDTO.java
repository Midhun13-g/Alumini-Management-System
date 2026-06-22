package com.example.springapp.dto;

import java.time.LocalDateTime;

public class EventDTO {
    private String title;
    private String description;
    private LocalDateTime dateTime;
    private String location;

    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public LocalDateTime getDateTime() { return dateTime; }
    public String getLocation() { return location; }

    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setDateTime(LocalDateTime dateTime) { this.dateTime = dateTime; }
    public void setLocation(String location) { this.location = location; }
}

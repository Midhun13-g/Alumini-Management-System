package com.example.springapp.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EventDTO {
    private String title;
    private String description;
    private LocalDateTime dateTime;
    private String location;
}

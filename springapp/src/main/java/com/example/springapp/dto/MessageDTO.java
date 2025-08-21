package com.example.springapp.dto;

import java.time.LocalDateTime;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor   // generates the constructor with all fields
@NoArgsConstructor    // generates empty constructor (sometimes needed for JPA/JSON)
public class MessageDTO {
    private Long id;
    private String content;
    private Long senderId;
    private LocalDateTime sentAt;
}

package com.example.springapp.dto;

import lombok.Data;

@Data  // Lombok for getters/setters
public class UserDTO {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String userType;
    private String profilePictureUrl;
    private boolean isActive;
    // We could add profile details here if needed, but keeping simple for now
}
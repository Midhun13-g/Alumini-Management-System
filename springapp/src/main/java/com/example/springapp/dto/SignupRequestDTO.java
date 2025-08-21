package com.example.springapp.dto;

import lombok.Data;

@Data  // Lombok for getters/setters
public class SignupRequestDTO {
    // Common user fields
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String userType;  // "ALUMNI" or "STUDENT"

    // Alumni-specific fields (optional, but required if userType=ALUMNI)
    private Integer graduationYear;
    private String industry;
    private String skills;
    private String bio;
    private Boolean isMentor;
    private String linkedinUrl;  // Shared with student

    // Student-specific fields (optional, but required if userType=STUDENT)
    private String studentId;
    private String department;
    private Integer yearOfJoining;
}
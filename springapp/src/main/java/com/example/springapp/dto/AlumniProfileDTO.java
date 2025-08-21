package com.example.springapp.dto;


import lombok.AllArgsConstructor;import lombok.Data;


@Data
@AllArgsConstructor
public class AlumniProfileDTO {
    private Long id;
    private String fullName;
    private String email;
    private String industry;
    private String skills;
    private String linkedinUrl;
}

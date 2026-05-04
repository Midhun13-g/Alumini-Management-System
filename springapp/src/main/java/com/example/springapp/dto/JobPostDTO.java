package com.example.springapp.dto;

import lombok.Data;

@Data
public class JobPostDTO {
    private String title;
    private String company;
    private String description;
    private String skillsRequired;
}

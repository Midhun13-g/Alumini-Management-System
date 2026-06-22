package com.example.springapp.dto;

public class JobPostDTO {
    private String title;
    private String company;
    private String description;
    private String skillsRequired;

    public String getTitle() { return title; }
    public String getCompany() { return company; }
    public String getDescription() { return description; }
    public String getSkillsRequired() { return skillsRequired; }

    public void setTitle(String title) { this.title = title; }
    public void setCompany(String company) { this.company = company; }
    public void setDescription(String description) { this.description = description; }
    public void setSkillsRequired(String skillsRequired) { this.skillsRequired = skillsRequired; }
}

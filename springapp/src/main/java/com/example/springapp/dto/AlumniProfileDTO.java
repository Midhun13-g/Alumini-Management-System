package com.example.springapp.dto;

public class AlumniProfileDTO {
    private Long id;
    private String fullName;
    private String email;
    private String industry;
    private String skills;
    private String linkedinUrl;

    public AlumniProfileDTO(Long id, String fullName, String email,
                             String industry, String skills, String linkedinUrl) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.industry = industry;
        this.skills = skills;
        this.linkedinUrl = linkedinUrl;
    }

    public Long getId() { return id; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public String getIndustry() { return industry; }
    public String getSkills() { return skills; }
    public String getLinkedinUrl() { return linkedinUrl; }

    public void setId(Long id) { this.id = id; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public void setEmail(String email) { this.email = email; }
    public void setIndustry(String industry) { this.industry = industry; }
    public void setSkills(String skills) { this.skills = skills; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }
}

package com.example.springapp.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "alumni_profiles")
public class AlumniProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "graduation_year")
    private Integer graduationYear;

    @Column
    private String industry;

    @Column
    private String skills;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "is_mentor")
    private Boolean isMentor;

    @Column(name = "linkedin_url")
    private String linkedinUrl;

    @Column(name = "is_verified", nullable = false)
    private boolean isVerified = false;

    public Long getId() { return id; }
    public User getUser() { return user; }
    public Integer getGraduationYear() { return graduationYear; }
    public String getIndustry() { return industry; }
    public String getSkills() { return skills; }
    public String getBio() { return bio; }
    public Boolean getIsMentor() { return isMentor; }
    public String getLinkedinUrl() { return linkedinUrl; }
    public boolean isVerified() { return isVerified; }

    public void setId(Long id) { this.id = id; }
    public void setUser(User user) { this.user = user; }
    public void setGraduationYear(Integer graduationYear) { this.graduationYear = graduationYear; }
    public void setIndustry(String industry) { this.industry = industry; }
    public void setSkills(String skills) { this.skills = skills; }
    public void setBio(String bio) { this.bio = bio; }
    public void setIsMentor(Boolean isMentor) { this.isMentor = isMentor; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }
    public void setVerified(boolean verified) { this.isVerified = verified; }
}

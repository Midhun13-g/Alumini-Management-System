package com.example.springapp.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "alumni_profiles")  // Maps to 'alumni_profiles' table
@Data  // Lombok for auto-generated methods
public class AlumniProfile {
    @Id  // Primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // Auto-increment
    private Long id;

    @OneToOne  // One-to-one relationship with User
    @JoinColumn(name = "user_id", nullable = false)  // Foreign key to users.id
    private User user;

    @Column(name = "graduation_year")  // Year of graduation
    private Integer graduationYear;

    @Column  // Industry the alumni works in
    private String industry;

    @Column  // Comma-separated skills
    private String skills;

    @Column(columnDefinition = "TEXT")  // Bio/description, longer text
    private String bio;

    @Column(name = "is_mentor")  // Boolean if willing to mentor
    private Boolean isMentor;

    @Column(name = "linkedin_url")  // LinkedIn profile URL
    private String linkedinUrl;
}
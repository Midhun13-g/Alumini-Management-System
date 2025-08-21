package com.example.springapp.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "student_profiles")  // Maps to 'student_profiles' table
@Data  // Lombok for auto-generated methods
public class StudentProfile {
    @Id  // Primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // Auto-increment
    private Long id;

    @OneToOne  // One-to-one relationship with User
    @JoinColumn(name = "user_id", nullable = false)  // Foreign key to users.id
    private User user;

    @Column(name = "student_name")  // Full name, auto-generated from first + last
    private String studentName;

    @Column(name = "student_id")  // Unique student ID (e.g., roll number)
    private String studentId;

    @Column  // Department (e.g., Computer Science)
    private String department;

    @Column(name = "year_of_joining")  // Year joined
    private Integer yearOfJoining;

    @Column(name = "linkedin_url")  // LinkedIn profile URL
    private String linkedinUrl;
}
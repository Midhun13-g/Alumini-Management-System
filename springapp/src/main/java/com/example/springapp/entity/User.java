package com.example.springapp.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users")  // Maps this class to 'users' table in DB
@Data  // Lombok annotation: auto-generates getters, setters, toString, equals, hashCode
public class User {
    @Id  // Primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // Auto-increment ID
    private Long id;

    @Column(unique = true, nullable = false)  // Email must be unique and not null
    private String email;

    @Column(nullable = false)  // Password is required, will be hashed
    private String password;

    @Column(name = "first_name", nullable = false)  // First name required
    private String firstName;

    @Column(name = "last_name", nullable = false)  // Last name required
    private String lastName;

    @Column(name = "user_type", nullable = false)  // User type: "ALUMNI" or "STUDENT"
    private String userType;

    @Column(name = "profile_picture_url")  // Optional URL for profile picture
    private String profilePictureUrl;

    @Column(name = "is_active")  // Defaults to true, indicates if account is active
    private boolean isActive = true;
}
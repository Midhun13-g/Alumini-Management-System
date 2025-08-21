package com.example.springapp.service;

import com.example.springapp.dto.SignupRequestDTO;
import com.example.springapp.dto.UserDTO;
import com.example.springapp.entity.AlumniProfile;
import com.example.springapp.entity.StudentProfile;
import com.example.springapp.entity.User;
import com.example.springapp.repository.AlumniProfileRepository;
import com.example.springapp.repository.StudentProfileRepository;
import com.example.springapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service  // Marks this as a Spring service bean
public class UserService {

    @Autowired  // Injects UserRepository dependency
    private UserRepository userRepository;

    @Autowired  // Injects AlumniProfileRepository
    private AlumniProfileRepository alumniProfileRepository;

    @Autowired  // Injects StudentProfileRepository
    private StudentProfileRepository studentProfileRepository;

    @Autowired  // Injects BCrypt encoder for password hashing
    private BCryptPasswordEncoder passwordEncoder;

    public UserDTO signup(SignupRequestDTO request) {
        // Validate email uniqueness
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        // Create and populate User entity
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));  // Hash password for security
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setUserType(request.getUserType());
        user.setProfilePictureUrl(null);  // Default to null; can be updated later
        user.setActive(true);

        // Save user to DB
        user = userRepository.save(user);

        // Create profile based on userType
        if ("ALUMNI".equals(request.getUserType())) {
            // Validate required alumni fields
            if (request.getGraduationYear() == null) {
                throw new RuntimeException("Graduation year required for alumni");
            }
            // Create AlumniProfile
            AlumniProfile profile = new AlumniProfile();
            profile.setUser(user);
            profile.setGraduationYear(request.getGraduationYear());
            profile.setIndustry(request.getIndustry());
            profile.setSkills(request.getSkills());
            profile.setBio(request.getBio());
            profile.setIsMentor(request.getIsMentor() != null ? request.getIsMentor() : false);  // Default false
            profile.setLinkedinUrl(request.getLinkedinUrl());
            alumniProfileRepository.save(profile);  // Save profile
        } else if ("STUDENT".equals(request.getUserType())) {
            // Validate required student fields
            if (request.getStudentId() == null || request.getYearOfJoining() == null) {
                throw new RuntimeException("Student ID and year of joining required for students");
            }
            // Create StudentProfile
            StudentProfile profile = new StudentProfile();
            profile.setUser(user);
            profile.setStudentName(request.getFirstName() + " " + request.getLastName());  // Auto-generate name
            profile.setStudentId(request.getStudentId());
            profile.setDepartment(request.getDepartment());
            profile.setYearOfJoining(request.getYearOfJoining());
            profile.setLinkedinUrl(request.getLinkedinUrl());
            studentProfileRepository.save(profile);  // Save profile
        } else {
            throw new RuntimeException("Invalid user type");
        }

        // Map saved user to DTO for response (excludes sensitive data like password)
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setEmail(user.getEmail());
        userDTO.setFirstName(user.getFirstName());
        userDTO.setLastName(user.getLastName());
        userDTO.setUserType(user.getUserType());
        userDTO.setProfilePictureUrl(user.getProfilePictureUrl());
        userDTO.setActive(user.isActive());

        return userDTO;
    }
}
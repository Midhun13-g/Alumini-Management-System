package com.example.springapp.service;

import com.example.springapp.entity.StudentProfile;
import com.example.springapp.entity.User;
import com.example.springapp.repository.StudentProfileRepository;
import com.example.springapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class StudentService {

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private UserRepository userRepository;

    public Optional<StudentProfile> getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
        return studentProfileRepository.findByUser(user);
    }

    public StudentProfile updateProfile(String email, StudentProfile updated) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        StudentProfile profile = studentProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found for user: " + email));

        profile.setDepartment(updated.getDepartment());
        profile.setYearOfJoining(updated.getYearOfJoining());
        profile.setLinkedinUrl(updated.getLinkedinUrl());

        return studentProfileRepository.save(profile);
    }
}

package com.example.springapp.service;

import com.example.springapp.entity.AlumniProfile;
import com.example.springapp.entity.User;
import com.example.springapp.repository.AlumniProfileRepository;
import com.example.springapp.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AlumniService {

    private final AlumniProfileRepository alumniProfileRepository;
    private final UserRepository userRepository;

    public AlumniService(AlumniProfileRepository alumniProfileRepository, UserRepository userRepository) {
        this.alumniProfileRepository = alumniProfileRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public AlumniProfile getMyProfile() {
        return alumniProfileRepository.findByUser(getCurrentUser())
                .orElseThrow(() -> new RuntimeException("Alumni profile not found"));
    }

    public AlumniProfile updateMyProfile(AlumniProfile updatedProfile) {
        AlumniProfile alumniProfile = alumniProfileRepository.findByUser(getCurrentUser())
                .orElseThrow(() -> new RuntimeException("Alumni profile not found"));
        alumniProfile.setIndustry(updatedProfile.getIndustry());
        alumniProfile.setSkills(updatedProfile.getSkills());
        return alumniProfileRepository.save(alumniProfile);
    }
}

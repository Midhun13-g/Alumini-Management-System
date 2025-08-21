package com.example.springapp.service;
import com.example.springapp.entity.AlumniProfile;
import com.example.springapp.entity.User;
import org.springframework.stereotype.Service;
import com.example.springapp.repository.AlumniProfileRepository;

import com.example.springapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Service
public class AlumniService {

    @Autowired
    private AlumniProfileRepository alumniProfileRepository;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName(); // this comes from UserDetails.getUsername()
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public AlumniProfile getMyProfile() {
        User currentUser = getCurrentUser();
        return alumniProfileRepository.findByUser(currentUser)
                .orElseThrow(() -> new RuntimeException("Alumni profile not found"));
    }

    public AlumniProfile updateMyProfile(AlumniProfile updatedProfile) {
        User currentUser = getCurrentUser();
        AlumniProfile alumniProfile = alumniProfileRepository.findByUser(currentUser)
                .orElseThrow(() -> new RuntimeException("Alumni profile not found"));
        alumniProfile.setIndustry(updatedProfile.getIndustry());
        alumniProfile.setSkills(updatedProfile.getSkills());
        return alumniProfileRepository.save(alumniProfile);
    }
}

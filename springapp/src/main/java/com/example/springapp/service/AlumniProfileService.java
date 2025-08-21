package com.example.springapp.service;

import com.example.springapp.entity.AlumniProfile;
import com.example.springapp.repository.AlumniProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AlumniProfileService {

    @Autowired
    private AlumniProfileRepository alumniProfileRepository;

    public List<AlumniProfile> searchAlumni(String query) {
        return alumniProfileRepository.searchAlumni(query);
    }

    public AlumniProfile getAlumniById(Long id) {
        return alumniProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alumni not found"));
    }
    
}

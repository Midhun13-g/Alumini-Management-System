package com.example.springapp.controller;

import com.example.springapp.entity.AlumniProfile;
import com.example.springapp.service.AlumniService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/alumni")
public class AlumniController {
    @Autowired
    private AlumniService alumniService;

    @GetMapping("/my")
    public ResponseEntity<AlumniProfile> getMyProfile() {
        AlumniProfile profile = alumniService.getMyProfile();
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/my")
    public ResponseEntity<AlumniProfile> updateMyProfile(@RequestBody AlumniProfile updatedProfile) {
        AlumniProfile profile = alumniService.updateMyProfile(updatedProfile);
        return ResponseEntity.ok(profile);
    }
}
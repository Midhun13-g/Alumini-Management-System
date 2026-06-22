package com.example.springapp.controller;

import com.example.springapp.entity.AlumniProfile;
import com.example.springapp.service.AlumniService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/alumni")
public class AlumniController {

    private final AlumniService alumniService;

    public AlumniController(AlumniService alumniService) {
        this.alumniService = alumniService;
    }

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
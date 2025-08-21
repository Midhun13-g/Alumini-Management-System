package com.example.springapp.controller;

import com.example.springapp.entity.AlumniProfile;
import com.example.springapp.service.AlumniProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/api/alumni")
@CrossOrigin(origins = "http://localhost:3000")
public class AlumniProfileController {

    @Autowired
    private AlumniProfileService alumniProfileService;

    @GetMapping("/search")
    public List<AlumniProfile> searchAlumni(@RequestParam("q") String query) {
        return alumniProfileService.searchAlumni(query);
    }

     @GetMapping("/{id}")
    public ResponseEntity<AlumniProfile> getAlumni(@PathVariable Long id) {
        AlumniProfile profile = alumniProfileService.getAlumniById(id);
        return ResponseEntity.ok(profile);
    }
}

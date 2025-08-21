package com.example.springapp.controller;

import com.example.springapp.entity.StudentProfile;
import com.example.springapp.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    @Autowired
    private StudentService studentService;

    private String getLoggedInEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getName(); // email from JWT subject
    }

    // 🟢 Get logged-in student profile
    @GetMapping("/my")
    public ResponseEntity<StudentProfile> getMyProfile() {
        return studentService.getProfile(getLoggedInEmail())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🟡 Update logged-in student profile
    @PutMapping("/my")
    public ResponseEntity<StudentProfile> updateMyProfile(@RequestBody StudentProfile update) {
        return ResponseEntity.ok(studentService.updateProfile(getLoggedInEmail(), update));
    }
}

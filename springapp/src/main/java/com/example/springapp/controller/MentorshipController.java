package com.example.springapp.controller;

import com.example.springapp.entity.MentorshipRequest;
import com.example.springapp.service.MentorshipService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mentorship")
public class MentorshipController {

    private final MentorshipService mentorshipService;

    public MentorshipController(MentorshipService mentorshipService) {
        this.mentorshipService = mentorshipService;
    }

    @PostMapping("/request/{alumniId}")
    public ResponseEntity<MentorshipRequest> sendRequest(
            @PathVariable Long alumniId,
            @RequestBody(required = false) Map<String, String> body) {
        String message = body != null ? body.getOrDefault("message", "") : "";
        return ResponseEntity.ok(mentorshipService.sendRequest(alumniId, message));
    }

    @GetMapping("/received")
    public ResponseEntity<List<MentorshipRequest>> getReceived() {
        return ResponseEntity.ok(mentorshipService.getReceived());
    }

    @GetMapping("/sent")
    public ResponseEntity<List<MentorshipRequest>> getSent() {
        return ResponseEntity.ok(mentorshipService.getSent());
    }

    @PostMapping("/accept/{id}")
    public ResponseEntity<MentorshipRequest> accept(@PathVariable Long id) {
        return ResponseEntity.ok(mentorshipService.accept(id));
    }

    @PostMapping("/reject/{id}")
    public ResponseEntity<MentorshipRequest> reject(@PathVariable Long id) {
        return ResponseEntity.ok(mentorshipService.reject(id));
    }
}

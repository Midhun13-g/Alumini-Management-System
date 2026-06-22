package com.example.springapp.controller;

import com.example.springapp.dto.JobPostDTO;
import com.example.springapp.entity.JobApplication;
import com.example.springapp.entity.JobPost;
import com.example.springapp.service.JobService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @PostMapping
    public ResponseEntity<JobPost> createJob(@RequestBody JobPostDTO dto) {
        return ResponseEntity.ok(jobService.createJob(dto));
    }

    @GetMapping
    public ResponseEntity<List<JobPost>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    @GetMapping("/my")
    public ResponseEntity<List<JobPost>> getMyJobs() {
        return ResponseEntity.ok(jobService.getMyJobs());
    }

    @PostMapping("/apply/{jobId}")
    public ResponseEntity<JobApplication> apply(
            @PathVariable Long jobId,
            @RequestBody(required = false) Map<String, String> body) {
        String resumeLink = body != null ? body.getOrDefault("resumeLink", "") : "";
        return ResponseEntity.ok(jobService.applyToJob(jobId, resumeLink));
    }

    @GetMapping("/applications")
    public ResponseEntity<List<JobApplication>> getApplications() {
        return ResponseEntity.ok(jobService.getApplicationsForMyJobs());
    }
}

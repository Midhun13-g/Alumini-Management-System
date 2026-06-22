package com.example.springapp.service;

import com.example.springapp.dto.JobPostDTO;
import com.example.springapp.entity.JobApplication;
import com.example.springapp.entity.JobPost;
import com.example.springapp.entity.Status;
import com.example.springapp.entity.User;
import com.example.springapp.repository.JobApplicationRepository;
import com.example.springapp.repository.JobPostRepository;
import com.example.springapp.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobService {

    private final JobPostRepository jobPostRepo;
    private final JobApplicationRepository jobApplicationRepo;
    private final UserRepository userRepo;

    public JobService(JobPostRepository jobPostRepo, JobApplicationRepository jobApplicationRepo,
                      UserRepository userRepo) {
        this.jobPostRepo = jobPostRepo;
        this.jobApplicationRepo = jobApplicationRepo;
        this.userRepo = userRepo;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public JobPost createJob(JobPostDTO dto) {
        User me = getCurrentUser();
        if (!"ALUMNI".equals(me.getUserType()))
            throw new IllegalStateException("Only alumni can post jobs");
        JobPost job = new JobPost();
        job.setTitle(dto.getTitle());
        job.setCompany(dto.getCompany());
        job.setDescription(dto.getDescription());
        job.setSkillsRequired(dto.getSkillsRequired());
        job.setPostedBy(me);
        return jobPostRepo.save(job);
    }

    public List<JobPost> getAllJobs() {
        return jobPostRepo.findAll();
    }

    public List<JobPost> getMyJobs() {
        return jobPostRepo.findByPostedBy_Id(getCurrentUser().getId());
    }

    public JobApplication applyToJob(Long jobId, String resumeLink) {
        User me = getCurrentUser();
        if (!"STUDENT".equals(me.getUserType()))
            throw new IllegalStateException("Only students can apply");
        jobApplicationRepo.findByJob_IdAndStudent_Id(jobId, me.getId())
                .ifPresent(a -> { throw new IllegalStateException("Already applied"); });
        JobPost job = jobPostRepo.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        JobApplication app = new JobApplication();
        app.setJob(job);
        app.setStudent(me);
        app.setResumeLink(resumeLink);
        app.setStatus(Status.PENDING);
        return jobApplicationRepo.save(app);
    }

    public List<JobApplication> getApplicationsForMyJobs() {
        return jobPostRepo.findByPostedBy_Id(getCurrentUser().getId()).stream()
                .flatMap(j -> jobApplicationRepo.findByJob_Id(j.getId()).stream())
                .toList();
    }
}

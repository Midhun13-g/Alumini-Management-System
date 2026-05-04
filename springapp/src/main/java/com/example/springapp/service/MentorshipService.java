package com.example.springapp.service;

import com.example.springapp.entity.MentorshipRequest;
import com.example.springapp.entity.Status;
import com.example.springapp.entity.User;
import com.example.springapp.repository.MentorshipRepository;
import com.example.springapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MentorshipService {

    private final MentorshipRepository mentorshipRepo;
    private final UserRepository userRepo;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public MentorshipRequest sendRequest(Long alumniId, String message) {
        User student = getCurrentUser();
        if (!"STUDENT".equals(student.getUserType()))
            throw new IllegalStateException("Only students can request mentorship");

        User alumni = userRepo.findById(alumniId)
                .orElseThrow(() -> new RuntimeException("Alumni not found"));

        mentorshipRepo.findByStudent_IdAndAlumni_Id(student.getId(), alumniId)
                .ifPresent(r -> { throw new IllegalStateException("Request already sent"); });

        MentorshipRequest req = new MentorshipRequest();
        req.setStudent(student);
        req.setAlumni(alumni);
        req.setMessage(message);
        return mentorshipRepo.save(req);
    }

    public List<MentorshipRequest> getReceived() {
        User me = getCurrentUser();
        return mentorshipRepo.findByAlumni_Id(me.getId());
    }

    public List<MentorshipRequest> getSent() {
        User me = getCurrentUser();
        return mentorshipRepo.findByStudent_Id(me.getId());
    }

    public MentorshipRequest accept(Long id) {
        User me = getCurrentUser();
        MentorshipRequest req = mentorshipRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        if (!req.getAlumni().getId().equals(me.getId()))
            throw new IllegalStateException("Not authorized");
        req.setStatus(Status.ACCEPTED);
        return mentorshipRepo.save(req);
    }

    public MentorshipRequest reject(Long id) {
        User me = getCurrentUser();
        MentorshipRequest req = mentorshipRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        if (!req.getAlumni().getId().equals(me.getId()))
            throw new IllegalStateException("Not authorized");
        req.setStatus(Status.REJECTED);
        return mentorshipRepo.save(req);
    }
}

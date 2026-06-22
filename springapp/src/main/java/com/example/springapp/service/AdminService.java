package com.example.springapp.service;

import com.example.springapp.dto.AdminStatsDTO;
import com.example.springapp.entity.*;
import com.example.springapp.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepo;
    private final AlumniProfileRepository alumniProfileRepo;
    private final StudentProfileRepository studentProfileRepo;
    private final ConnectRepository connectRepo;
    private final MessageRepository messageRepo;
    private final MentorshipRepository mentorshipRepo;
    private final EventRepository eventRepo;
    private final EventRegistrationRepository eventRegRepo;
    private final JobPostRepository jobPostRepo;
    private final JobApplicationRepository jobAppRepo;

    public AdminService(UserRepository userRepo, AlumniProfileRepository alumniProfileRepo,
                        StudentProfileRepository studentProfileRepo, ConnectRepository connectRepo,
                        MessageRepository messageRepo, MentorshipRepository mentorshipRepo,
                        EventRepository eventRepo, EventRegistrationRepository eventRegRepo,
                        JobPostRepository jobPostRepo, JobApplicationRepository jobAppRepo) {
        this.userRepo = userRepo;
        this.alumniProfileRepo = alumniProfileRepo;
        this.studentProfileRepo = studentProfileRepo;
        this.connectRepo = connectRepo;
        this.messageRepo = messageRepo;
        this.mentorshipRepo = mentorshipRepo;
        this.eventRepo = eventRepo;
        this.eventRegRepo = eventRegRepo;
        this.jobPostRepo = jobPostRepo;
        this.jobAppRepo = jobAppRepo;
    }

    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    @Transactional
    public void deleteUser(Long id) {
        messageRepo.deleteBySender_Id(id);

        List<ConnectEntity> connections = connectRepo.findBySender_IdOrReceiver_Id(id, id);
        for (ConnectEntity conn : connections) {
            messageRepo.deleteByConnection_Id(conn.getId());
        }
        connectRepo.deleteAll(connections);

        mentorshipRepo.deleteByStudent_Id(id);
        mentorshipRepo.deleteByAlumni_Id(id);

        eventRegRepo.deleteByUser_Id(id);

        jobAppRepo.deleteByStudent_Id(id);

        List<JobPost> postedJobs = jobPostRepo.findByPostedBy_Id(id);
        for (JobPost job : postedJobs) {
            jobAppRepo.deleteByJob_Id(job.getId());
        }
        jobPostRepo.deleteAll(postedJobs);

        List<Event> createdEvents = eventRepo.findByCreatedBy_Id(id);
        for (Event event : createdEvents) {
            eventRegRepo.deleteByEvent_Id(event.getId());
        }
        eventRepo.deleteAll(createdEvents);

        alumniProfileRepo.deleteByUser_Id(id);
        studentProfileRepo.deleteByUser_Id(id);

        userRepo.deleteById(id);
    }

    public User toggleUserActive(Long id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(!user.isActive());
        return userRepo.save(user);
    }

    public AlumniProfile verifyAlumni(Long userId) {
        AlumniProfile profile = alumniProfileRepo.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Alumni profile not found"));
        profile.setVerified(true);
        return alumniProfileRepo.save(profile);
    }

    public AdminStatsDTO getStats() {
        long total = userRepo.count();
        long alumni = userRepo.countByUserType("ALUMNI");
        long students = userRepo.countByUserType("STUDENT");
        long connections = connectRepo.count();
        long events = eventRepo.count();
        long jobs = jobPostRepo.count();
        return new AdminStatsDTO(total, alumni, students, connections, events, jobs);
    }

    public List<ConnectEntity> getAllConnections() {
        return connectRepo.findAll();
    }

    public List<Event> getAllEvents() {
        return eventRepo.findAll();
    }

    @Transactional
    public void deleteEvent(Long id) {
        eventRegRepo.deleteByEvent_Id(id);
        eventRepo.deleteById(id);
    }

    public List<JobPost> getAllJobs() {
        return jobPostRepo.findAll();
    }

    @Transactional
    public void deleteJob(Long id) {
        jobAppRepo.deleteByJob_Id(id);
        jobPostRepo.deleteById(id);
    }
}

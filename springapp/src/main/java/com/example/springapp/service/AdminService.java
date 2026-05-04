package com.example.springapp.service;

import com.example.springapp.dto.AdminStatsDTO;
import com.example.springapp.entity.*;
import com.example.springapp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
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

    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    @Transactional
    public void deleteUser(Long id) {
        // 1. Delete messages sent by this user
        messageRepo.deleteBySender_Id(id);

        // 2. Find all connections involving this user, delete their messages, then delete connections
        List<ConnectEntity> connections = connectRepo.findBySender_IdOrReceiver_Id(id, id);
        for (ConnectEntity conn : connections) {
            messageRepo.deleteByConnection_Id(conn.getId());
        }
        connectRepo.deleteAll(connections);

        // 3. Delete mentorship requests
        mentorshipRepo.deleteByStudent_Id(id);
        mentorshipRepo.deleteByAlumni_Id(id);

        // 4. Delete event registrations
        eventRegRepo.deleteByUser_Id(id);

        // 5. Delete job applications by this student
        jobAppRepo.deleteByStudent_Id(id);

        // 6. Delete job applications for jobs posted by this alumni, then delete the jobs
        List<JobPost> postedJobs = jobPostRepo.findByPostedBy_Id(id);
        for (JobPost job : postedJobs) {
            jobAppRepo.deleteByJob_Id(job.getId());
        }
        jobPostRepo.deleteAll(postedJobs);

        // 7. Delete events created by this user
        List<Event> createdEvents = eventRepo.findByCreatedBy_Id(id);
        for (Event event : createdEvents) {
            eventRegRepo.deleteByEvent_Id(event.getId());
        }
        eventRepo.deleteAll(createdEvents);

        // 8. Delete profile
        alumniProfileRepo.deleteByUser_Id(id);
        studentProfileRepo.deleteByUser_Id(id);

        // 9. Finally delete the user
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

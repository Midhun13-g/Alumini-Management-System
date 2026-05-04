package com.example.springapp.repository;

import com.example.springapp.entity.MentorshipRequest;
import com.example.springapp.entity.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MentorshipRepository extends JpaRepository<MentorshipRequest, Long> {
    List<MentorshipRequest> findByAlumni_Id(Long alumniId);
    List<MentorshipRequest> findByStudent_Id(Long studentId);
    Optional<MentorshipRequest> findByStudent_IdAndAlumni_Id(Long studentId, Long alumniId);
    void deleteByStudent_Id(Long studentId);
    void deleteByAlumni_Id(Long alumniId);
}

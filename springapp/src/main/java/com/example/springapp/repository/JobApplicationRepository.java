package com.example.springapp.repository;

import com.example.springapp.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByJob_Id(Long jobId);
    List<JobApplication> findByStudent_Id(Long studentId);
    Optional<JobApplication> findByJob_IdAndStudent_Id(Long jobId, Long studentId);
    void deleteByStudent_Id(Long studentId);
    void deleteByJob_Id(Long jobId);
}

package com.example.springapp.repository;

import com.example.springapp.entity.JobPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobPostRepository extends JpaRepository<JobPost, Long> {
    List<JobPost> findByPostedBy_Id(Long userId);
}

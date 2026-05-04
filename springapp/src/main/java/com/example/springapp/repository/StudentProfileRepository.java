package com.example.springapp.repository;

import com.example.springapp.entity.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.springapp.entity.User;
import java.util.Optional;
public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {
    Optional<StudentProfile> findByUser(User user);
    void deleteByUser_Id(Long userId);
}
package com.example.springapp.repository;

import com.example.springapp.entity.EventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Long> {
    List<EventRegistration> findByUser_Id(Long userId);
    Optional<EventRegistration> findByUser_IdAndEvent_Id(Long userId, Long eventId);
    void deleteByUser_Id(Long userId);
    void deleteByEvent_Id(Long eventId);
}

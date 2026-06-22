package com.example.springapp.service;

import com.example.springapp.dto.EventDTO;
import com.example.springapp.entity.Event;
import com.example.springapp.entity.EventRegistration;
import com.example.springapp.entity.User;
import com.example.springapp.repository.EventRegistrationRepository;
import com.example.springapp.repository.EventRepository;
import com.example.springapp.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {

    private final EventRepository eventRepo;
    private final EventRegistrationRepository registrationRepo;
    private final UserRepository userRepo;

    public EventService(EventRepository eventRepo, EventRegistrationRepository registrationRepo,
                        UserRepository userRepo) {
        this.eventRepo = eventRepo;
        this.registrationRepo = registrationRepo;
        this.userRepo = userRepo;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public Event createEvent(EventDTO dto) {
        User me = getCurrentUser();
        Event event = new Event();
        event.setTitle(dto.getTitle());
        event.setDescription(dto.getDescription());
        event.setDateTime(dto.getDateTime());
        event.setLocation(dto.getLocation());
        event.setCreatedBy(me);
        return eventRepo.save(event);
    }

    public List<Event> getAllEvents() {
        return eventRepo.findAll();
    }

    public EventRegistration register(Long eventId) {
        User me = getCurrentUser();
        registrationRepo.findByUser_IdAndEvent_Id(me.getId(), eventId)
                .ifPresent(r -> { throw new IllegalStateException("Already registered"); });
        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        EventRegistration reg = new EventRegistration();
        reg.setUser(me);
        reg.setEvent(event);
        return registrationRepo.save(reg);
    }

    public List<EventRegistration> getMyRegistrations() {
        return registrationRepo.findByUser_Id(getCurrentUser().getId());
    }
}

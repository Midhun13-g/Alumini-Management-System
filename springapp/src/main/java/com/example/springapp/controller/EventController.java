package com.example.springapp.controller;

import com.example.springapp.dto.EventDTO;
import com.example.springapp.entity.Event;
import com.example.springapp.entity.EventRegistration;
import com.example.springapp.service.EventService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @PostMapping
    public ResponseEntity<Event> createEvent(@RequestBody EventDTO dto) {
        return ResponseEntity.ok(eventService.createEvent(dto));
    }

    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @PostMapping("/register/{eventId}")
    public ResponseEntity<EventRegistration> register(@PathVariable Long eventId) {
        return ResponseEntity.ok(eventService.register(eventId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<EventRegistration>> getMyRegistrations() {
        return ResponseEntity.ok(eventService.getMyRegistrations());
    }
}

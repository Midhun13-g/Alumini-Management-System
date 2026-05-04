package com.example.springapp.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "event_registrations",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "event_id"})
)
@Data
public class EventRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;
}

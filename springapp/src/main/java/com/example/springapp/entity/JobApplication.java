package com.example.springapp.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "job_applications",
    uniqueConstraints = @UniqueConstraint(columnNames = {"job_id", "student_id"})
)
@Data
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "job_id", nullable = false)
    private JobPost job;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @Column(name = "resume_link")
    private String resumeLink;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDING;
}

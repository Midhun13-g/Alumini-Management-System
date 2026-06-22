package com.example.springapp.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "job_applications",
    uniqueConstraints = @UniqueConstraint(columnNames = {"job_id", "student_id"})
)
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

    public Long getId() { return id; }
    public JobPost getJob() { return job; }
    public User getStudent() { return student; }
    public String getResumeLink() { return resumeLink; }
    public Status getStatus() { return status; }

    public void setId(Long id) { this.id = id; }
    public void setJob(JobPost job) { this.job = job; }
    public void setStudent(User student) { this.student = student; }
    public void setResumeLink(String resumeLink) { this.resumeLink = resumeLink; }
    public void setStatus(Status status) { this.status = status; }
}

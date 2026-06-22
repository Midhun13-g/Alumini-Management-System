package com.example.springapp.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "student_profiles")
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "student_name")
    private String studentName;

    @Column(name = "student_id")
    private String studentId;

    @Column
    private String department;

    @Column(name = "year_of_joining")
    private Integer yearOfJoining;

    @Column(name = "linkedin_url")
    private String linkedinUrl;

    public Long getId() { return id; }
    public User getUser() { return user; }
    public String getStudentName() { return studentName; }
    public String getStudentId() { return studentId; }
    public String getDepartment() { return department; }
    public Integer getYearOfJoining() { return yearOfJoining; }
    public String getLinkedinUrl() { return linkedinUrl; }

    public void setId(Long id) { this.id = id; }
    public void setUser(User user) { this.user = user; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public void setDepartment(String department) { this.department = department; }
    public void setYearOfJoining(Integer yearOfJoining) { this.yearOfJoining = yearOfJoining; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }
}

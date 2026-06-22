package com.example.springapp.dto;

public class AdminStatsDTO {
    private long totalUsers;
    private long totalAlumni;
    private long totalStudents;
    private long totalConnections;
    private long totalEvents;
    private long totalJobs;

    public AdminStatsDTO(long totalUsers, long totalAlumni, long totalStudents,
                         long totalConnections, long totalEvents, long totalJobs) {
        this.totalUsers = totalUsers;
        this.totalAlumni = totalAlumni;
        this.totalStudents = totalStudents;
        this.totalConnections = totalConnections;
        this.totalEvents = totalEvents;
        this.totalJobs = totalJobs;
    }

    public long getTotalUsers() { return totalUsers; }
    public long getTotalAlumni() { return totalAlumni; }
    public long getTotalStudents() { return totalStudents; }
    public long getTotalConnections() { return totalConnections; }
    public long getTotalEvents() { return totalEvents; }
    public long getTotalJobs() { return totalJobs; }
}

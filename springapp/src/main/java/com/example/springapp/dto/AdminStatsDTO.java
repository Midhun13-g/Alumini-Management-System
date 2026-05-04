package com.example.springapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminStatsDTO {
    private long totalUsers;
    private long totalAlumni;
    private long totalStudents;
    private long totalConnections;
    private long totalEvents;
    private long totalJobs;
}

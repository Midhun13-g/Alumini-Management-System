package com.example.springapp.dto;

public class SignupRequestDTO {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String userType;
    private Integer graduationYear;
    private String industry;
    private String skills;
    private String bio;
    private Boolean isMentor;
    private String linkedinUrl;
    private String studentId;
    private String department;
    private Integer yearOfJoining;

    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getUserType() { return userType; }
    public Integer getGraduationYear() { return graduationYear; }
    public String getIndustry() { return industry; }
    public String getSkills() { return skills; }
    public String getBio() { return bio; }
    public Boolean getIsMentor() { return isMentor; }
    public String getLinkedinUrl() { return linkedinUrl; }
    public String getStudentId() { return studentId; }
    public String getDepartment() { return department; }
    public Integer getYearOfJoining() { return yearOfJoining; }

    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public void setUserType(String userType) { this.userType = userType; }
    public void setGraduationYear(Integer graduationYear) { this.graduationYear = graduationYear; }
    public void setIndustry(String industry) { this.industry = industry; }
    public void setSkills(String skills) { this.skills = skills; }
    public void setBio(String bio) { this.bio = bio; }
    public void setIsMentor(Boolean isMentor) { this.isMentor = isMentor; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public void setDepartment(String department) { this.department = department; }
    public void setYearOfJoining(Integer yearOfJoining) { this.yearOfJoining = yearOfJoining; }
}

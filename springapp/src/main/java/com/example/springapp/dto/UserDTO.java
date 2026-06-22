package com.example.springapp.dto;

public class UserDTO {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String userType;
    private String profilePictureUrl;
    private boolean isActive;

    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getUserType() { return userType; }
    public String getProfilePictureUrl() { return profilePictureUrl; }
    public boolean isActive() { return isActive; }

    public void setId(Long id) { this.id = id; }
    public void setEmail(String email) { this.email = email; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public void setUserType(String userType) { this.userType = userType; }
    public void setProfilePictureUrl(String profilePictureUrl) { this.profilePictureUrl = profilePictureUrl; }
    public void setActive(boolean active) { this.isActive = active; }
}

package com.example.springapp.dto;

public class LoginResponseDTO {
    private String token;
    private Long userId;
    private String email;
    private String firstName;
    private String lastName;
    private String userType;

    public LoginResponseDTO() {}

    public LoginResponseDTO(String token, Long userId, String email, String firstName, String lastName, String userType) {
        this.token = token;
        this.userId = userId;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.userType = userType;
    }

    public String getToken() { return token; }
    public Long getUserId() { return userId; }
    public String getEmail() { return email; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getUserType() { return userType; }

    public void setToken(String token) { this.token = token; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setEmail(String email) { this.email = email; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public void setUserType(String userType) { this.userType = userType; }
}

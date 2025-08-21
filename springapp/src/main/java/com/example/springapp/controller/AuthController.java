package com.example.springapp.controller;

import com.example.springapp.dto.LoginRequestDTO;
import com.example.springapp.dto.LoginResponseDTO;
import com.example.springapp.dto.SignupRequestDTO;
import com.example.springapp.dto.UserDTO;
import com.example.springapp.repository.UserRepository;
import com.example.springapp.security.JwtTokenProvider;
import com.example.springapp.service.UserService;
import com.example.springapp.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController  // Marks as REST controller, responses are JSON
@RequestMapping("/api/auth")  // Base path for auth endpoints
public class AuthController {

    @Autowired  // Injects UserService
    private UserService userService;

    @PostMapping("/signup")  // Handles POST requests to /api/auth/signup
    public ResponseEntity<UserDTO> signup(@RequestBody SignupRequestDTO request) {
        try {
            UserDTO userDTO = userService.signup(request);  // Calls service to process signup
            return ResponseEntity.ok(userDTO);  // Returns 200 OK with UserDTO
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);  // Returns 400 Bad Request on error
        }
    }
    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtTokenProvider jwtTokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO login) {
        var userOpt = userRepository.findByEmail(login.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        User user = userOpt.get();
        if (!user.isActive()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Account disabled");
        }

        boolean matches = passwordEncoder.matches(login.getPassword(), user.getPassword());
        if (!matches) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        String token = jwtTokenProvider.generateToken(
                user.getId(), user.getEmail(), user.getUserType()
        );

        return ResponseEntity.ok(new LoginResponseDTO(
                token,
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getUserType()
        ));
    }

    
}
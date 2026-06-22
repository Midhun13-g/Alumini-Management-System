package com.example.springapp.service;

import com.example.springapp.dto.SignupRequestDTO;
import com.example.springapp.dto.UserDTO;
import com.example.springapp.entity.AlumniProfile;
import com.example.springapp.entity.StudentProfile;
import com.example.springapp.entity.User;
import com.example.springapp.repository.AlumniProfileRepository;
import com.example.springapp.repository.StudentProfileRepository;
import com.example.springapp.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final AlumniProfileRepository alumniProfileRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, AlumniProfileRepository alumniProfileRepository,
                       StudentProfileRepository studentProfileRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.alumniProfileRepository = alumniProfileRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserDTO signup(SignupRequestDTO request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setUserType(request.getUserType());
        user.setActive(true);
        user = userRepository.save(user);

        if ("ALUMNI".equals(request.getUserType())) {
            if (request.getGraduationYear() == null)
                throw new RuntimeException("Graduation year required for alumni");
            AlumniProfile profile = new AlumniProfile();
            profile.setUser(user);
            profile.setGraduationYear(request.getGraduationYear());
            profile.setIndustry(request.getIndustry());
            profile.setSkills(request.getSkills());
            profile.setBio(request.getBio());
            profile.setIsMentor(request.getIsMentor() != null ? request.getIsMentor() : false);
            profile.setLinkedinUrl(request.getLinkedinUrl());
            alumniProfileRepository.save(profile);
        } else if ("STUDENT".equals(request.getUserType())) {
            if (request.getStudentId() == null || request.getYearOfJoining() == null)
                throw new RuntimeException("Student ID and year of joining required for students");
            StudentProfile profile = new StudentProfile();
            profile.setUser(user);
            profile.setStudentName(request.getFirstName() + " " + request.getLastName());
            profile.setStudentId(request.getStudentId());
            profile.setDepartment(request.getDepartment());
            profile.setYearOfJoining(request.getYearOfJoining());
            profile.setLinkedinUrl(request.getLinkedinUrl());
            studentProfileRepository.save(profile);
        } else {
            throw new RuntimeException("Invalid user type");
        }

        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setEmail(user.getEmail());
        userDTO.setFirstName(user.getFirstName());
        userDTO.setLastName(user.getLastName());
        userDTO.setUserType(user.getUserType());
        userDTO.setProfilePictureUrl(user.getProfilePictureUrl());
        userDTO.setActive(user.isActive());
        return userDTO;
    }
}

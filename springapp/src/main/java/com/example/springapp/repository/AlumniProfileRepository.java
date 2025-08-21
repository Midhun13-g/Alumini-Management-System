package com.example.springapp.repository;

import com.example.springapp.entity.AlumniProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import com.example.springapp.entity.User;
    @Repository
public interface AlumniProfileRepository extends JpaRepository<AlumniProfile, Long> {

    @Query("SELECT a FROM AlumniProfile a " +
           "JOIN a.user u " +
           "WHERE LOWER(u.firstName) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "   OR LOWER(u.lastName) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "   OR LOWER(a.industry) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "   OR LOWER(a.skills) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<AlumniProfile> searchAlumni(@Param("query") String query);

Optional<AlumniProfile> findByUser(User user);
}


package com.example.springapp.repository;

import com.example.springapp.entity.ConnectEntity;
import com.example.springapp.entity.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ConnectRepository extends JpaRepository<ConnectEntity, Long> {

    @Query("""
           SELECT c FROM ConnectEntity c
           WHERE (c.sender.id = :u1 AND c.receiver.id = :u2)
              OR (c.sender.id = :u2 AND c.receiver.id = :u1)
           """)
    Optional<ConnectEntity> findBetween(@Param("u1") Long u1, @Param("u2") Long u2);

    @Query("""
           SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END
           FROM ConnectEntity c
           WHERE (c.sender.id = :u1 AND c.receiver.id = :u2)
              OR (c.sender.id = :u2 AND c.receiver.id = :u1)
           """)
    boolean existsBetween(@Param("u1") Long u1, @Param("u2") Long u2);

    @Query("""
           SELECT c FROM ConnectEntity c
           WHERE (c.sender.id = :userId OR c.receiver.id = :userId)
             AND c.status = :status
           """)
    List<ConnectEntity> findForUserByStatus(@Param("userId") Long userId, @Param("status") Status status);

    @Query("""
           SELECT c FROM ConnectEntity c
           WHERE (c.sender.id = :userId OR c.receiver.id = :userId)
           """)
    List<ConnectEntity> findAllForUser(@Param("userId") Long userId);

    List<ConnectEntity> findByReceiver_IdAndStatus(Long receiverId, Status status);
    List<ConnectEntity> findBySender_IdAndStatus(Long senderId, Status status);
}

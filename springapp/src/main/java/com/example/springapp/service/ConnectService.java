package com.example.springapp.service;

import com.example.springapp.entity.ConnectEntity;
import com.example.springapp.entity.Status;
import com.example.springapp.entity.User;
import com.example.springapp.repository.ConnectRepository;
import com.example.springapp.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConnectService {

    private final ConnectRepository connectRepo;
    private final UserRepository userRepo;

    public ConnectService(ConnectRepository connectRepo, UserRepository userRepo) {
        this.connectRepo = connectRepo;
        this.userRepo = userRepo;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public ConnectEntity createConnection(Long receiverId) {
        User me = getCurrentUser();
        if (me.getId().equals(receiverId)) {
            throw new IllegalArgumentException("Cannot connect with yourself");
        }
        User receiver = userRepo.findById(receiverId).orElseThrow(() -> new RuntimeException("Receiver not found"));

        // Symmetric uniqueness: block A→B if B→A or A→B exists
        var existing = connectRepo.findBetween(me.getId(), receiverId);
        if (existing.isPresent()) {
            // Optionally, if status == REJECTED you could flip to PENDING again
            return existing.get();
        }

        ConnectEntity c = new ConnectEntity();
        c.setSender(me);
        c.setReceiver(receiver);
        c.setStatus(Status.PENDING);
        return connectRepo.save(c);
    }

    public List<ConnectEntity> getReceivedPendingConnections() {
        User me = getCurrentUser();
        return connectRepo.findByReceiver_IdAndStatus(me.getId(), Status.PENDING);
    }

    public List<ConnectEntity> getSentPendingConnections() {
        User me = getCurrentUser();
        return connectRepo.findBySender_IdAndStatus(me.getId(), Status.PENDING);
    }

    public void deletePendingConnection(Long id) {
        User me = getCurrentUser();
        ConnectEntity c = connectRepo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        // Only the sender can cancel their outgoing pending request
        if (!c.getStatus().equals(Status.PENDING) || !c.getSender().getId().equals(me.getId())) {
            throw new IllegalStateException("Cannot delete");
        }
        connectRepo.delete(c);
    }

    public ConnectEntity acceptConnection(Long id) {
        User me = getCurrentUser();
        ConnectEntity c = connectRepo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        // Only the receiver can accept
        if (!c.getReceiver().getId().equals(me.getId()) || c.getStatus() != Status.PENDING) {
            throw new IllegalStateException("Cannot accept");
        }
        c.setStatus(Status.ACCEPTED);
        return connectRepo.save(c);
    }

    public void rejectConnection(Long id) {
        User me = getCurrentUser();
        ConnectEntity c = connectRepo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        // Only the receiver can reject
        if (!c.getReceiver().getId().equals(me.getId()) || c.getStatus() != Status.PENDING) {
            throw new IllegalStateException("Cannot reject");
        }
        c.setStatus(Status.REJECTED);
        connectRepo.save(c);
    }

    public List<ConnectEntity> getAcceptedConnections() {
        User me = getCurrentUser();
        return connectRepo.findForUserByStatus(me.getId(), Status.ACCEPTED);
    }

    public List<ConnectEntity> getAllConnectionsForMe() {
        User me = getCurrentUser();
        return connectRepo.findAllForUser(me.getId());
    }
}

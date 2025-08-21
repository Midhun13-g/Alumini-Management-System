package com.example.springapp.controller;

import com.example.springapp.dto.ConnectRequest;
import com.example.springapp.entity.ConnectEntity;
import com.example.springapp.service.ConnectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/connect")
public class ConnectController {

    private final ConnectService connectService;

    public ConnectController(ConnectService connectService) {
        this.connectService = connectService;
    }

    @GetMapping("/received/pending")
    public ResponseEntity<List<ConnectEntity>> getReceivedPendingConnections() {
        return ResponseEntity.ok(connectService.getReceivedPendingConnections());
    }

    @GetMapping("/sent/pending")
    public ResponseEntity<List<ConnectEntity>> getSentPendingConnections() {
        return ResponseEntity.ok(connectService.getSentPendingConnections());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePendingConnection(@PathVariable Long id) {
        connectService.deletePendingConnection(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/accept/{id}")
    public ResponseEntity<ConnectEntity> acceptConnection(@PathVariable Long id) {
        return ResponseEntity.ok(connectService.acceptConnection(id));
    }

    @PostMapping("/reject/{id}")
    public ResponseEntity<Void> rejectConnection(@PathVariable Long id) {
        connectService.rejectConnection(id);
        return ResponseEntity.ok().build();
    }

    // ✅ Create request (uses DTO, no duplicate method now)
    @PostMapping
    public ResponseEntity<ConnectEntity> createConnection(@RequestBody ConnectRequest req) {
        return ResponseEntity.ok(connectService.createConnection(req.getReceiverId()));
    }

    @GetMapping("/accepted")
    public ResponseEntity<List<ConnectEntity>> getAcceptedConnections() {
        return ResponseEntity.ok(connectService.getAcceptedConnections());
    }

    // Useful for frontend status merging
    @GetMapping("/all")
    public ResponseEntity<List<ConnectEntity>> getAllMyConnections() {
        return ResponseEntity.ok(connectService.getAllConnectionsForMe());
    }
}

package com.example.springapp.controller;

import com.example.springapp.dto.MessageDTO;
import com.example.springapp.service.MessageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping("/{connectionId}")
    public ResponseEntity<List<MessageDTO>> getMessages(@PathVariable Long connectionId) {
        return ResponseEntity.ok(messageService.getMessages(connectionId));
    }

    @PostMapping("/{connectionId}")
    public ResponseEntity<MessageDTO> sendMessage(
            @PathVariable Long connectionId,
            @RequestBody Map<String, String> payload
    ) {
        String content = payload.get("content");
        return ResponseEntity.ok(messageService.sendMessage(connectionId, content));
    }
}

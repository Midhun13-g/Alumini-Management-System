package com.example.springapp.dto;

import java.time.LocalDateTime;

public class MessageDTO {
    private Long id;
    private String content;
    private Long senderId;
    private LocalDateTime sentAt;

    public MessageDTO() {}

    public MessageDTO(Long id, String content, Long senderId, LocalDateTime sentAt) {
        this.id = id;
        this.content = content;
        this.senderId = senderId;
        this.sentAt = sentAt;
    }

    public Long getId() { return id; }
    public String getContent() { return content; }
    public Long getSenderId() { return senderId; }
    public LocalDateTime getSentAt() { return sentAt; }

    public void setId(Long id) { this.id = id; }
    public void setContent(String content) { this.content = content; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }
    public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }
}

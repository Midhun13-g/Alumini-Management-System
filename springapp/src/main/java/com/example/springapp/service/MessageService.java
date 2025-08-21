package com.example.springapp.service;

import com.example.springapp.dto.MessageDTO;
import com.example.springapp.entity.ConnectEntity;
import com.example.springapp.entity.MessageEntity;
import com.example.springapp.entity.User;
import com.example.springapp.repository.ConnectRepository;
import com.example.springapp.repository.MessageRepository;
import com.example.springapp.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final ConnectRepository connectRepository;
    private final UserRepository userRepository;

    public MessageService(MessageRepository messageRepository,
                          ConnectRepository connectRepository,
                          UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.connectRepository = connectRepository;
        this.userRepository = userRepository;
    }

    // Fetch messages as DTOs
    public List<MessageDTO> getMessages(Long connectionId) {
        ConnectEntity connection = connectRepository.findById(connectionId)
                .orElseThrow(() -> new RuntimeException("Connection not found"));

        return messageRepository.findByConnectionOrderBySentAtAsc(connection)
                .stream()
                .map(msg -> new MessageDTO(
                        msg.getId(),
                        msg.getContent(),
                        msg.getSender().getId(),       // use senderId
                        msg.getSentAt()
                ))
                .collect(Collectors.toList());
    }

    // Send message, use authenticated user
    public MessageDTO sendMessage(Long connectionId, String content) {
        ConnectEntity connection = connectRepository.findById(connectionId)
                .orElseThrow(() -> new RuntimeException("Connection not found"));

        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        String email = userDetails.getUsername();

        User sender = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        MessageEntity message = new MessageEntity();
        message.setConnection(connection);
        message.setSender(sender);
        message.setContent(content);

        MessageEntity saved = messageRepository.save(message);

        return new MessageDTO(
                saved.getId(),
                saved.getContent(),
                saved.getSender().getId(),   // use senderId
                saved.getSentAt()
        );
    }
}

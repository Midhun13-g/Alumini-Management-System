package com.example.springapp.repository;

import com.example.springapp.entity.MessageEntity;
import com.example.springapp.entity.ConnectEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MessageRepository extends JpaRepository<MessageEntity, Long> {
    List<MessageEntity> findByConnectionOrderBySentAtAsc(ConnectEntity connection);
}

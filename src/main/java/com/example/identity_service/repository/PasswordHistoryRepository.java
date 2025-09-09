package com.example.identity_service.repository;

import com.example.identity_service.entity.PasswordHistory;
import com.example.identity_service.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PasswordHistoryRepository extends JpaRepository<PasswordHistory, String> {
    List<PasswordHistory> findByUserOrderByCreatedAtDesc(User user);
}

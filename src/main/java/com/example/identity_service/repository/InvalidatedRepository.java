package com.example.identity_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.identity_service.entity.InvalidatedToken;

public interface InvalidatedRepository extends JpaRepository<InvalidatedToken, String> {}

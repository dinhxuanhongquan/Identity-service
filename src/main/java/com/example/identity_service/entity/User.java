package com.example.identity_service.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

import jakarta.persistence.*;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter 
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(name = "username", unique = true, columnDefinition = "VARCHAR(255) COLLATE utf8mb4_unicode_ci")
    String username;

    @Column(name = "email", unique = true, nullable = false)
    String email;

    String password;
    String firstName;
    LocalDate dob;
    String lastName;

    @Column(name = "verification_code")
    String verificationCode;

    @Column(name = "is_verified", nullable = false)
    @Builder.Default
    Boolean isVerified = false;

    @Column(name = "verification_code_expiry")
    LocalDateTime verificationCodeExpiry;

    @Column(name = "created_at")
    @Builder.Default
    LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    LocalDateTime updatedAt = LocalDateTime.now();

    @ManyToMany
    Set<Role> roles;
}
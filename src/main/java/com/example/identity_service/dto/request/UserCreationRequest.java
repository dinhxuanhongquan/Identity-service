package com.example.identity_service.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.Size;

import com.example.identity_service.validator.DobConstraint;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationRequest {
    // Valid username
    @Size(min = 4, message = "USERNAME_VALIDATION")
    String username;
    // Valid password
    @Size(min = 4, message = "PASSWORD_VALIDATION")
    String password;

    String firstName;
    String lastName;

    @DobConstraint(min = 18, message = "INVALID_DOB")
    LocalDate dob;
}

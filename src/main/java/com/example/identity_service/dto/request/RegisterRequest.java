package com.example.identity_service.dto.request;

import com.example.identity_service.validator.EmailConstraint;
import com.example.identity_service.validator.PasswordConstraint;
import com.example.identity_service.validator.UsernameConstraint;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RegisterRequest {
    @NotBlank(message = "Username không được để trống")
    @UsernameConstraint
    String username;

    @NotBlank(message = "Password không được để trống")
    @PasswordConstraint
    String password;

    @NotBlank(message = "Email không được để trống")
    @EmailConstraint
    String email;

    @NotBlank(message = "Họ không được để trống")
    String firstName;

    @NotBlank(message = "Tên không được để trống")
    String lastName;

    @NotNull(message = "Ngày sinh không được để trống")
    LocalDate dob;
}

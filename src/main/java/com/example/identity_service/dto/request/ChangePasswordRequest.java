package com.example.identity_service.dto.request;

import com.example.identity_service.validator.PasswordConstraint;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChangePasswordRequest {
    @NotBlank(message = "Password cũ không được để trống")
    String oldPassword;

    @NotBlank(message = "Password mới không được để trống")
    @PasswordConstraint
    String newPassword;
}

package com.example.identity_service.controller;

import java.text.ParseException;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.identity_service.dto.request.*;
import com.example.identity_service.dto.response.AuthenticationResponse;
import com.example.identity_service.dto.response.ChangePasswordResponse;
import com.example.identity_service.dto.response.ForgotPasswordResponse;
import com.example.identity_service.dto.response.IntrospectResponse;
import com.example.identity_service.dto.response.RegisterResponse;
import com.example.identity_service.dto.response.VerifyEmailResponse;
import com.example.identity_service.service.AuthenticationService;
import com.nimbusds.jose.JOSEException;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    AuthenticationService authenticationService;

    @PostMapping("/login")
    ApiResponse<AuthenticationResponse> login(@Valid @RequestBody AuthenticationRequest request) {
        var result = authenticationService.authenticate(request);
        return ApiResponse.<AuthenticationResponse>builder().result(result).build();
    }

    @PostMapping("/introspect")
    ApiResponse<IntrospectResponse> authenticate(@RequestBody IntrospectRequest request)
            throws JOSEException, ParseException {
        var result = authenticationService.introspect(request);
        // return value after authenticate username and password from request by user.
        return ApiResponse.<IntrospectResponse>builder().result(result).build();
    }

    @PostMapping("/logout")
    ApiResponse<Void> logout(@RequestBody LogoutRequest request) throws JOSEException, ParseException {
        authenticationService.logout(request);
        return ApiResponse.<Void>builder().build();
    }

    @PostMapping("/refresh")
    ApiResponse<AuthenticationResponse> refresh(@RequestBody RefreshRequest request)
            throws JOSEException, ParseException {
        var result = authenticationService.refresh(request);
        return ApiResponse.<AuthenticationResponse>builder().result(result).build();
    }

    @PostMapping("/register")
    ApiResponse<RegisterResponse> register(@Valid @RequestBody RegisterRequest request) {
        var result = authenticationService.register(request);
        return ApiResponse.<RegisterResponse>builder().result(result).build();
    }

    @PostMapping("/verify-email")
    ApiResponse<VerifyEmailResponse> verifyEmail(@Valid @RequestBody VerifyEmailRequest request) {
        var result = authenticationService.verifyEmail(request);
        return ApiResponse.<VerifyEmailResponse>builder().result(result).build();
    }

    @PostMapping("/change-password")
    ApiResponse<ChangePasswordResponse> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            @RequestHeader("Authorization") String token) throws JOSEException, ParseException {
        // Remove "Bearer " prefix from token
        String cleanToken = token.replace("Bearer ", "");
        var result = authenticationService.changePassword(request, cleanToken);
        return ApiResponse.<ChangePasswordResponse>builder().result(result).build();
    }

    @PostMapping("/send-password-reset-code")
    ApiResponse<ForgotPasswordResponse> sendPasswordResetCode(@Valid @RequestBody SendPasswordResetCodeRequest request) {
        var result = authenticationService.sendPasswordResetCode(request);
        return ApiResponse.<ForgotPasswordResponse>builder().result(result).build();
    }

    @PostMapping("/reset-password-with-code")
    ApiResponse<ForgotPasswordResponse> resetPasswordWithCode(@Valid @RequestBody ForgotPasswordRequest request) {
        var result = authenticationService.resetPasswordWithCode(request);
        return ApiResponse.<ForgotPasswordResponse>builder().result(result).build();
    }
}

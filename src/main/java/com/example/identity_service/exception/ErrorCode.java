package com.example.identity_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

import lombok.Getter;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized Error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Uncategorized error", HttpStatus.BAD_REQUEST),
    USER_EXISTED(1002, "User already existed", HttpStatus.BAD_REQUEST),
    USERNAME_VALIDATION(1003, "Username must be {min} characters long", HttpStatus.BAD_REQUEST),
    PASSWORD_VALIDATION(1004, "Password must be {min} characters long", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1005, "User not existed", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1006, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1007, "You do not have permission", HttpStatus.FORBIDDEN),
    INVALID_DOB(1008, "Your age must be at least {min}", HttpStatus.BAD_REQUEST),
    EMAIL_EXISTED(1009, "Email already existed", HttpStatus.BAD_REQUEST),
    USER_NOT_VERIFIED(1010, "User not verified", HttpStatus.BAD_REQUEST),
    INVALID_VERIFICATION_CODE(1011, "Invalid verification code", HttpStatus.BAD_REQUEST),
    VERIFICATION_CODE_EXPIRED(1012, "Verification code expired", HttpStatus.BAD_REQUEST),
    INVALID_OLD_PASSWORD(1013, "Invalid old password", HttpStatus.BAD_REQUEST),
    NEW_PASSWORD_SAME_AS_OLD(1014, "New password cannot be the same as old password", HttpStatus.BAD_REQUEST),

    ;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
}

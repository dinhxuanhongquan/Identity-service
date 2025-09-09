package com.example.identity_service.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class UsernameValidator implements ConstraintValidator<UsernameConstraint, String> {
    
    @Override
    public void initialize(UsernameConstraint constraintAnnotation) {
    }
    
    @Override
    public boolean isValid(String username, ConstraintValidatorContext context) {
        if (username == null || username.trim().isEmpty()) {
            return false;
        }
        
        // Kiểm tra độ dài 8-24 ký tự
        if (username.length() < 8 || username.length() > 24) {
            return false;
        }
        
        // Kiểm tra không có ký tự đặc biệt (chỉ cho phép chữ cái, số và dấu gạch dưới)
        if (!username.matches("^[a-zA-Z0-9_]+$")) {
            return false;
        }
        
        // Kiểm tra có ít nhất 1 chữ cái
        if (!username.matches(".*[a-zA-Z].*")) {
            return false;
        }
        
        // Kiểm tra có ít nhất 1 số
        if (!username.matches(".*[0-9].*")) {
            return false;
        }
        
        return true;
    }
}

package com.example.identity_service.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordValidator implements ConstraintValidator<PasswordConstraint, String> {
    
    @Override
    public void initialize(PasswordConstraint constraintAnnotation) {
    }
    
    @Override
    public boolean isValid(String password, ConstraintValidatorContext context) {
        if (password == null || password.trim().isEmpty()) {
            return false;
        }
        
        // Kiểm tra chỉ chứa chữ cái và số
        return password.matches("^[a-zA-Z0-9]+$");
    }
}

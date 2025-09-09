package com.example.identity_service.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.regex.Pattern;

public class EmailValidator implements ConstraintValidator<EmailConstraint, String> {
    
    private static final String EMAIL_PATTERN = 
        "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
    
    private static final Pattern pattern = Pattern.compile(EMAIL_PATTERN);
    
    // Danh sách các domain email ảo phổ biến
    private static final String[] FAKE_EMAIL_DOMAINS = {
        "10minutemail.com", "tempmail.org", "guerrillamail.com", 
        "mailinator.com", "temp-mail.org", "throwaway.email",
        "getnada.com", "maildrop.cc", "sharklasers.com"
    };
    
    @Override
    public void initialize(EmailConstraint constraintAnnotation) {
    }
    
    @Override
    public boolean isValid(String email, ConstraintValidatorContext context) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        
        // Kiểm tra format email
        if (!pattern.matcher(email).matches()) {
            return false;
        }
        
        // Kiểm tra email ảo
        String domain = email.substring(email.lastIndexOf("@") + 1).toLowerCase();
        for (String fakeDomain : FAKE_EMAIL_DOMAINS) {
            if (domain.equals(fakeDomain)) {
                return false;
            }
        }
        
        return true;
    }
}

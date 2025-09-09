package com.example.identity_service.controller;

import com.example.identity_service.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/test")
@RequiredArgsConstructor
public class TestController {
    
    private final EmailService emailService;
    
    @PostMapping("/send-email")
    public String testEmail(@RequestParam String email, @RequestParam String code) {
        try {
            emailService.sendVerificationEmail(email, code);
            return "Email sent successfully to: " + email;
        } catch (Exception e) {
            return "Failed to send email: " + e.getMessage();
        }
    }
}

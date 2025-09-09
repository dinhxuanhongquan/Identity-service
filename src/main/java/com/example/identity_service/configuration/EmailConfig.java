package com.example.identity_service.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

@Configuration
@ConditionalOnProperty(name = "spring.mail.host")
public class EmailConfig {
    // Spring Boot sẽ tự động cấu hình JavaMailSender từ spring.mail properties
}

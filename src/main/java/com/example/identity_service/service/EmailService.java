package com.example.identity_service.service;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmailService {
    @Autowired
    JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    String fromEmail;

    public void sendVerificationEmail(String toEmail, String verificationCode) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Xác thực tài khoản - Identity Service");
            message.setText(buildVerificationEmailContent(verificationCode));

            mailSender.send(message);
            log.info("Verification email sent successfully to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send verification email to: {}", toEmail, e);
            throw new RuntimeException("Không thể gửi email xác thực", e);
        }
    }

    public void sendPasswordChangeNotification(String toEmail, String username) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Thông báo đổi mật khẩu - Identity Service");
            message.setText(buildPasswordChangeNotificationContent(username));

            mailSender.send(message);
            log.info("Password change notification sent successfully to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send password change notification to: {}", toEmail, e);
            throw new RuntimeException("Không thể gửi email thông báo", e);
        }
    }

    private String buildVerificationEmailContent(String verificationCode) {
        return String.format("""
            Chào bạn,
            
            Cảm ơn bạn đã đăng ký tài khoản tại Identity Service.
            
            Mã xác thực của bạn là: %s
            
            Vui lòng sử dụng mã này để xác thực tài khoản của bạn.
            Mã này có hiệu lực trong 15 phút.
            
            Nếu bạn không yêu cầu tạo tài khoản này, vui lòng bỏ qua email này.
            
            Trân trọng,
            Identity Service Team
            """, verificationCode);
    }

    public void sendPasswordResetCode(String toEmail, String verificationCode) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Mã xác thực đặt lại mật khẩu - Identity Service");
            message.setText(buildPasswordResetCodeContent(verificationCode));

            mailSender.send(message);
            log.info("Password reset code sent successfully to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send password reset code to: {}", toEmail, e);
            throw new RuntimeException("Không thể gửi mã xác thực đặt lại mật khẩu", e);
        }
    }

    private String buildPasswordResetCodeContent(String verificationCode) {
        return String.format("""
            Chào bạn,
            
            Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.
            
            Mã xác thực của bạn là: %s
            
            Vui lòng sử dụng mã này để đặt lại mật khẩu.
            Mã này có hiệu lực trong 10 phút.
            
            Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
            
            Trân trọng,
            Identity Service Team
            """, verificationCode);
    }

    private String buildPasswordChangeNotificationContent(String username) {
        return String.format("""
            Chào %s,
            
            Mật khẩu tài khoản của bạn đã được thay đổi thành công.
            
            Nếu bạn không thực hiện thay đổi này, vui lòng liên hệ với chúng tôi ngay lập tức.
            
            Trân trọng,
            Identity Service Team
            """, username);
    }
}

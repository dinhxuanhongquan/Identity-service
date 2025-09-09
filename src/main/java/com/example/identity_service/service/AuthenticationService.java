package com.example.identity_service.service;

import java.text.ParseException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Random;
import java.util.StringJoiner;
import java.util.UUID;

import com.example.identity_service.dto.request.*;
import com.example.identity_service.dto.response.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.example.identity_service.entity.InvalidatedToken;
import com.example.identity_service.entity.PasswordHistory;
import com.example.identity_service.entity.User;
import com.example.identity_service.exception.AppException;
import com.example.identity_service.exception.ErrorCode;
import com.example.identity_service.repository.InvalidatedRepository;
import com.example.identity_service.repository.PasswordHistoryRepository;
import com.example.identity_service.repository.UserRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService {
    UserRepository userRepository;
    InvalidatedRepository invalidatedRepository;
    PasswordHistoryRepository passwordHistoryRepository;
    EmailService emailService;

    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    @NonFinal
    @Value("${jwt.valid-duration}")
    protected long VALID_DURATION;

    @NonFinal
    @Value("${jwt.refreshable-duration}")
    protected long REFRESHABLE_DURATION;

    public IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException {
        var token = request.getToken();
        boolean isValid = true;

        try {
            verifyToken(token, false);
        } catch (AppException e) {
            isValid = false;
        }

        return IntrospectResponse.builder().valid(isValid).build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        var user = userRepository
                .findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

//        // Kiểm tra tài khoản đã được xác thực chưa
//        if (!user.getIsVerified()) {
//            throw new AppException(ErrorCode.USER_NOT_VERIFIED);
//        }

        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());
        if (!authenticated) throw new AppException(ErrorCode.UNAUTHORIZED);
        var token = generateToken(user);
        return AuthenticationResponse.builder().token(token).authenticated(true).build();
    }

    public void logout(LogoutRequest request) throws ParseException, JOSEException {
        try {
            var signToken = verifyToken(request.getToken(), true);

            String jit = signToken.getJWTClaimsSet().getJWTID();
            Date expiryTime = signToken.getJWTClaimsSet().getExpirationTime();

            InvalidatedToken invalidatedToken =
                    InvalidatedToken.builder().id(jit).expiryTime(expiryTime).build();

            invalidatedRepository.save(invalidatedToken);
        } catch (AppException exception) {
            log.info("Token already expired");
        }
    }

    public AuthenticationResponse refresh(RefreshRequest request) throws ParseException, JOSEException {
        var signedJWT = verifyToken(request.getToken(), true);

        var jit = signedJWT.getJWTClaimsSet().getJWTID();
        var expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();

        InvalidatedToken invalidatedToken =
                InvalidatedToken.builder().id(jit).expiryTime(expiryTime).build();

        invalidatedRepository.save(invalidatedToken);

        var username = signedJWT.getJWTClaimsSet().getSubject();

        var user =
                userRepository.findByUsername(username).orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));
        var token = generateToken(user);

        return AuthenticationResponse.builder().token(token).authenticated(true).build();
    }

    private String generateToken(User user) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUsername())
                .issuer("devteria.com")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(VALID_DURATION, ChronoUnit.SECONDS).toEpochMilli()))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", buildScope(user))
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Cannot create token", e);
            throw new RuntimeException(e);
        }
    }

    private SignedJWT verifyToken(String token, boolean isRefresh) throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());

        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expiryTime = (isRefresh)
                ? new Date(signedJWT
                .getJWTClaimsSet()
                .getIssueTime()
                .toInstant()
                .plus(REFRESHABLE_DURATION, ChronoUnit.SECONDS)
                .toEpochMilli())
                : signedJWT.getJWTClaimsSet().getExpirationTime();

        var verified = signedJWT.verify(verifier);

        if (!(verified && expiryTime.after(new Date()))) throw new AppException(ErrorCode.UNAUTHENTICATED);

        if (invalidatedRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID()))
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        return signedJWT;
    }

    private String buildScope(User user) {
        StringJoiner stringJoiner = new StringJoiner(" ");

        if (!CollectionUtils.isEmpty(user.getRoles()))
            user.getRoles().forEach(role -> {
                stringJoiner.add("ROLE_" + role.getName());
                if (!CollectionUtils.isEmpty(role.getPermissions()))
                    role.getPermissions().forEach(permission -> stringJoiner.add(permission.getName()));
            });

        return stringJoiner.toString();
    }

    public RegisterResponse register(RegisterRequest request) {
        // Kiểm tra username đã tồn tại chưa
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        // Kiểm tra email đã tồn tại chưa
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }

        // Hash password
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        String hashedPassword = passwordEncoder.encode(request.getPassword());

        // Tạo verification code
        String verificationCode = generateVerificationCode();

        // Tạo user mới
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(hashedPassword)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .dob(request.getDob())
                .verificationCode(verificationCode)
                .verificationCodeExpiry(LocalDateTime.now().plusMinutes(15))
                .isVerified(false)
                .build();

        userRepository.save(user);

        // Gửi email verification
        emailService.sendVerificationEmail(user.getEmail(), verificationCode);

        return RegisterResponse.builder()
                .message("Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.")
                .verificationCode(verificationCode)
                .success(true)
                .build();
    }

    public VerifyEmailResponse verifyEmail(VerifyEmailRequest request) {
        User user = userRepository.findByVerificationCode(request.getVerificationCode())
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_VERIFICATION_CODE));

        // Kiểm tra verification code đã hết hạn chưa
        if (user.getVerificationCodeExpiry().isBefore(LocalDateTime.now())) {
            throw new AppException(ErrorCode.VERIFICATION_CODE_EXPIRED);
        }

        // Cập nhật trạng thái verified
        user.setIsVerified(true);
        user.setVerificationCode(null);
        user.setVerificationCodeExpiry(null);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        return VerifyEmailResponse.builder()
                .message("Xác thực email thành công!")
                .success(true)
                .build();
    }

    public ChangePasswordResponse changePassword(ChangePasswordRequest request, String token) throws ParseException, JOSEException {
        // Verify token để lấy thông tin user
        SignedJWT signedJWT = verifyToken(token, false);
        String username = signedJWT.getJWTClaimsSet().getSubject();
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_EXISTED));

        // Kiểm tra password cũ
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.INVALID_OLD_PASSWORD);
        }

        // Kiểm tra password mới không trùng với password cũ
        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.NEW_PASSWORD_SAME_AS_OLD);
        }

        // Lưu password cũ vào history
        PasswordHistory passwordHistory = PasswordHistory.builder()
                .user(user)
                .passwordHash(user.getPassword())
                .build();
        passwordHistoryRepository.save(passwordHistory);

        // Cập nhật password mới
        String newHashedPassword = passwordEncoder.encode(request.getNewPassword());
        user.setPassword(newHashedPassword);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        // Gửi email thông báo
        emailService.sendPasswordChangeNotification(user.getEmail(), user.getUsername());

        return ChangePasswordResponse.builder()
                .message("Đổi mật khẩu thành công!")
                .success(true)
                .build();
    }

    private String generateVerificationCode() {
        Random random = new Random();
        StringBuilder code = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            code.append(random.nextInt(10));
        }
        return code.toString();
    }

    public ForgotPasswordResponse sendPasswordResetCode(SendPasswordResetCodeRequest request) {
        // Tìm user theo username
        var user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Kiểm tra user đã được xác thực chưa
        if (!user.getIsVerified()) {
            throw new AppException(ErrorCode.USER_NOT_VERIFIED);
        }

        // Tạo mã xác thực mới
        String verificationCode = generateVerificationCode();
        user.setVerificationCode(verificationCode);
        user.setVerificationCodeExpiry(LocalDateTime.now().plusMinutes(10)); // 10 phút
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        // Gửi email
        emailService.sendPasswordResetCode(user.getEmail(), verificationCode);

        return ForgotPasswordResponse.builder()
                .message("Mã xác thực đã được gửi đến email của bạn")
                .success(true)
                .build();
    }

    public ForgotPasswordResponse resetPasswordWithCode(ForgotPasswordRequest request) {
        // Tìm user theo username
        var user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Kiểm tra mã xác thực
        if (!request.getVerificationCode().equals(user.getVerificationCode())) {
            throw new AppException(ErrorCode.INVALID_VERIFICATION_CODE);
        }

        // Kiểm tra mã xác thực hết hạn
        if (user.getVerificationCodeExpiry() == null || 
            LocalDateTime.now().isAfter(user.getVerificationCodeExpiry())) {
            throw new AppException(ErrorCode.VERIFICATION_CODE_EXPIRED);
        }

        // Hash mật khẩu mới
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        String hashedNewPassword = passwordEncoder.encode(request.getNewPassword());

        // Lưu mật khẩu cũ vào lịch sử
        PasswordHistory passwordHistory = PasswordHistory.builder()
                .user(user)
                .passwordHash(user.getPassword())
                .createdAt(LocalDateTime.now())
                .build();
        passwordHistoryRepository.save(passwordHistory);

        // Cập nhật mật khẩu mới
        user.setPassword(hashedNewPassword);
        user.setVerificationCode(null);
        user.setVerificationCodeExpiry(null);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        // Gửi email thông báo
        emailService.sendPasswordChangeNotification(user.getEmail(), user.getUsername());

        return ForgotPasswordResponse.builder()
                .message("Đặt lại mật khẩu thành công!")
                .success(true)
                .build();
    }
}
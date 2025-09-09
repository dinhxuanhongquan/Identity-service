# Identity Service API Guide

## Tổng quan
Identity Service cung cấp các chức năng authentication cơ bản bao gồm đăng ký, đăng nhập, đăng xuất, xác thực email và đổi mật khẩu.

## Base URL
```
http://localhost:8080/identity
```

## Endpoints

### 1. Đăng ký tài khoản
**POST** `/auth/register`

**Request Body:**
```json
{
  "username": "user123",
  "password": "password123",
  "email": "user@example.com",
  "firstName": "Nguyễn",
  "lastName": "Văn A",
  "dob": "1990-01-01"
}
```

**Validation Rules:**
- `username`: 8-24 ký tự, chứa cả chữ và số, không có ký tự đặc biệt
- `password`: chỉ chứa chữ cái và số
- `email`: định dạng email hợp lệ, không phải email ảo

**Response:**
```json
{
  "code": 1000,
  "message": null,
  "result": {
    "message": "Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.",
    "verificationCode": "123456",
    "success": true
  }
}
```

### 2. Xác thực email
**POST** `/auth/verify-email`

**Request Body:**
```json
{
  "verificationCode": "123456"
}
```

**Response:**
```json
{
  "code": 1000,
  "message": null,
  "result": {
    "message": "Xác thực email thành công!",
    "success": true
  }
}
```

### 3. Đăng nhập
**POST** `/auth/login`

**Request Body:**
```json
{
  "username": "user123",
  "password": "password123"
}
```

**Response:**
```json
{
  "code": 1000,
  "message": null,
  "result": {
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "authenticated": true
  }
}
```

### 4. Đăng xuất
**POST** `/auth/logout`

**Request Body:**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9..."
}
```

**Response:**
```json
{
  "code": 1000,
  "message": null,
  "result": null
}
```

### 5. Đổi mật khẩu
**POST** `/auth/change-password`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
```

**Request Body:**
```json
{
  "oldPassword": "password123",
  "newPassword": "newpassword456"
}
```

**Response:**
```json
{
  "code": 1000,
  "message": null,
  "result": {
    "message": "Đổi mật khẩu thành công!",
    "success": true
  }
}
```

### 6. Refresh Token
**POST** `/auth/refresh`

**Request Body:**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9..."
}
```

**Response:**
```json
{
  "code": 1000,
  "message": null,
  "result": {
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "authenticated": true
  }
}
```

### 7. Introspect Token
**POST** `/auth/introspect`

**Request Body:**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9..."
}
```

**Response:**
```json
{
  "code": 1000,
  "message": null,
  "result": {
    "valid": true
  }
}
```

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 1002 | User already existed | Username đã tồn tại |
| 1009 | Email already existed | Email đã tồn tại |
| 1010 | User not verified | Tài khoản chưa được xác thực |
| 1011 | Invalid verification code | Mã xác thực không hợp lệ |
| 1012 | Verification code expired | Mã xác thực đã hết hạn |
| 1013 | Invalid old password | Mật khẩu cũ không đúng |
| 1014 | New password cannot be the same as old password | Mật khẩu mới không được trùng với mật khẩu cũ |
| 1006 | Unauthenticated | Token không hợp lệ hoặc đã hết hạn |
| 1007 | You do not have permission | Không có quyền truy cập |

## Tính năng bảo mật

1. **Password Hashing**: Sử dụng BCrypt để hash password
2. **Email Verification**: Gửi mã xác thực 6 số qua email, có hiệu lực 15 phút
3. **Password History**: Lưu lại lịch sử password cũ khi đổi mật khẩu
4. **Email Notification**: Gửi email thông báo khi đổi mật khẩu thành công
5. **JWT Token**: Sử dụng JWT để quản lý session
6. **Input Validation**: Validate đầu vào nghiêm ngặt

## Cấu hình Email

Email được cấu hình trong `application.yaml`:
```yaml
mail:
  host: smtp.gmail.com
  port: 587
  username: ${MAIL_USERNAME:your-email@gmail.com}
  password: your-app-password
```

**Lưu ý**: Cần sử dụng App Password của Gmail thay vì mật khẩu thường.

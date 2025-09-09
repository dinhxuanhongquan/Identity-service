# Identity Service Frontend

Frontend cho Identity Service được xây dựng bằng React + TypeScript.

## Tính năng

- ✅ Đăng ký tài khoản với email verification
- ✅ Đăng nhập/đăng xuất
- ✅ Xác thực email với mã 6 số
- ✅ Đổi mật khẩu
- ✅ Dashboard hiển thị thông tin user
- ✅ Responsive design
- ✅ Form validation
- ✅ Error handling
- ✅ Loading states

## Công nghệ sử dụng

- React 18
- TypeScript
- React Router DOM
- Axios
- CSS3 với animations

## Cài đặt và chạy

1. Cài đặt dependencies:
```bash
npm install
```

2. Chạy development server:
```bash
npm start
```

3. Build cho production:
```bash
npm run build
```

## Cấu trúc thư mục

```
src/
├── components/          # React components
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── VerifyEmail.tsx
│   ├── ChangePassword.tsx
│   ├── Dashboard.tsx
│   ├── ProtectedRoute.tsx
│   ├── Auth.css
│   └── Dashboard.css
├── contexts/           # React contexts
│   └── AuthContext.tsx
├── services/           # API services
│   └── api.ts
├── types/              # TypeScript types
│   └── api.ts
├── utils/              # Utility functions
│   ├── validation.ts
│   └── helpers.ts
├── App.tsx
├── App.css
└── index.tsx
```

## API Endpoints

Frontend gọi các API endpoints sau:

- `POST /auth/login` - Đăng nhập
- `POST /auth/register` - Đăng ký
- `POST /auth/verify-email` - Xác thực email
- `POST /auth/change-password` - Đổi mật khẩu
- `POST /auth/logout` - Đăng xuất
- `POST /auth/refresh` - Refresh token
- `POST /auth/introspect` - Kiểm tra token

## Validation Rules

### Username
- 8-24 ký tự
- Chứa cả chữ cái và số
- Không có ký tự đặc biệt (trừ dấu gạch dưới)

### Password
- Chỉ chứa chữ cái và số
- Không có ký tự đặc biệt

### Email
- Định dạng email hợp lệ
- Không sử dụng dịch vụ email tạm thời

## Environment Variables

Có thể cấu hình base URL của API trong file `src/services/api.ts`:

```typescript
baseURL: 'http://localhost:8080/identity'
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
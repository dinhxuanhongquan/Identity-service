# Hướng dẫn Frontend Identity Service

## Tổng quan

Frontend Identity Service là một ứng dụng web được xây dựng bằng React + TypeScript, cung cấp giao diện người dùng cho các chức năng authentication.

## Cấu trúc dự án

```
identity-service/
├── backend/                 # Spring Boot backend
│   ├── src/main/java/...
│   └── pom.xml
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Utility functions
│   ├── package.json
│   └── README.md
├── API_GUIDE.md            # Hướng dẫn API backend
└── FRONTEND_GUIDE.md       # File này
```

## Cách chạy dự án

### 1. Chạy Backend (Spring Boot)

```bash
# Từ thư mục gốc
cd identity-service
mvn spring-boot:run
```

Backend sẽ chạy tại: `http://localhost:8080/identity`

### 2. Chạy Frontend (React)

```bash
# Từ thư mục frontend
cd frontend
npm install
npm start
```

Frontend sẽ chạy tại: `http://localhost:3000`

## Tính năng Frontend

### 1. Đăng ký tài khoản (`/register`)
- Form đăng ký với validation
- Gửi thông tin đến backend
- Hiển thị mã xác thực sau khi đăng ký thành công
- Validation:
  - Username: 8-24 ký tự, chứa cả chữ và số
  - Password: chỉ chữ cái và số
  - Email: định dạng hợp lệ, không email ảo
  - Họ tên: ít nhất 2 ký tự
  - Ngày sinh: ít nhất 13 tuổi

### 2. Xác thực email (`/verify-email`)
- Nhập mã xác thực 6 số
- Gửi mã đến backend để xác thực
- Chuyển hướng đến trang đăng nhập sau khi thành công

### 3. Đăng nhập (`/login`)
- Form đăng nhập với username/password
- Lưu token vào localStorage
- Chuyển hướng đến dashboard sau khi thành công
- Kiểm tra tài khoản đã được xác thực

### 4. Dashboard (`/dashboard`)
- Hiển thị thông tin user
- Nút đăng xuất
- Links đến các chức năng khác
- Protected route (cần đăng nhập)

### 5. Đổi mật khẩu (`/change-password`)
- Form đổi mật khẩu
- Xác thực password cũ
- Validation password mới
- Protected route (cần đăng nhập)

## Công nghệ sử dụng

### Frontend Stack
- **React 18**: UI framework
- **TypeScript**: Type safety
- **React Router DOM**: Client-side routing
- **Axios**: HTTP client
- **CSS3**: Styling với animations

### Key Features
- **Responsive Design**: Tương thích mobile/desktop
- **Form Validation**: Client-side validation
- **Error Handling**: Xử lý lỗi API
- **Loading States**: Hiển thị trạng thái loading
- **Protected Routes**: Bảo vệ routes cần authentication
- **Context API**: Quản lý state authentication

## API Integration

Frontend tích hợp với backend thông qua các API endpoints:

```typescript
// Base URL
const baseURL = 'http://localhost:8080/identity';

// Endpoints
POST /auth/login          // Đăng nhập
POST /auth/register       // Đăng ký
POST /auth/verify-email   // Xác thực email
POST /auth/change-password // Đổi mật khẩu
POST /auth/logout         // Đăng xuất
POST /auth/refresh        // Refresh token
POST /auth/introspect     // Kiểm tra token
```

## Authentication Flow

1. **Đăng ký**: User đăng ký → Nhận mã xác thực → Xác thực email
2. **Đăng nhập**: User đăng nhập → Nhận JWT token → Lưu vào localStorage
3. **Sử dụng**: Mỗi request gửi token trong header Authorization
4. **Đăng xuất**: Gọi API logout → Xóa token khỏi localStorage

## State Management

Sử dụng React Context API để quản lý authentication state:

```typescript
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<string>;
  verifyEmail: (code: string) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}
```

## Styling

- **CSS Modules**: Mỗi component có file CSS riêng
- **Responsive Design**: Mobile-first approach
- **Modern UI**: Gradient backgrounds, shadows, animations
- **Consistent Design**: Color scheme và typography thống nhất

## Error Handling

- **API Errors**: Hiển thị thông báo lỗi từ backend
- **Validation Errors**: Hiển thị lỗi validation real-time
- **Network Errors**: Xử lý lỗi kết nối
- **Token Expiry**: Tự động logout khi token hết hạn

## Development

### Scripts
```bash
npm start          # Chạy development server
npm run build      # Build production
npm test           # Chạy tests
npm run eject      # Eject (không khuyến khích)
```

### Code Structure
- **Components**: Tách biệt logic và UI
- **Services**: Tách biệt API calls
- **Types**: TypeScript interfaces cho type safety
- **Utils**: Helper functions tái sử dụng
- **Contexts**: Global state management

## Deployment

### Build cho Production
```bash
npm run build
```

### Serve Static Files
Có thể serve bằng:
- Nginx
- Apache
- Netlify
- Vercel
- GitHub Pages

### Environment Configuration
Cấu hình base URL trong `src/services/api.ts`:
```typescript
baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/identity'
```

## Troubleshooting

### Common Issues

1. **CORS Error**: Đảm bảo backend cho phép CORS từ frontend
2. **API Connection**: Kiểm tra backend đang chạy
3. **Token Issues**: Kiểm tra token trong localStorage
4. **Validation Errors**: Kiểm tra form validation rules

### Debug Tips

1. Mở Developer Tools để xem network requests
2. Kiểm tra Console để xem errors
3. Kiểm tra localStorage để xem token
4. Sử dụng React Developer Tools

## Next Steps

Có thể mở rộng thêm:
- Toast notifications
- Dark mode
- Multi-language support
- Advanced user management
- File upload
- Real-time notifications

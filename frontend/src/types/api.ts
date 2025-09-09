// API Response Types
export interface ApiResponse<T> {
  code: number;
  message: string | null;
  result: T;
}

// Authentication Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  authenticated: boolean;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  dob: string;
}

export interface RegisterResponse {
  message: string;
  verificationCode: string;
  success: boolean;
}

export interface VerifyEmailRequest {
  verificationCode: string;
}

export interface VerifyEmailResponse {
  message: string;
  success: boolean;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
  success: boolean;
}

export interface LogoutRequest {
  token: string;
}

export interface RefreshRequest {
  token: string;
}

export interface IntrospectRequest {
  token: string;
}

export interface IntrospectResponse {
  valid: boolean;
}

// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  dob: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Auth Context Types
export interface AuthContextType {
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

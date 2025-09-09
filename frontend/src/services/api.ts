import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  LogoutRequest,
  RefreshRequest,
  IntrospectRequest,
  IntrospectResponse,
  User,
} from '../types/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:8080/identity',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor để thêm token vào header
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor để xử lý lỗi
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Token hết hạn, xóa token và redirect về login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication APIs
  async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await this.api.post('/auth/login', data);
    return response.data;
  }

  async register(data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    const response = await this.api.post('/auth/register', data);
    return response.data;
  }

  async verifyEmail(data: VerifyEmailRequest): Promise<ApiResponse<VerifyEmailResponse>> {
    const response = await this.api.post('/auth/verify-email', data);
    return response.data;
  }

  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<ChangePasswordResponse>> {
    const response = await this.api.post('/auth/change-password', data);
    return response.data;
  }

  async logout(data: LogoutRequest): Promise<ApiResponse<null>> {
    const response = await this.api.post('/auth/logout', data);
    return response.data;
  }

  async refresh(data: RefreshRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await this.api.post('/auth/refresh', data);
    return response.data;
  }

  async introspect(data: IntrospectRequest): Promise<ApiResponse<IntrospectResponse>> {
    const response = await this.api.post('/auth/introspect', data);
    return response.data;
  }

  // Admin APIs
  async getUsers(): Promise<ApiResponse<User[]>> {
    const response = await this.api.get('/admin/users');
    return response.data;
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    const response = await this.api.get(`/admin/users/${id}`);
    return response.data;
  }

  async sendPasswordResetCode(username: string): Promise<ApiResponse<any>> {
    const response = await this.api.post('/auth/send-password-reset-code', { username });
    return response.data;
  }

  async resetPasswordWithCode(username: string, verificationCode: string, newPassword: string): Promise<ApiResponse<any>> {
    const response = await this.api.post('/auth/reset-password-with-code', {
      username,
      verificationCode,
      newPassword
    });
    return response.data;
  }
}

export const apiService = new ApiService();

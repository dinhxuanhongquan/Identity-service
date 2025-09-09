import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, User, RegisterRequest } from '../types/api';
import { apiService } from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token && !!user;

  useEffect(() => {
    // Kiểm tra token trong localStorage khi app khởi động
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await apiService.login({ username, password });
      
      if (response.result.authenticated) {
        const newToken = response.result.token;
        setToken(newToken);
        localStorage.setItem('token', newToken);

        // Lưu thông tin user cơ bản (có thể decode từ token hoặc gọi API khác)
        const userData: User = {
          id: '',
          username,
          email: '',
          firstName: '',
          lastName: '',
          dob: '',
          isVerified: true,
          createdAt: '',
          updatedAt: '',
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterRequest): Promise<string> => {
    try {
      setLoading(true);
      const response = await apiService.register(data);
      return response.result.verificationCode;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (code: string): Promise<void> => {
    try {
      setLoading(true);
      await apiService.verifyEmail({ verificationCode: code });
    } catch (error) {
      console.error('Verify email error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string): Promise<void> => {
    try {
      setLoading(true);
      await apiService.changePassword({ oldPassword, newPassword });
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    const currentToken = token;
    if (currentToken) {
      // Gọi API logout (không cần await vì user đã logout)
      apiService.logout({ token: currentToken }).catch(console.error);
    }

    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    login,
    register,
    verifyEmail,
    changePassword,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

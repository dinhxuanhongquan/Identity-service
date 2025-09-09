import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  validateUsername,
  validatePassword,
  validateEmail,
  validateName,
  validateDateOfBirth,
} from '../utils/validation';
import { getErrorMessage, showErrorMessage, showSuccessMessage } from '../utils/helpers';
import './Auth.css';

const Register: React.FC = () => {
  const { register, loading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    firstName: '',
    lastName: '',
    dob: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    const usernameError = validateUsername(formData.username);
    if (usernameError) newErrors.username = usernameError;
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;
    
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    
    const firstNameError = validateName(formData.firstName, 'Họ');
    if (firstNameError) newErrors.firstName = firstNameError;
    
    const lastNameError = validateName(formData.lastName, 'Tên');
    if (lastNameError) newErrors.lastName = lastNameError;
    
    const dobError = validateDateOfBirth(formData.dob);
    if (dobError) newErrors.dob = dobError;
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password xác nhận không khớp';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const code = await register(formData);
      setVerificationCode(code);
      showSuccessMessage('Đăng ký thành công! Mã xác thực đã được gửi đến email của bạn.');
    } catch (error) {
      showErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (verificationCode) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Xác thực Email</h2>
          <div className="verification-info">
            <p>Đăng ký thành công! Mã xác thực của bạn là:</p>
            <p className="verification-code">Mã xác thực: <strong>{verificationCode}</strong></p>
            <p className="verification-note">
              <strong>Lưu ý:</strong> Mã này cũng đã được gửi đến email của bạn (nếu cấu hình email hoạt động).
              <br />
              Vui lòng sử dụng mã này để xác thực tài khoản.
            </p>
          </div>
          <div className="auth-links">
            <p>
              <a href="/verify-email" className="auth-link">
                Xác thực email ngay
              </a>
            </p>
            <p>
              <a href="/login" className="auth-link">
                Quay lại đăng nhập
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Đăng ký tài khoản</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">
                Họ
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`form-input ${errors.firstName ? 'error' : ''}`}
                placeholder="Nhập họ"
                disabled={isSubmitting || loading}
              />
              {errors.firstName && (
                <span className="error-message">{errors.firstName}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="lastName" className="form-label">
                Tên
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`form-input ${errors.lastName ? 'error' : ''}`}
                placeholder="Nhập tên"
                disabled={isSubmitting || loading}
              />
              {errors.lastName && (
                <span className="error-message">{errors.lastName}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={`form-input ${errors.username ? 'error' : ''}`}
              placeholder="8-24 ký tự, chứa cả chữ và số"
              disabled={isSubmitting || loading}
            />
            {errors.username && (
              <span className="error-message">{errors.username}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="Nhập email"
              disabled={isSubmitting || loading}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="Chỉ chứa chữ cái và số"
              disabled={isSubmitting || loading}
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Xác nhận Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="Nhập lại password"
              disabled={isSubmitting || loading}
            />
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="dob" className="form-label">
              Ngày sinh
            </label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              className={`form-input ${errors.dob ? 'error' : ''}`}
              disabled={isSubmitting || loading}
            />
            {errors.dob && (
              <span className="error-message">{errors.dob}</span>
            )}
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={isSubmitting || loading}
          >
            {isSubmitting || loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>

        <div className="auth-links">
          <p>
            Đã có tài khoản?{' '}
            <a href="/login" className="auth-link">
              Đăng nhập ngay
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { validatePassword } from '../utils/validation';
import { getErrorMessage, showErrorMessage, showSuccessMessage } from '../utils/helpers';
import { apiService } from '../services/api';
import './Auth.css';

const ChangePasswordWithCode: React.FC = () => {
  const { loading } = useAuth();
  const [step, setStep] = useState(1); // 1: Nhập username, 2: Nhập code, 3: Đổi password
  const [formData, setFormData] = useState({
    username: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    
    if (step === 1) {
      if (!formData.username.trim()) {
        newErrors.username = 'Username không được để trống';
      }
    } else if (step === 2) {
      if (!formData.verificationCode.trim()) {
        newErrors.verificationCode = 'Mã xác thực không được để trống';
      }
    } else if (step === 3) {
      const newPasswordError = validatePassword(formData.newPassword);
      if (newPasswordError) {
        newErrors.newPassword = newPasswordError;
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await apiService.sendPasswordResetCode(formData.username);
      showSuccessMessage('Mã xác thực đã được gửi đến email của bạn');
      setStep(2);
    } catch (error) {
      showErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.verificationCode.trim()) {
      setErrors({ verificationCode: 'Mã xác thực không được để trống' });
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Gọi API để xác thực mã (cần tạo endpoint này)
      // await apiService.verifyPasswordResetCode(formData.email, formData.verificationCode);
      showSuccessMessage('Mã xác thực hợp lệ');
      setStep(3);
    } catch (error) {
      showErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await apiService.resetPasswordWithCode(formData.username, formData.verificationCode, formData.newPassword);
      showSuccessMessage('Đặt lại mật khẩu thành công!');
      // Reset form
      setFormData({
        username: '',
        verificationCode: '',
        newPassword: '',
        confirmPassword: '',
      });
      setStep(1);
    } catch (error) {
      showErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Quên mật khẩu</h2>
        <p className="step-description">Nhập username để nhận mã xác thực đặt lại mật khẩu</p>
        
        <form onSubmit={handleSendCode} className="auth-form">
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
              placeholder="Nhập username"
              disabled={isSubmitting || loading}
            />
            {errors.username && (
              <span className="error-message">{errors.username}</span>
            )}
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={isSubmitting || loading}
          >
            {isSubmitting || loading ? 'Đang gửi...' : 'Gửi mã xác thực'}
          </button>
        </form>

        <div className="auth-links">
          <a href="/login" className="auth-link">
            Quay lại đăng nhập
          </a>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Xác thực mã</h2>
        <p className="step-description">Nhập mã xác thực đã gửi đến email của username: {formData.username}</p>
        
        <form onSubmit={handleVerifyCode} className="auth-form">
          <div className="form-group">
            <label htmlFor="verificationCode" className="form-label">
              Mã xác thực
            </label>
            <input
              type="text"
              id="verificationCode"
              name="verificationCode"
              value={formData.verificationCode}
              onChange={handleInputChange}
              className={`form-input ${errors.verificationCode ? 'error' : ''}`}
              placeholder="Nhập mã xác thực 6 số"
              maxLength={6}
              disabled={isSubmitting || loading}
            />
            {errors.verificationCode && (
              <span className="error-message">{errors.verificationCode}</span>
            )}
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={isSubmitting || loading}
          >
            {isSubmitting || loading ? 'Đang xác thực...' : 'Xác thực mã'}
          </button>
        </form>

        <div className="auth-links">
          <button 
            onClick={() => setStep(1)} 
            className="auth-link"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Quay lại bước 1
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Quên mật khẩu</h2>
        <p className="step-description">Nhập mật khẩu mới</p>
        
        <form onSubmit={handleChangePassword} className="auth-form">

          <div className="form-group">
            <label htmlFor="newPassword" className="form-label">
              Mật khẩu mới
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              className={`form-input ${errors.newPassword ? 'error' : ''}`}
              placeholder="Chỉ chứa chữ cái và số"
              disabled={isSubmitting || loading}
            />
            {errors.newPassword && (
              <span className="error-message">{errors.newPassword}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Xác nhận mật khẩu mới
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="Nhập lại mật khẩu mới"
              disabled={isSubmitting || loading}
            />
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={isSubmitting || loading}
          >
            {isSubmitting || loading ? 'Đang đặt lại mật khẩu...' : 'Đặt lại mật khẩu'}
          </button>
        </form>

        <div className="auth-links">
          <button 
            onClick={() => setStep(2)} 
            className="auth-link"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Quay lại bước 2
          </button>
          <br />
          <a href="/login" className="auth-link">
            Quay lại đăng nhập
          </a>
        </div>
      </div>
    </div>
  );

  switch (step) {
    case 1:
      return renderStep1();
    case 2:
      return renderStep2();
    case 3:
      return renderStep3();
    default:
      return renderStep1();
  }
};

export default ChangePasswordWithCode;

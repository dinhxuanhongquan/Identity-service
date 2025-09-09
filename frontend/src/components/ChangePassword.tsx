import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { validatePassword } from '../utils/validation';
import { getErrorMessage, showErrorMessage, showSuccessMessage } from '../utils/helpers';
import { apiService } from '../services/api';
import './Auth.css';

const ChangePassword: React.FC = () => {
  const { loading } = useAuth();
  const [step, setStep] = useState(1); // 1: Gửi mã xác thực, 2: Nhập mã + đổi password
  const [formData, setFormData] = useState({
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

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    try {
      // Lấy username từ token hiện tại
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Không tìm thấy token');
      }
      
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const username = tokenPayload.sub;
      
      await apiService.sendPasswordResetCode(username);
      showSuccessMessage('Mã xác thực đã được gửi đến email của bạn');
      setStep(2);
    } catch (error) {
      showErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step === 2) {
      if (!formData.verificationCode.trim()) {
        newErrors.verificationCode = 'Mã xác thực không được để trống';
      }
      
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      // Lấy username từ token hiện tại
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Không tìm thấy token');
      }
      
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const username = tokenPayload.sub;
      
      await apiService.resetPasswordWithCode(username, formData.verificationCode, formData.newPassword);
      showSuccessMessage('Đổi mật khẩu thành công!');
      // Clear form
      setFormData({
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
        <h2 className="auth-title">Đổi mật khẩu</h2>
        <p className="step-description">Gửi mã xác thực đến email để đổi mật khẩu</p>
        
        <form onSubmit={handleSendCode} className="auth-form">
          <button
            type="submit"
            className="auth-button"
            disabled={isSubmitting || loading}
          >
            {isSubmitting || loading ? 'Đang gửi...' : 'Gửi mã xác thực'}
          </button>
        </form>

        <div className="auth-links">
          <a href="/dashboard" className="auth-link">
            Quay lại Dashboard
          </a>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Đổi mật khẩu</h2>
        <p className="step-description">Nhập mã xác thực và mật khẩu mới</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
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
              placeholder="Nhập mã xác thực"
              disabled={isSubmitting || loading}
            />
            {errors.verificationCode && (
              <span className="error-message">{errors.verificationCode}</span>
            )}
          </div>

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
            {isSubmitting || loading ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
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

  switch (step) {
    case 1:
      return renderStep1();
    case 2:
      return renderStep2();
    default:
      return renderStep1();
  }
};

export default ChangePassword;

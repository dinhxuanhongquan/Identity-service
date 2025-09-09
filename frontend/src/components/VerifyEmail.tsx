import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { validateVerificationCode } from '../utils/validation';
import { getErrorMessage, showErrorMessage, showSuccessMessage } from '../utils/helpers';
import './Auth.css';

const VerifyEmail: React.FC = () => {
  const { verifyEmail, loading } = useAuth();
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setVerificationCode(value);
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateVerificationCode(verificationCode);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setIsSubmitting(true);
    try {
      await verifyEmail(verificationCode);
      showSuccessMessage('Xác thực email thành công! Bạn có thể đăng nhập ngay bây giờ.');
      // Redirect to login page
      window.location.href = '/login';
    } catch (error) {
      showErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Xác thực Email</h2>
        <div className="verification-info">
          <p>Vui lòng nhập mã xác thực 6 số đã được gửi đến email của bạn.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="verificationCode" className="form-label">
              Mã xác thực
            </label>
            <input
              type="text"
              id="verificationCode"
              value={verificationCode}
              onChange={handleInputChange}
              className={`form-input ${error ? 'error' : ''}`}
              placeholder="Nhập 6 chữ số"
              maxLength={6}
              disabled={isSubmitting || loading}
            />
            {error && (
              <span className="error-message">{error}</span>
            )}
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={isSubmitting || loading}
          >
            {isSubmitting || loading ? 'Đang xác thực...' : 'Xác thực'}
          </button>
        </form>

        <div className="auth-links">
          <p>
            <a href="/login" className="auth-link">
              Quay lại đăng nhập
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;

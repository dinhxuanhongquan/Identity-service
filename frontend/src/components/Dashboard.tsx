import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import DebugToken from './DebugToken';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, token, logout } = useAuth();

  // Không cần tự động chuyển hướng admin
  // Admin có thể vào dashboard bình thường

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">
          Đăng xuất
        </button>
      </div>
      
      <div className="dashboard-content">
        <DebugToken />
        <div className="welcome-section">
          <h2>🎉 Chào mừng, {user?.firstName} {user?.lastName}!</h2>
          <p>✅ Bạn đã đăng nhập thành công vào hệ thống.</p>
          <div className="success-badge">
            <span>Đăng nhập thành công!</span>
          </div>
          
          {/* Hiển thị link admin nếu user có quyền ADMIN */}
          {token && (() => {
            try {
              const tokenPayload = JSON.parse(atob(token.split('.')[1]));
              const scope = tokenPayload.scope || '';
              if (scope.includes('ROLE_ADMIN')) {
                return (
                  <div style={{ marginTop: '20px' }}>
                    <a href="/user-management" className="admin-link">
                      🔧 Quản lý User (Admin)
                    </a>
                  </div>
                );
              }
            } catch (error) {
              console.error('Error parsing token:', error);
            }
            return null;
          })()}
        </div>
        
        <div className="user-info">
          <h3>Thông tin tài khoản</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Username:</label>
              <span>{user?.username}</span>
            </div>
            <div className="info-item">
              <label>Email:</label>
              <span>{user?.email}</span>
            </div>
            <div className="info-item">
              <label>Họ tên:</label>
              <span>{user?.firstName} {user?.lastName}</span>
            </div>
            <div className="info-item">
              <label>Ngày sinh:</label>
              <span>{user?.dob}</span>
            </div>
            <div className="info-item">
              <label>Trạng thái:</label>
              <span className={`status ${user?.isVerified ? 'verified' : 'unverified'}`}>
                {user?.isVerified ? 'Đã xác thực' : 'Chưa xác thực'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="actions-section">
          <h3>Thao tác</h3>
          <div className="action-buttons">
            <a href="/change-password" className="action-button">
              Đổi mật khẩu
            </a>
            <a href="/change-password-with-code" className="action-button">
              Đổi mật khẩu với mã xác thực
            </a>
            <a href="/verify-email" className="action-button">
              Xác thực email
            </a>
            <a href="/user-management" className="action-button admin-button">
              Quản lý User (ADMIN)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

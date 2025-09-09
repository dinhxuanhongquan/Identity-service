import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { User } from '../types/api';
import './UserManagement.css';

const UserManagement: React.FC = () => {
  const { token, logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const checkAdminPermission = async () => {
    try {
      // Kiểm tra token có chứa quyền ADMIN không
      if (!token) {
        setError('Bạn cần đăng nhập để truy cập trang này');
        setLoading(false);
        return;
      }

      // Decode token để kiểm tra quyền (có thể cải thiện bằng cách gọi API)
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const scope = tokenPayload.scope || '';
      
      if (!scope.includes('ROLE_ADMIN')) {
        setError('Bạn không có quyền truy cập trang quản lý user. Chỉ ADMIN mới có thể truy cập.');
        setLoading(false);
        // Chuyển hướng user thường về dashboard sau 3 giây
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 3000);
        return;
      }

      // Nếu có quyền ADMIN, load danh sách user
      await loadUsers();
    } catch (error) {
      setError('Lỗi khi kiểm tra quyền truy cập');
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAdminPermission();
  }, [token]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUsers();
      setUsers(response.result);
    } catch (error) {
      setError('Không thể tải danh sách user. Có thể bạn không có quyền ADMIN.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-management-container">
        <div className="error-message">
          <h2> Không có quyền truy cập</h2>
          <p>{error}</p>
          {error.includes('ADMIN') && (
            <div className="redirect-notice">
              <p> Bạn sẽ được chuyển về Dashboard sau 3 giây...</p>
            </div>
          )}
          <div className="error-actions">
            <button onClick={handleLogout} className="logout-button">
              Đăng xuất
            </button>
            <a href="/dashboard" className="back-link">
              Quay lại Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-management-container">
      <div className="user-management-header">
        <h1>Quản lý User</h1>
        <div className="header-actions">
          <span className="admin-badge">ADMIN</span>
          <button onClick={handleLogout} className="logout-button">
            Đăng xuất
          </button>
        </div>
      </div>

      <div className="user-management-content">
        <div className="users-table-container">
          <h2>Danh sách User</h2>
          <div className="table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Họ tên</th>
                  <th>Ngày sinh</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.firstName} {user.lastName}</td>
                    <td>{user.dob}</td>
                    <td>
                      <span className={`status-badge ${user.isVerified ? 'verified' : 'unverified'}`}>
                        {user.isVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-stats">
          <h3>Thống kê</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <h4>Tổng User</h4>
              <p className="stat-number">{users.length}</p>
            </div>
            <div className="stat-card">
              <h4>Đã xác thực</h4>
              <p className="stat-number">{users.filter(u => u.isVerified).length}</p>
            </div>
            <div className="stat-card">
              <h4>Chưa xác thực</h4>
              <p className="stat-number">{users.filter(u => !u.isVerified).length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;

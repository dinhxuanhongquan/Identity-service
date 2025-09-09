import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const DebugToken: React.FC = () => {
  const { user, token } = useAuth();

  const decodeToken = (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (error) {
      return { error: 'Invalid token' };
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', margin: '20px' }}>
      <h3>Debug Token Information</h3>
      <div>
        <strong>User:</strong> {user ? `${user.firstName} ${user.lastName}` : 'No user'}
      </div>
      <div>
        <strong>Token:</strong> {token ? 'Present' : 'No token'}
      </div>
      {token && (
        <div>
          <strong>Token Payload:</strong>
          <pre style={{ backgroundColor: 'white', padding: '10px', marginTop: '10px' }}>
            {JSON.stringify(decodeToken(token), null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default DebugToken;

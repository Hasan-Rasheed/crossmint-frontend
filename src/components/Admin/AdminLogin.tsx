import React, { useState } from 'react';
import './AdminLogin.css';

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const ADMIN_EMAIL = 'admin@cloakpay.com';
  const ADMIN_PASSWORD = 'admin123';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (credentials.email === ADMIN_EMAIL && credentials.password === ADMIN_PASSWORD) {
      setError('');
      onLogin();
    } else {
      setError('Invalid email or password');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <div className="admin-header">
          <span className="admin-logo">🔒</span>
          <h1>CloakPay Admin</h1>
          <p>Administrator Login</p>
        </div>
        
        <form onSubmit={handleSubmit} className="admin-login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email" className='field-label'>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="admin@cloakpay.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className='field-label'>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>
          
          <button type="submit" className="admin-login-btn">
            Login to Admin Panel
          </button>
        </form>
        
        {/* <div className="admin-footer">
          <p className="admin-note">
            Demo credentials: admin@cloakpay.com / admin123
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default AdminLogin;

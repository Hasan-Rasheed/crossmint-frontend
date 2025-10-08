import React, { useState } from 'react';
import './AdminLogin.css';
import { API_ENDPOINTS, createHeaders } from '../../config/api';

interface AdminLoginProps {
  onLogin: (token: string, adminData: any) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.ADMIN_REQUEST_OTP, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage(data.message || 'OTP sent successfully to your email');
        setStep('otp');
      } else {
        setError(data.message || 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error requesting OTP:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.ADMIN_VERIFY_OTP, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      console.log('OTP Verification Response:', { status: response.status, data });

      if (response.ok && data.success) {
        console.log('OTP Verified Successfully!');
        console.log('Token:', data.data.token);
        console.log('Admin Data:', data.data.admin);
        
        // Store token in localStorage
        localStorage.setItem('adminToken', data.data.token);
        localStorage.setItem('adminData', JSON.stringify(data.data.admin));
        console.log('Token and admin data stored in localStorage');
        
        // Call onLogin callback with token and admin data
        console.log('Calling onLogin callback...');
        onLogin(data.data.token, data.data.admin);
      } else {
        console.error('OTP Verification Failed:', data);
        setError(data.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setOtp('');
    setError('');
    setSuccessMessage('');
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        {/* Back Arrow - Only show on OTP step */}
        {step === 'otp' && (
          <button 
            className="back-arrow-btn" 
            onClick={handleBackToEmail}
            disabled={loading}
            type="button"
          >
            ←
          </button>
        )}
        
        <div className="admin-header">
          <span className="admin-logo">🔒</span>
          <h1>CloakPay Admin</h1>
          <p>
            {step === 'email' 
              ? 'Enter your email to receive OTP' 
              : 'Enter the OTP sent to your email'}
          </p>
        </div>
        
        {/* Email Step */}
        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className="admin-login-form">
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="email">Admin Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cloakpay.com"
                required
                disabled={loading}
              />
            </div>
            
            <button type="submit" className="admin-login-btn" disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        )}

        {/* OTP Step */}
        {step === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="admin-login-form">
            {successMessage && <div className="success-message">{successMessage}</div>}
            {error && <div className="error-message">{error}</div>}
            
            {/* <div className="form-group">
              <label htmlFor="email-display">Email</label>
              <input
                type="email"
                id="email-display"
                value={email}
                disabled
                className="disabled-input"
              />
            </div> */}

            <div className="form-group">
              <label htmlFor="otp">Enter OTP</label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                required
                disabled={loading}
                maxLength={6}
                className="otp-input"
              />
            </div>
            
            <button type="submit" className="admin-login-btn" disabled={loading || otp.length !== 6}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}
        
        <div className="admin-footer">
          <p className="admin-note">
            {step === 'email' 
              ? 'You will receive a 6-digit OTP on your registered email' 
              : 'Check your email for the OTP code'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
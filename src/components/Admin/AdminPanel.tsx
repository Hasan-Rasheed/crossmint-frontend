import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

interface AdminData {
  id: number;
  email: string;
  name: string;
  lastLoginAt: string;
}

const AdminPanel: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [adminData, setAdminData] = useState<AdminData | null>(null);

  // Check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    const storedAdminData = localStorage.getItem('adminData');
    
    if (storedToken && storedAdminData) {
      setToken(storedToken);
      setAdminData(JSON.parse(storedAdminData));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (newToken: string, newAdminData: AdminData) => {
    console.log('AdminPanel - handleLogin called');
    console.log('New Token:', newToken);
    console.log('New Admin Data:', newAdminData);
    
    setToken(newToken);
    setAdminData(newAdminData);
    setIsAuthenticated(true);
    
    console.log('AdminPanel - State updated, should render AdminDashboard now');
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    
    // Reset state
    setToken(null);
    setAdminData(null);
    setIsAuthenticated(false);
  };

  console.log('AdminPanel - Render State:', { isAuthenticated, hasToken: !!token, hasAdminData: !!adminData });

  return (
    <>
      {isAuthenticated && token ? (
        <AdminDashboard 
          onLogout={handleLogout} 
          token={token}
          adminData={adminData}
        />
      ) : (
        <AdminLogin onLogin={handleLogin} />
      )}
    </>
  );
};

export default AdminPanel;
import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { API_ENDPOINTS, createAuthHeaders } from '../../config/api';

interface AdminDashboardProps {
  onLogout: () => void;
  token: string;
  adminData: any;
}

interface Admin {
  id: number;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: string;
}

interface Merchant {
  id: string;
  businessName: string;
  businessAddress: string;
  contactInformation: string;
  receivingAddress: string;
  storeUrl: string;
  createdAt: string;
  status?: 'pending' | 'approved' | 'rejected';
}

interface Transaction {
  id: string;
  amount: string;
  currency: string;
  fee: string;
  timestamp: string;
  type: 'payout' | 'deposit';
}

interface WebhookLog {
  id: string;
  merchantId: string;
  event: string;
  status: string;
  timestamp: string;
  attempts: number;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, token, adminData }) => {
  const [activeTab, setActiveTab] = useState<'merchants' | 'vaults' | 'settings' | 'webhooks'>('merchants');
  const [merchantSubTab, setMerchantSubTab] = useState<'pending' | 'approved'>('approved');
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [pendingMerchants, setPendingMerchants] = useState<Merchant[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');

  // Fetch data from API
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch approved merchants with authentication
      console.log("Token ", token)
      const merchantsResponse = await fetch(API_ENDPOINTS.ADMIN_MERCHANTS, {
        headers: createAuthHeaders(token)
      });
      
      if (merchantsResponse.status === 401) {
        // Token expired or invalid
        console.log("Getting error on merchants Response.");
        // alert('Session expired. Please login again.');
        // onLogout();
        return;
      }
      
      if (merchantsResponse.ok) {
        const merchantsData = await merchantsResponse.json();
        let merchantsArray = [];
        
        if (Array.isArray(merchantsData)) {
          merchantsArray = merchantsData;
        } else if (merchantsData && typeof merchantsData === 'object') {
          if (Array.isArray(merchantsData.data)) {
            merchantsArray = merchantsData.data;
          } else {
            merchantsArray = [merchantsData];
          }
        }
        
        const cleanedMerchants = merchantsArray.map((merchant: any, index: number) => ({
          id: merchant.id || `merchant_${index + 1}`,
          businessName: merchant.businessName || merchant.business_name || 'N/A',
          businessAddress: merchant.businessAddress || merchant.business_address || 'N/A',
          contactInformation: merchant.contactInformation || merchant.contact_information || merchant.email || 'N/A',
          receivingAddress: merchant.receivingAddress || merchant.receiving_address || 'N/A',
          storeUrl: merchant.storeUrl || merchant.store_url || merchant.website || 'N/A',
          createdAt: merchant.createdAt || merchant.created_at || new Date().toISOString(),
          status: 'approved' as const
        }));
        
        setMerchants(cleanedMerchants);
      } else {
        // Other errors - just set empty array
        console.error('Failed to fetch merchants:', merchantsResponse.status);
        setMerchants([]);
      }

      // Mock pending merchants
      setPendingMerchants([
        {
          id: 'pending_1',
          businessName: 'New Store',
          businessAddress: '123 Main St, City',
          contactInformation: 'newstore@email.com',
          receivingAddress: '0x1234567890abcdef1234567890abcdef12345678',
          storeUrl: 'https://newstore.com',
          createdAt: new Date().toISOString(),
          status: 'pending'
        },
        {
          id: 'pending_2',
          businessName: 'Crypto Shop',
          businessAddress: '456 Oak Ave, Town',
          contactInformation: 'cryptoshop@email.com',
          receivingAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
          storeUrl: 'https://cryptoshop.store',
          createdAt: new Date().toISOString(),
          status: 'pending'
        }
      ]);

      // Mock transaction data
      setTransactions([
        {
          id: 'tx_001',
          amount: '0.05',
          currency: 'ETH',
          fee: '0.001',
          timestamp: new Date().toISOString(),
          type: 'payout'
        },
        {
          id: 'tx_002',
          amount: '1500',
          currency: 'USDT',
          fee: '15',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          type: 'payout'
        }
      ]);

      // Mock webhook logs
      setWebhookLogs([
        {
          id: 'wh_001',
          merchantId: 'mer_123',
          event: 'payment.success',
          status: 'Delivered',
          timestamp: new Date().toISOString(),
          attempts: 1
        },
        {
          id: 'wh_002',
          merchantId: 'mer_456',
          event: 'payment.pending',
          status: 'Failed',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          attempts: 3
        }
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('AdminDashboard - useEffect triggered');
    console.log('Token available:', !!token);
    console.log('Token value:', token);
    
    if (token) {
      console.log('AdminDashboard - Calling fetchData and fetchAdmins');
      fetchData();
      fetchAdmins();
    } else {
      console.log('AdminDashboard - No token available, skipping API calls');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Fetch all admins
  const fetchAdmins = async () => {
    try {
      console.log("token in fetch admins ", token )
      const response = await fetch(API_ENDPOINTS.ADMIN_LIST, {
        headers: createAuthHeaders(token)
      });

      if (response.status === 401) {
        console.log("Error in fetch Admins")
        // alert('Session expired. Please login again.');
        // onLogout();
        return;
      }

      if (response.ok) {
        const data = await response.json();
        const adminsArray = Array.isArray(data) ? data : (data.data || []);
        setAdmins(adminsArray);
      } else {
        console.error('Failed to fetch admins:', response.status);
        setAdmins([]);
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
      setAdmins([]);
    }
  };

  // Deactivate admin
  const handleDeactivateAdmin = async (adminId: number) => {
    if (!confirm('Are you sure you want to deactivate this admin?')) {
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.ADMIN_DEACTIVATE(adminId), {
        method: 'POST',
        headers: createAuthHeaders(token)
      });

      if (response.ok) {
        alert('Admin deactivated successfully');
        fetchAdmins(); // Refresh admin list
      } else if (response.status === 401) {
        // alert('Session expired. Please login again.');
        console.log("UNAUTHORIZED IN DEACTIVATE ADMIN" , token)
        onLogout();
      } else {
        alert('Failed to deactivate admin');
      }
    } catch (error) {
      console.error('Error deactivating admin:', error);
      alert('Error deactivating admin');
    }
  };

  const handleMerchantAction = async (merchantId: string, action: 'approve' | 'reject') => {
    try {
      // Here you would make API calls to approve/reject merchants
      console.log(`${action} merchant:`, merchantId);
      
      // Remove from pending list
      setPendingMerchants(prev => prev.filter(m => m.id !== merchantId));
      
      if (action === 'approve') {
        // Add to approved merchants
        const merchant = pendingMerchants.find(m => m.id === merchantId);
        if (merchant) {
          setMerchants(prev => [...prev, { ...merchant, status: 'approved' }]);
        }
      }
      
      alert(`Merchant ${action}d successfully!`);
    } catch (error) {
      console.error('Error processing merchant action:', error);
      alert('Error processing request');
    }
  };

  const handleAddAdmin = () => {
    if (!newAdminEmail) {
      alert('Please enter an email address');
      return;
    }
    
    // Here you would make API call to add new admin
    console.log('Adding new admin:', newAdminEmail);
    alert(`New admin added: ${newAdminEmail}`);
    setNewAdminEmail('');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const EmptyState: React.FC<{ message: string; colSpan: number }> = ({ message, colSpan }) => (
    <tr>
      <td colSpan={colSpan} className="empty-state">
        {message}
      </td>
    </tr>
  );

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header-bar">
        <div className="header-left">
          <span className="header-logo">🔒</span>
          <h1>CloakPay Admin</h1>
        </div>
        <div className="header-right">
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="admin-main-layout">
        {/* Sidebar Navigation */}
        <aside className="admin-sidebar">
          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeTab === 'merchants' ? 'active' : ''}`}
              onClick={() => setActiveTab('merchants')}
            >
              <span className="nav-item-icon">🏪</span>
              <span>Merchants</span>
            </button>
            {/* <button
              className={`nav-item ${activeTab === 'vaults' ? 'active' : ''}`}
              onClick={() => setActiveTab('vaults')}
            >
              <span className="nav-item-icon">💰</span>
              <span>Vaults</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <span className="nav-item-icon">⚙️</span>
              <span>Settings</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'webhooks' ? 'active' : ''}`}
              onClick={() => setActiveTab('webhooks')}
            >
              <span className="nav-item-icon">🔔</span>
              <span>Webhooks</span>
            </button> */}
          </nav>
        </aside>

        {/* Content Area */}
        <div className="admin-content">
          {loading ? (
            <div className="loading-state">Loading...</div>
          ) : (
            <>
              {/* Merchants Tab */}
              {activeTab === 'merchants' && (
                <div className="tab-content">
                  <div className="content-header">
                    <h2>Merchant Management</h2>
                  </div>
                  
                  {/* Merchant Sub-tabs */}
                  {/* <div className="merchant-sub-tabs">
                    <button
                      className={`sub-tab ${merchantSubTab === 'pending' ? 'active' : ''}`}
                      onClick={() => setMerchantSubTab('pending')}
                    >
                      Pending Approval
                    </button>
                    <button
                      className={`sub-tab ${merchantSubTab === 'approved' ? 'active' : ''}`}
                      onClick={() => setMerchantSubTab('approved')}
                    >
                      Approved Merchants
                    </button>
                  </div> */}

                  {/* Pending Merchants */}
                  {merchantSubTab === 'pending' && (
                    <div className="table-container">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Business Name</th>
                            <th>Address</th>
                            <th>Contact</th>
                            <th>Store URL</th>
                            <th>Receiving Address</th>
                            <th>Created At</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pendingMerchants.length === 0 ? (
                            <EmptyState message="No pending merchants" colSpan={8} />
                          ) : (
                            pendingMerchants.map((merchant) => (
                              <tr key={merchant.id}>
                                <td>{merchant.id}</td>
                                <td>{merchant.businessName}</td>
                                <td>{merchant.businessAddress}</td>
                                <td>{merchant.contactInformation}</td>
                                <td className="url-cell">
                                  {merchant.storeUrl !== 'N/A' ? (
                                    <a href={merchant.storeUrl} target="_blank" rel="noopener noreferrer" className="store-link">
                                      {merchant.storeUrl}
                                    </a>
                                  ) : (
                                    merchant.storeUrl
                                  )}
                                </td>
                                <td className="address-cell">{merchant.receivingAddress}</td>
                                <td>{formatDate(merchant.createdAt)}</td>
                                <td>
                                  <div className="action-buttons">
                                    <button
                                      className="approve-btn"
                                      onClick={() => handleMerchantAction(merchant.id, 'approve')}
                                    >
                                      Approve
                                    </button>
                                    <button
                                      className="reject-btn"
                                      onClick={() => handleMerchantAction(merchant.id, 'reject')}
                                    >
                                      Reject
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Approved Merchants */}
                  {merchantSubTab === 'approved' && (
                    <div className="table-container">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Business Name</th>
                            <th>Address</th>
                            <th>Contact</th>
                            <th>Store URL</th>
                            <th>Receiving Address</th>
                            <th>Created At</th>
                          </tr>
                        </thead>
                        <tbody>
                          {merchants.length === 0 ? (
                            <EmptyState message="No approved merchants" colSpan={7} />
                          ) : (
                            merchants.map((merchant) => (
                              <tr key={merchant.id}>
                                <td>{merchant.id}</td>
                                <td>{merchant.businessName}</td>
                                <td>{merchant.businessAddress}</td>
                                <td>{merchant.contactInformation}</td>
                                <td className="url-cell">
                                  {merchant.storeUrl !== 'N/A' ? (
                                    <a href={merchant.storeUrl} target="_blank" rel="noopener noreferrer" className="store-link">
                                      {merchant.storeUrl}
                                    </a>
                                  ) : (
                                    merchant.storeUrl
                                  )}
                                </td>
                                <td className="address-cell">{merchant.receivingAddress}</td>
                                <td>{formatDate(merchant.createdAt)}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Vaults Tab */}
              {activeTab === 'vaults' && (
                <div className="tab-content">
                  <div className="content-header">
                    <h2>Transaction History - Payout Fees</h2>
                  </div>
                  <div className="table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Amount</th>
                          <th>Currency</th>
                          <th>Fee</th>
                          <th>Type</th>
                          <th>Timestamp</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.length === 0 ? (
                          <EmptyState message="No transactions found" colSpan={6} />
                        ) : (
                          transactions.map((tx) => (
                            <tr key={tx.id}>
                              <td>{tx.id}</td>
                              <td>{tx.amount}</td>
                              <td>{tx.currency}</td>
                              <td>{tx.fee}</td>
                              <td>
                                <span className={`status-badge ${tx.type}`}>
                                  {tx.type}
                                </span>
                              </td>
                              <td>{formatDate(tx.timestamp)}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="tab-content">
                  <div className="content-header">
                    <h2>Admin Settings</h2>
                  </div>
                  <div className="settings-content">
                    <div className="settings-section">
                      <h3>Add New Admin</h3>
                      <div className="admin-form">
                        <input
                          type="email"
                          placeholder="Enter admin email"
                          value={newAdminEmail}
                          onChange={(e) => setNewAdminEmail(e.target.value)}
                          className="admin-input"
                        />
                        <button
                          className="add-admin-btn"
                          onClick={handleAddAdmin}
                        >
                          Add Admin
                        </button>
                      </div>
                    </div>

                    <div className="settings-section">
                      <h3>Admin List</h3>
                      <div className="table-container">
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Status</th>
                              <th>Created At</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {admins.length === 0 ? (
                              <EmptyState message="No admins found" colSpan={6} />
                            ) : (
                              admins.map((admin) => (
                                <tr key={admin.id}>
                                  <td>{admin.id}</td>
                                  <td>{admin.name || 'N/A'}</td>
                                  <td>{admin.email}</td>
                                  <td>
                                    <span className={`status-badge ${admin.isActive ? 'approved' : 'rejected'}`}>
                                      {admin.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                  </td>
                                  <td>{formatDate(admin.createdAt)}</td>
                                  <td>
                                    {admin.isActive && admin.id !== adminData?.id && (
                                      <button
                                        className="reject-btn"
                                        onClick={() => handleDeactivateAdmin(admin.id)}
                                      >
                                        Deactivate
                                      </button>
                                    )}
                                    {admin.id === adminData?.id && (
                                      <span className="current-user-badge">Current User</span>
                                    )}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Webhooks Tab */}
              {activeTab === 'webhooks' && (
                <div className="tab-content">
                  <div className="content-header">
                    <h2>Webhook Logs</h2>
                  </div>
                  <div className="table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Merchant ID</th>
                          <th>Event</th>
                          <th>Status</th>
                          <th>Attempts</th>
                          <th>Timestamp</th>
                        </tr>
                      </thead>
                      <tbody>
                        {webhookLogs.length === 0 ? (
                          <EmptyState message="No webhook logs found" colSpan={6} />
                        ) : (
                          webhookLogs.map((log) => (
                            <tr key={log.id}>
                              <td>{log.id}</td>
                              <td>{log.merchantId}</td>
                              <td>{log.event}</td>
                              <td>
                                <span className={`status-badge ${log.status.toLowerCase()}`}>
                                  {log.status}
                                </span>
                              </td>
                              <td>{log.attempts}</td>
                              <td>{formatDate(log.timestamp)}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

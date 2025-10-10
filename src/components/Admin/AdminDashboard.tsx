import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { API_ENDPOINTS, createAuthHeaders, ADMIN_SECRET_KEY } from '../../config/api';

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
  totalOrdersCreated?: number;
  totalOrdersPaid?: number;
  totalOrders?: Order[];
  totalShareAmount?: number;
  totalFeesGenerated?: number;
  actuallyReceivedFromPayouts?: number;
  pendingAmountToBeReceived?: number;
  contractAddress?: string;
  collectionId?: string;
  totalOrdersCount?: number;
  totalAmount?: number;
  totalPaidAmount?: number;
}

interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  crossmintId: string;
  wooId: string;
  storeUrl: string;
  status: string;
  crossmintStatus: string;
  transactionHash: string | null;
  customerEmail: string | null;
  customerWallet: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  metadata: {
    source: string;
    cartData: CartItem[];
  };
  merchant: {
    id: number;
    businessName: string;
    contactInformation: string;
    businessAddress: string;
    receivingAddress: string;
    storeUrl: string;
  };
}

interface AnalyticsData {
  merchants: {
    totalMerchants: number;
    merchants: Merchant[];
  };
  platform: {
    vaultAddress: string;
    totalFeesGeneratedFromMerchants: number;
    totalFeesActuallyReceived: number;
    totalPendingPaymentFromDailyDistribution: number;
  };
  distributions: {
    allDistributionRecords: any[];
    lastDistributionHappened: any;
    totalDistributed: number;
    totalPending: number;
    totalRemainingAmountOfAllMerchants: number;
    totalRemainingFeesOfPlatform: number;
  };
}

// interface Transaction {
//   id: string;
//   amount: string;
//   currency: string;
//   fee: string;
//   timestamp: string;
//   type: 'payout' | 'deposit';
// }

interface WebhookLog {
  id: string;
  merchantId: string;
  event: string;
  status: string;
  timestamp: string;
  attempts: number;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, token, adminData }) => {
  const [activeTab, setActiveTab] = useState<'merchants' | 'orders' | 'vaults' | 'settings' | 'webhooks'>('merchants');
  const [merchantSubTab] = useState<'pending' | 'approved'>('approved');
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [pendingMerchants, setPendingMerchants] = useState<Merchant[]>([]);
  // const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedMerchantId, setSelectedMerchantId] = useState<string | null>(null);
  const [loading] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);

  // Mock data for pending merchants and webhooks
  useEffect(() => {
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
  }, []);

  useEffect(() => {
    console.log('AdminDashboard - useEffect triggered');
    console.log('Token available:', !!token);
    console.log('Token value:', token);
    
    if (token) {
      console.log('AdminDashboard - Calling fetchData, fetchAdmins, and fetchAnalytics');
      // fetchData();
      fetchAdmins();
      fetchAnalytics();
    } else {
      console.log('AdminDashboard - No token available, skipping API calls');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Helper function to calculate cart total
  const calculateCartTotal = (cartData: CartItem[]): number => {
    if (!cartData || !Array.isArray(cartData)) return 0;
    return cartData.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  // Fetch analytics data
  const fetchAnalytics = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.ADMIN_ANALYTICS, {
        headers: createAuthHeaders(token)
      });

      if (response.status === 401) {
        console.log('Error in fetch Analytics');
        return;
      }

      if (response.ok) {
        const res = await response.json();
        const data = res.data
        console.log("Analytics data ", data)
        setAnalytics(data);
        
        // Update merchants with analytics data
        if (data.merchants && data.merchants.merchants) {
          const merchantsWithMappedFields = data.merchants.merchants.map((merchant: any) => {
            // Extract orders from totalOrders object/array
            const ordersArray = Array.isArray(merchant.totalOrders) 
              ? merchant.totalOrders 
              : (merchant.totalOrders ? Object.values(merchant.totalOrders) : []);
            
            // Calculate totals
            const totalOrdersCount = ordersArray.length;
            const totalAmount = ordersArray.reduce((sum: number, order: Order) => {
              const cartTotal = calculateCartTotal(order.metadata?.cartData || []);
              return sum + cartTotal;
            }, 0);
            
            const totalPaidAmount = ordersArray
              .filter((order: Order) => order.status === 'completed' || order.crossmintStatus === 'completed')
              .reduce((sum: number, order: Order) => {
                const cartTotal = calculateCartTotal(order.metadata?.cartData || []);
                return sum + cartTotal;
              }, 0);

            return {
              ...merchant,
              storeUrl: merchant.storeURL || merchant.storeUrl || 'N/A',
              totalOrders: ordersArray,
              totalOrdersCount,
              totalAmount,
              totalPaidAmount
            };
          });
          setMerchants(merchantsWithMappedFields);
          
          // Extract all orders from all merchants
          const allOrders: Order[] = [];
          merchantsWithMappedFields.forEach((merchant: Merchant) => {
            if (merchant.totalOrders && Array.isArray(merchant.totalOrders)) {
              allOrders.push(...merchant.totalOrders);
            }
          });
          setOrders(allOrders);
        }
      } else {
        console.error('Failed to fetch analytics:', response.status);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

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

  // Activate admin
  const handleActivateAdmin = async (adminId: number) => {
    if (!confirm('Are you sure you want to activate this admin?')) {
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.ADMIN_ACTIVATE(adminId), {
        method: 'POST',
        headers: createAuthHeaders(token)
      });

      if (response.ok) {
        alert('Admin activated successfully');
        fetchAdmins(); // Refresh admin list
      } else if (response.status === 401) {
        console.log("UNAUTHORIZED IN ACTIVATE ADMIN", token)
        onLogout();
      } else {
        alert('Failed to activate admin');
      }
    } catch (error) {
      console.error('Error activating admin:', error);
      alert('Error activating admin');
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

  const handleAddAdmin = async () => {
    if (!newAdminName.trim()) {
      alert('Please enter admin name');
      return;
    }

    if (!newAdminEmail.trim()) {
      alert('Please enter an email address');
      return;
    }
    
    try {

      console.log("ADMIN_SECRET_KEY ", ADMIN_SECRET_KEY)
      console.log("new admin name ", newAdminName)
      console.log("new admin email ", newAdminEmail)
      const response = await fetch(API_ENDPOINTS.ADMIN_CREATE, {
        method: 'POST',
        headers: createAuthHeaders(token),
        body: JSON.stringify({
          name: newAdminName,
          email: newAdminEmail,
          secretKey: ADMIN_SECRET_KEY
        }),
      });

      if (response.ok) {
        await response.json();
        alert(`New admin added successfully: ${newAdminEmail}`);
        setNewAdminEmail('');
        setNewAdminName('');
        setShowAddAdminModal(false);
        fetchAdmins(); // Refresh admin list
      } else if (response.status === 401) {
        // alert('Session expired. Please login again.');
        // onLogout();
        console.log("Response ", response)
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to add admin');
      }
    } catch (error) {
      console.error('Error adding admin:', error);
      alert('Error adding admin. Please try again.');
    }
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
            <button
              className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <span className="nav-item-icon">📦</span>
              <span>Orders</span>
            </button>
            <button
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
            {/* <button
              className={`nav-item ${activeTab === 'webhooks' ? 'active' : ''}`}
              onClick={() => setActiveTab('webhooks')}
            >
              <span className="nav-item-icon">🔔</span>
              <span>Webhooks</span>
            </button>  */}
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
                            <th>Merchant Name</th>
                            <th>Business Name</th>
                            <th>Store URL</th>
                            <th>Receiving Address</th>
                            <th>Total Orders</th>
                            <th>Total Amount</th>
                            <th>Total Paid Amount</th>
                            <th>Fees Collected</th>
                            <th>Remaining to Distribute</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {merchants.length === 0 ? (
                            <EmptyState message="No approved merchants" colSpan={10} />
                          ) : (
                            merchants.map((merchant) => (
                              <tr key={merchant.id}>
                                <td>{merchant.contactInformation || 'N/A'}</td>
                                <td>{merchant.businessName}</td>
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
                                <td>{merchant.totalOrdersCount || 0}</td>
                                <td>${(merchant.totalAmount || 0).toFixed(2)}</td>
                                <td>${(merchant.totalPaidAmount || 0).toFixed(2)}</td>
                                <td>${merchant.totalFeesGenerated || 0}</td>
                                <td>${merchant.pendingAmountToBeReceived || 0}</td>
                                <td>
                                  <button
                                    className="view-orders-btn"
                                    onClick={() => {
                                      setSelectedMerchantId(merchant.id);
                                      setActiveTab('orders');
                                    }}
                                  >
                                    View Orders
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="tab-content">
                  <div className="content-header">
                    <h2>
                      {selectedMerchantId 
                        ? `Orders - ${merchants.find(m => m.id === selectedMerchantId)?.businessName || 'Merchant'}` 
                        : 'All Orders'}
                    </h2>
                    {selectedMerchantId && (
                      <button
                        className="back-to-merchants-btn"
                        onClick={() => {
                          setSelectedMerchantId(null);
                          setActiveTab('merchants');
                        }}
                      >
                        ← Back to Merchants
                      </button>
                    )}
                  </div>
                  <div className="table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>WooCommerce ID</th>
                          <th>Business Name</th>
                          <th>Store URL</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Crossmint Status</th>
                          <th>Transaction Hash</th>
                          <th>Customer Email</th>
                          <th>Created At</th>
                          <th>Completed At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const displayOrders = selectedMerchantId
                            ? orders.filter(order => order.merchant.id.toString() === selectedMerchantId)
                            : orders;
                          
                          return displayOrders.length === 0 ? (
                            <EmptyState message="No orders found" colSpan={11} />
                          ) : (
                            displayOrders.map((order) => {
                              const cartTotal = calculateCartTotal(order.metadata?.cartData || []);
                              return (
                                <tr key={order.id}>
                                  <td>{order.id}</td>
                                  <td>{order.wooId}</td>
                                  <td>{order.merchant.businessName}</td>
                                  <td className="url-cell">
                                    {order.storeUrl !== 'N/A' ? (
                                      <a href={order.storeUrl} target="_blank" rel="noopener noreferrer" className="store-link">
                                        {order.storeUrl}
                                      </a>
                                    ) : (
                                      order.storeUrl
                                    )}
                                  </td>
                                  <td>${cartTotal.toFixed(2)}</td>
                                  <td>
                                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                                      {order.status}
                                    </span>
                                  </td>
                                  <td>
                                    <span className={`status-badge ${order.crossmintStatus.toLowerCase()}`}>
                                      {order.crossmintStatus}
                                    </span>
                                  </td>
                                  <td className="address-cell">{order.transactionHash || 'N/A'}</td>
                                  <td>{order.customerEmail || 'N/A'}</td>
                                  <td>{formatDate(order.createdAt)}</td>
                                  <td>{order.completedAt ? formatDate(order.completedAt) : 'N/A'}</td>
                                </tr>
                              );
                            })
                          );
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Vaults Tab */}
              {activeTab === 'vaults' && (
                <div className="tab-content">
                  <div className="content-header">
                    <h2>Vault Analytics</h2>
                  </div>
                  
                  {!analytics ? (
                    <div className="loading-state">Loading analytics data...</div>
                  ) : (
                    <>
                      {console.log('Rendering Vaults - Analytics:', analytics)}
                      {console.log('Platform data:', analytics?.platform)}
                      {console.log('Distributions data:', analytics?.distributions)}
                      
                      {/* Platform Analytics Cards */}
                      {analytics?.platform ? (
                        <>
                        <div className="analytics-cards">
                      <div className="analytics-card">
                        <div className="card-label">Vault Address</div>
                        <div className="card-value address-cell">{analytics.platform.vaultAddress}</div>
                      </div>
                      <div className="analytics-card">
                        <div className="card-label">Total Fees Generated</div>
                        <div className="card-value">${analytics.platform.totalFeesGeneratedFromMerchants}</div>
                      </div>
                      <div className="analytics-card">
                        <div className="card-label">Total Fees Received</div>
                        <div className="card-value">${analytics.platform.totalFeesActuallyReceived}</div>
                      </div>
                      <div className="analytics-card">
                        <div className="card-label">Pending Payment</div>
                        <div className="card-value">${analytics.platform.totalPendingPaymentFromDailyDistribution}</div>
                      </div>
                    </div>
                    
                    {/* Orders Summary */}
                    <div className="section-divider">
                      <h3>Orders Summary</h3>
                    </div>
                    <div className="analytics-cards">
                      <div className="analytics-card">
                        <div className="card-label">Total Orders</div>
                        <div className="card-value">
                          {merchants.reduce((sum, merchant) => sum + (merchant.totalOrdersCount || 0), 0)}
                        </div>
                      </div>
                      <div className="analytics-card">
                        <div className="card-label">Total Order Amount</div>
                        <div className="card-value">
                          ${merchants.reduce((sum, merchant) => sum + (merchant.totalAmount || 0), 0).toFixed(2)}
                        </div>
                      </div>
                      <div className="analytics-card">
                        <div className="card-label">Total Paid Amount</div>
                        <div className="card-value">
                          ${merchants.reduce((sum, merchant) => sum + (merchant.totalPaidAmount || 0), 0).toFixed(2)}
                        </div>
                      </div>
                      <div className="analytics-card">
                        <div className="card-label">Pending Payment</div>
                        <div className="card-value">
                          ${(merchants.reduce((sum, merchant) => sum + (merchant.totalAmount || 0), 0) - 
                             merchants.reduce((sum, merchant) => sum + (merchant.totalPaidAmount || 0), 0)).toFixed(2)}
                        </div>
                      </div>
                    </div>
                    </>
                      ) : (
                        <div className="empty-state-message">
                          No platform analytics data available
                        </div>
                      )}

                      {/* Distribution Records */}
                      {analytics?.distributions ? (
                    <>
                      <div className="section-divider">
                        <h3>Distribution Summary</h3>
                      </div>
                      <div className="analytics-cards">
                        <div className="analytics-card">
                          <div className="card-label">Total Distributed</div>
                          <div className="card-value">${analytics.distributions.totalDistributed}</div>
                        </div>
                        <div className="analytics-card">
                          <div className="card-label">Total Pending</div>
                          <div className="card-value">${analytics.distributions.totalPending}</div>
                        </div>
                        <div className="analytics-card">
                          <div className="card-label">Merchants Remaining</div>
                          <div className="card-value">${analytics.distributions.totalRemainingAmountOfAllMerchants}</div>
                        </div>
                        <div className="analytics-card">
                          <div className="card-label">Platform Fees Remaining</div>
                          <div className="card-value">${analytics.distributions.totalRemainingFeesOfPlatform}</div>
                        </div>
                      </div>

                      <div className="section-divider">
                        <h3>Distribution Records</h3>
                      </div>
                      <div className="table-container">
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Merchant Name</th>
                              <th>Total Amount</th>
                              <th>Merchant Amount</th>
                              <th>Platform Fees</th>
                              <th>Status</th>
                              <th>Transaction Hash</th>
                              <th>Distributed At</th>
                            </tr>
                          </thead>
                          <tbody>
                            {!analytics.distributions.allDistributionRecords || analytics.distributions.allDistributionRecords.length === 0 ? (
                              <EmptyState message="No distribution records found" colSpan={8} />
                            ) : (
                              analytics.distributions.allDistributionRecords.map((record: any) => (
                                <tr key={record.id}>
                                  <td>{record.id}</td>
                                  <td>{record.merchantName}</td>
                                  <td>${record.totalAmount}</td>
                                  <td>${record.merchantAmount}</td>
                                  <td>${record.platformFees}</td>
                                  <td>
                                    <span className={`status-badge ${record.status.toLowerCase()}`}>
                                      {record.status}
                                    </span>
                                  </td>
                                  <td className="address-cell">{record.transactionHash}</td>
                                  <td>{formatDate(record.distributedAt)}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </>
                      ) : (
                        <div className="empty-state-message">
                          No distribution data available
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="tab-content">
                  <div className="content-header">
                    <h2>Admin List</h2>
                    <button
                      className="add-admin-header-btn"
                      onClick={() => setShowAddAdminModal(true)}
                    >
                      + Add Admin
                    </button>
                  </div>
                  <div className="settings-content">
                    <div className="settings-section">
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
                                    {admin.id === adminData?.id ? (
                                      <span className="current-user-badge">You</span>
                                    ) : admin.isActive ? (
                                      <button
                                        className="reject-btn"
                                        onClick={() => handleDeactivateAdmin(admin.id)}
                                      >
                                        Deactivate
                                      </button>
                                    ) : (
                                      <button
                                        className="activate-btn"
                                        onClick={() => handleActivateAdmin(admin.id)}
                                      >
                                        Activate
                                      </button>
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

      {/* Add Admin Modal */}
      {showAddAdminModal && (
        <div className="modal-overlay" onClick={() => setShowAddAdminModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowAddAdminModal(false)}>
              ✕
            </button>
            <h2>Add New Admin</h2>
            <div className="modal-form">
              <div className="form-group">
                <label htmlFor="admin-name">Full Name</label>
                <input
                  type="text"
                  id="admin-name"
                  placeholder="Enter full name"
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  className="modal-input"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="admin-email">Admin Email</label>
                <input
                  type="email"
                  id="admin-email"
                  placeholder="Enter admin email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="modal-input"
                  required
                />
              </div>
              <div className="modal-actions">
                <button
                  className="modal-cancel-btn"
                  onClick={() => {
                    setShowAddAdminModal(false);
                    setNewAdminEmail('');
                    setNewAdminName('');
                  }}
                >
                  Cancel
                </button>
                <button
                  className="modal-submit-btn"
                  onClick={handleAddAdmin}
                >
                  Add Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

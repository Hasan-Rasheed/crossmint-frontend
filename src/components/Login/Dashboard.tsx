// import React, { useState, useEffect } from "react";
// import "./Dashboard.css";
// import {
//   API_ENDPOINTS,
//   createAuthHeaders,
//   ADMIN_SECRET_KEY,
// } from "../../config/api";

// interface CartItem {
//   id: number;
//   name: string;
//   description: string;
//   price: number;
//   quantity: number;
// }

// interface Merchant {
//   id: string;
//   businessName: string;
//   businessAddress: string;
//   contactInformation: string;
//   receivingAddress: string;
//   storeUrl: string;
//   createdAt: string;
//   status?: "pending" | "approved" | "rejected";
//   totalOrdersCreated?: number;
//   totalOrdersPaid?: number;
//   totalOrders?: Order[];
//   totalShareAmount?: number;
//   totalFeesGenerated?: number;
//   actuallyReceivedFromPayouts?: number;
//   pendingAmountToBeReceived?: number;
//   contractAddress?: string;
//   collectionId?: string;
//   totalOrdersCount?: number;
//   totalAmount?: number;
//   totalPaidAmount?: number;
// }

// interface Order {
//   id: string;
//   crossmintId: string;
//   wooId: string;
//   storeUrl: string;
//   status: string;
//   crossmintStatus: string;
//   transactionHash: string | null;
//   customerEmail: string | null;
//   customerWallet: string | null;
//   createdAt: string;
//   updatedAt: string;
//   completedAt: string | null;
//   metadata: {
//     source: string;
//     cartData: CartItem[];
//   };
//   merchant: {
//     id: number;
//     businessName: string;
//     contactInformation: string;
//     businessAddress: string;
//     receivingAddress: string;
//     storeUrl: string;
//   };
// }

// interface AnalyticsData {
//   merchants: {
//     totalMerchants: number;
//     merchants: Merchant[];
//   };
//   platform: {
//     vaultAddress: string;
//     totalFeesGeneratedFromMerchants: number;
//     totalFeesActuallyReceived: number;
//     totalPendingPaymentFromDailyDistribution: number;
//   };
//   distributions: {
//     allDistributionRecords: any[];
//     lastDistributionHappened: any;
//     totalDistributed: number;
//     totalPending: number;
//     totalRemainingAmountOfAllMerchants: number;
//     totalRemainingFeesOfPlatform: number;
//   };
// }

// const UserDashboard = () => {
//   const token = localStorage.getItem("userToken") || "";

//   const [activeTab, setActiveTab] = useState<
//     "profile" | "orders" | "settings" | "analytics"
//   >("profile");
//   const [merchantSubTab] = useState<"pending" | "approved">("approved");
//   const [merchants, setMerchants]: any = useState([]);
//   const [pendingMerchants, setPendingMerchants] = useState([]);
//   // const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [webhookLogs, setWebhookLogs] = useState([]);
//   const [admins, setAdmins] = useState([]);
//   const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [selectedMerchantId, setSelectedMerchantId] = useState<string | null>(
//     null
//   );
//   const [loading] = useState(false);
//   const [newAdminEmail, setNewAdminEmail] = useState("");
//   const [newAdminName, setNewAdminName] = useState("");
//   const [showAddAdminModal, setShowAddAdminModal] = useState(false);

//   const calculateCartTotal = (cartData: any): number => {
//     if (!cartData || !Array.isArray(cartData)) return 0;
//     return cartData.reduce((total, item) => {
//       return total + item.price * item.quantity;
//     }, 0);
//   };

//   // Fetch analytics data
//   // const fetchAnalytics = async () => {
//   //   try {
//   //     const response = await fetch(API_ENDPOINTS.ADMIN_ANALYTICS, {
//   //       headers: createAuthHeaders(token),
//   //     });

//   //     if (response.status === 401) {
//   //       console.log("Error in fetch Analytics");
//   //       return;
//   //     }

//   //     if (response.ok) {
//   //       const res = await response.json();
//   //       const data = res.data;
//   //       console.log("Analytics data ", data);
//   //       setAnalytics(data);

//   //       // Update merchants with analytics data
//   //       if (data.merchants && data.merchants.merchants) {
//   //         const merchantsWithMappedFields = data.merchants.merchants.map(
//   //           (merchant: any) => {
//   //             // Extract orders from totalOrders object/array
//   //             const ordersArray = Array.isArray(merchant.totalOrders)
//   //               ? merchant.totalOrders
//   //               : merchant.totalOrders
//   //               ? Object.values(merchant.totalOrders)
//   //               : [];

//   //             // Calculate totals
//   //             const totalOrdersCount = ordersArray.length;
//   //             const totalAmount = ordersArray.reduce(
//   //               (sum: number, order: Order) => {
//   //                 const cartTotal = calculateCartTotal(
//   //                   order.metadata?.cartData || []
//   //                 );
//   //                 return sum + cartTotal;
//   //               },
//   //               0
//   //             );

//   //             const totalPaidAmount = ordersArray
//   //               .filter(
//   //                 (order: Order) =>
//   //                   order.status === "paid" || order.crossmintStatus === "paid"
//   //               )
//   //               .reduce((sum: number, order: Order) => {
//   //                 const cartTotal = calculateCartTotal(
//   //                   order.metadata?.cartData || []
//   //                 );
//   //                 return sum + cartTotal;
//   //               }, 0);

//   //             return {
//   //               ...merchant,
//   //               storeUrl: merchant.storeURL || merchant.storeUrl || "N/A",
//   //               totalOrders: ordersArray,
//   //               totalOrdersCount,
//   //               totalAmount,
//   //               totalPaidAmount,
//   //             };
//   //           }
//   //         );
//   //         setMerchant(merchantsWithMappedFields);

//   //         // Extract all orders from all merchants
//   //         const allOrders: Order[] = [];
//   //         merchantsWithMappedFields.forEach((merchant: Merchant) => {
//   //           if (merchant.totalOrders && Array.isArray(merchant.totalOrders)) {
//   //             allOrders.push(...merchant.totalOrders);
//   //           }
//   //         });

//   //         console.log("orders", allOrders);
//   //         setOrders(allOrders);
//   //       }
//   //     } else {
//   //       console.error("Failed to fetch analytics:", response.status);
//   //     }
//   //   } catch (error) {
//   //     console.error("Error fetching analytics:", error);
//   //   }
//   // };

//   const [businessName, setBusinessName] = useState("");
//   const [merchant, setMerchant] = useState<any>(null);
//   const [error, setError] = useState("");

//   const merchantData = JSON.parse(localStorage.getItem("userData") || "{}");

//   const findMerchant = async () => {
//     try {
//       console.clear();
//       console.log("hit api", merchantData);
//       const response = await fetch(API_ENDPOINTS.MERCHANTS_GET_SINGLE("1"), {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         // body: JSON.stringify({ merchantId: merchantData?.id }),
//       });

//       if (!response.ok) {
//         throw new Error(`Merchant not found`);
//       }

//       const data = await response.json();
//       console.log("response merchant", data);

//       setMerchant(data);
//     } catch (err: any) {
//       console.log("error", err);
//       setError(err.message);
//     }
//   };

//   useEffect(() => {
//     findMerchant();
//   }, []);

//   useEffect(() => {
//     console.log("AdminDashboard - useEffect triggered");
//     console.log("Token available:", !!token);
//     console.log("Token value:", token);

//     if (token) {
//       console.log(
//         "AdminDashboard - Calling fetchData, fetchAdmins, and fetchAnalytics"
//       );
//       // fetchData();
//       // fetchAdmins();
//       // fetchAnalytics();
//     } else {
//       console.log("AdminDashboard - No token available, skipping API calls");
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [token]);

//   const formatDate = (dateString: string) => {
//     if (!dateString) return "N/A";

//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) {
//         return "Invalid Date";
//       }
//       return date.toLocaleString();
//     } catch (error) {
//       return "Invalid Date";
//     }
//   };

//   const EmptyState: React.FC<{ message: string; colSpan: number }> = ({
//     message,
//     colSpan,
//   }) => (
//     <tr>
//       <td colSpan={colSpan} className="empty-state">
//         {message}
//       </td>
//     </tr>
//   );

//   return (
//     <div className="admin-dashboard">
//       {/* Header */}
//       <header className="admin-header-bar">
//         <div className="header-left">
//           <span className="header-logo">🔒</span>
//           <h1>CloakPay User</h1>
//         </div>
//       </header>

//       {/* Sidebar Navigation */}
//       {/* <aside className="admin-sidebar">
//         <nav className="sidebar-nav">
//           <button
//             className={`nav-item ${activeTab === "profile" ? "active" : ""}`}
//             onClick={() => setActiveTab("profile")}
//           >
//             <span className="nav-item-icon">🏪</span>
//             <span>Profile</span>
//           </button>
//           <button
//             className={`nav-item ${activeTab === "orders" ? "active" : ""}`}
//             onClick={() => setActiveTab("orders")}
//           >
//             <span className="nav-item-icon">📦</span>
//             <span>Orders</span>
//           </button>
//           <button
//             className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
//             onClick={() => setActiveTab("settings")}
//           >
//             <span className="nav-item-icon">⚙️</span>
//             <span>Settings</span>
//           </button>
//           <button
//             className={`nav-item ${activeTab === "analytics" ? "active" : ""}`}
//             onClick={() => setActiveTab("analytics")}
//           >
//             <span className="nav-item-icon">💰</span>
//             <span>Analytics</span>
//           </button>

//         </nav>
//       </aside> */}

//       <div className="admin-main-layout">
//         {/* Sidebar Navigation */}
//         <aside className="admin-sidebar">
//           <nav className="sidebar-nav">
//             <button
//               className={`nav-item ${activeTab === "profile" ? "active" : ""}`}
//               onClick={() => setActiveTab("profile")}
//             >
//               <span className="nav-item-icon">🏪</span>
//               <span>Merchants</span>
//             </button>
//             <button
//               className={`nav-item ${activeTab === "orders" ? "active" : ""}`}
//               onClick={() => setActiveTab("orders")}
//             >
//               <span className="nav-item-icon">📦</span>
//               <span>Orders</span>
//             </button>
//             {/* <button
//               className={`nav-item ${activeTab === 'vaults' ? 'active' : ''}`}
//               onClick={() => setActiveTab('vaults')}
//             >
//               <span className="nav-item-icon">💰</span>
//               <span>Vaults</span>
//             </button> */}
//             <button
//               className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
//               onClick={() => setActiveTab("settings")}
//             >
//               <span className="nav-item-icon">⚙️</span>
//               <span>Settings</span>
//             </button>
//             {/* <button
//               className={`nav-item ${activeTab === 'webhooks' ? 'active' : ''}`}
//               onClick={() => setActiveTab('webhooks')}
//             >
//               <span className="nav-item-icon">🔔</span>
//               <span>Webhooks</span>
//             </button>  */}
//           </nav>
//         </aside>

//         {/* Debug: merchant here */}
//         {activeTab === "profile" && (
//           <div className="tab-content">
//             <div className="content-header">
//               <h2>Merchant Management</h2>
//             </div>

//             {/* Merchant Sub-tabs */}
//             {/* <div className="merchant-sub-tabs">
//                     <button
//                       className={`sub-tab ${merchantSubTab === 'pending' ? 'active' : ''}`}
//                       onClick={() => setMerchantSubTab('pending')}
//                     >
//                       Pending Approval
//                     </button>
//                     <button
//                       className={`sub-tab ${merchantSubTab === 'approved' ? 'active' : ''}`}
//                       onClick={() => setMerchantSubTab('approved')}
//                     >
//                       Approved Merchants
//                     </button>
//                   </div> */}

//             {/* Pending Merchants */}
//             {merchantSubTab === "pending" && (
//               <div className="table-container">
//                 <table className="admin-table">
//                   <thead>
//                     <tr>
//                       <th>ID</th>
//                       <th>Business Name</th>
//                       <th>Address</th>
//                       <th>Contact</th>
//                       <th>Store URL</th>
//                       <th>Receiving Address</th>
//                       <th>Created At</th>
//                       <th>Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {pendingMerchants.length === 0 ? (
//                       <EmptyState message="No pending merchants" colSpan={8} />
//                     ) : (
//                       pendingMerchants.map((merchant: any) => (
//                         <tr key={merchant.id}>
//                           <td>{merchant.id}</td>
//                           <td>{merchant.businessName}</td>
//                           <td>{merchant.businessAddress}</td>
//                           <td>{merchant.contactInformation}</td>
//                           <td className="url-cell">
//                             {merchant.storeUrl !== "N/A" ? (
//                               <a
//                                 href={merchant.storeUrl}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="store-link"
//                               >
//                                 {merchant.storeUrl}
//                               </a>
//                             ) : (
//                               merchant.storeUrl
//                             )}
//                           </td>
//                           <td className="address-cell">
//                             {merchant.receivingAddress}
//                           </td>
//                           <td>{formatDate(merchant.createdAt)}</td>
//                           <td>
//                             <div className="action-buttons">
//                               <button
//                                 className="approve-btn"
//                                 // onClick={() => handleMerchantAction(merchant.id, 'approve')}
//                               >
//                                 Approve
//                               </button>
//                               <button
//                                 className="reject-btn"
//                                 // onClick={() => handleMerchantAction(merchant.id, 'reject')}
//                               >
//                                 Reject
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             )}

//             {/* Approved Merchants */}
//             {merchantSubTab === "approved" && merchant && (
//               <div className="table-container">
//                 <table className="admin-table">
//                   <thead>
//                     <tr>
//                       <th>Merchant Name</th>
//                       <th>Business Name</th>
//                       <th>Store URL</th>
//                       <th>Receiving Address</th>
//                       <th>Total Orders</th>
//                       <th>Total Amount</th>
//                       <th>Total Paid Amount</th>
//                       <th>Fees Collected</th>
//                       <th>Remaining to Distribute</th>
//                       <th>Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {/* {merchants.length === 0 ? (
//                             <EmptyState message="No approved merchants" colSpan={10} />
//                           ) : ( */}
//                     {/* merchants.map((merchant: any) => ( */}
//                     <tr key={merchant.id}>
//                       <td>{merchant?.contactInformation || "N/A"}</td>
//                       <td>{merchant?.businessName}</td>
//                       <td className="url-cell">
//                         {merchant.storeUrl !== "N/A" ? (
//                           <a
//                             href={merchant.storeUrl}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="store-link"
//                           >
//                             {merchant.storeUrl}
//                           </a>
//                         ) : (
//                           merchant.storeUrl
//                         )}
//                       </td>
//                       <td className="address-cell">
//                         {merchant.receivingAddress}
//                       </td>
//                       <td>{merchant.totalOrdersCount || 0}</td>
//                       <td>${(merchant.totalAmount || 0).toFixed(2)}</td>
//                       <td>${(merchant.totalPaidAmount || 0).toFixed(2)}</td>
//                       <td>${merchant.totalFeesGenerated || 0}</td>
//                       <td>${merchant.pendingAmountToBeReceived || 0}</td>
//                       <td>
//                         <button
//                           className="view-orders-btn"
//                           onClick={() => {
//                             setSelectedMerchantId(merchant.id);
//                             setActiveTab("orders");
//                           }}
//                         >
//                           View Orders
//                         </button>
//                       </td>
//                     </tr>
//                     {/* ))
//                           )} */}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         )}

//         {activeTab === "orders" && (
//           <div className="tab-content">
//             <div className="content-header">
//               {/* <h2>
//                       {selectedMerchantId
//                         ? `Orders - ${merchants.find(m => m.id === selectedMerchantId)?.businessName || 'Merchant'}`
//                         : 'All Orders'}
//                     </h2> */}
//               {/* {selectedMerchantId && (
//                       <button
//                         className="back-to-merchants-btn"
//                         onClick={() => {
//                           setSelectedMerchantId(null);
//                           setActiveTab('pro');
//                         }}
//                       >
//                         ← Back to Merchants
//                       </button>
//                     )} */}
//             </div>
//             <div className="table-container">
//               <table className="admin-table">
//                 <thead>
//                   <tr>
//                     <th>Order ID</th>
//                     <th>WooCommerce ID</th>
//                     <th>Business Name</th>
//                     <th>Store URL</th>
//                     <th>Amount</th>
//                     <th>Status</th>
//                     <th>Crossmint Status</th>
//                     <th>Transaction Hash</th>
//                     <th>Customer Email</th>
//                     <th>Created At</th>
//                     <th>Completed At</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {merchant.orders.map((order: any) => {
//                     console.log('order' , order);
//                     const cartTotal = calculateCartTotal(
//                       order.metadata?.cartData || []
//                     );
//                     return (
//                       <tr key={order.id}>
//                         <td>{order.id}</td>
//                         <td>{order.wooId}</td>
//                         <td>{merchant.businessName}</td>
//                         <td className="url-cell">
//                           {order.storeUrl !== "N/A" ? (
//                             <a
//                               href={order.storeUrl}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="store-link"
//                             >
//                               {order.storeUrl}
//                             </a>
//                           ) : (
//                             order.storeUrl
//                           )}
//                         </td>
//                         <td>${cartTotal.toFixed(2)}</td>
//                         <td>
//                           <span
//                             className={`status-badge ${order.status.toLowerCase()}`}
//                           >
//                             {order.status}
//                           </span>
//                         </td>
//                         <td>
//                           <span
//                             className={`status-badge ${order.crossmintStatus.toLowerCase()}`}
//                           >
//                             {order.crossmintStatus}
//                           </span>
//                         </td>
//                         <td className="address-cell">
//                           {order.transactionHash || "N/A"}
//                         </td>
//                         <td>{order.customerEmail || "N/A"}</td>
//                         <td>{formatDate(order.createdAt)}</td>
//                         <td>
//                           {order.completedAt
//                             ? formatDate(order.completedAt)
//                             : "N/A"}
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;

import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import {
  API_ENDPOINTS,
  createAuthHeaders,
  ADMIN_SECRET_KEY,
} from "../../config/api";

interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

interface Merchant {
  id: string;
  businessName: string;
  businessAddress: string;
  contactInformation: string;
  receivingAddress: string;
  storeUrl: string;
  createdAt: string;
  status?: "pending" | "approved" | "rejected";
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

const UserDashboard = () => {
  // const token = localStorage.getItem("userToken") || "";
  const params = new URLSearchParams(window.location.search);
  // const token2 = params.get("token");
  // console.log("token 2 here", token2);
  const token = localStorage.getItem("userToken") || "";
  // const token =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoic2FtYWQxMzM1NEBnbWFpbC5jb20iLCJuYW1lIjoiU3VwZXIgQWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NjA1MTE5OTUsImV4cCI6MTc2MDU5ODM5NX0.qwY7IOXP2kWtU7U9bBwy1Ymx2zLzS3tjAfd5szXqrLo";

  const [activeTab, setActiveTab] = useState<
    "profile" | "orders" | "settings" | "analytics"
  >("profile");
  const [merchantSubTab] = useState<"pending" | "approved">("approved");
  const [merchants, setMerchants]: any = useState([]);
  const [pendingMerchants, setPendingMerchants] = useState([]);
  // const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [webhookLogs, setWebhookLogs] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedMerchantId, setSelectedMerchantId] = useState<string | null>(
    null
  );
  const [loading] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminName, setNewAdminName] = useState("");
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [showAddStoreModal, setShowAddStoreModal] = useState(false);
  const [newStoreUrl, setNewStoreUrl] = useState("");
  const [newReceivingAddress, setNewReceivingAddress] = useState("");

  const calculateCartTotal = (cartData: any): number => {
    if (!cartData || !Array.isArray(cartData)) return 0;
    return cartData.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  const [businessName, setBusinessName] = useState("");
  const [merchant, setMerchant] = useState<any>(null);
  const [error, setError] = useState("");

  const merchantData = JSON.parse(localStorage.getItem("userData") || "{}");

  const findMerchant = async () => {
    try {
      // console.clear();
      console.log("hit api", merchantData);
      const response = await fetch(API_ENDPOINTS.MERCHANTS_GET_SINGLE, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // body: JSON.stringify({ merchantId: merchantData?.id }),
      });

      if (!response.ok) {
        throw new Error(`Merchant not found`);
      }

      const data = await response.json();
      console.log("response merchant", data);

      setMerchant(data);
    } catch (err: any) {
      console.log("error", err);
      setError(err.message);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.ADMIN_ANALYTICS, {
        headers: createAuthHeaders(token),
      });

      if (response.status === 401) {
        console.log("Error in fetch Analytics");
        return;
      }

      if (response.ok) {
        const res = await response.json();
        const data = res.data;
        console.log("Analytics data ", data);
        setAnalytics(data);

        // Update merchants with analytics data
        if (data.merchants && data.merchants.merchants) {
          const merchantsWithMappedFields = data.merchants.merchants.map(
            (merchant: any) => {
              // Extract orders from totalOrders object/array
              const ordersArray = Array.isArray(merchant.totalOrders)
                ? merchant.totalOrders
                : merchant.totalOrders
                ? Object.values(merchant.totalOrders)
                : [];

              // Calculate totals
              const totalOrdersCount = ordersArray.length;
              const totalAmount = ordersArray.reduce(
                (sum: number, order: Order) => {
                  const cartTotal = calculateCartTotal(
                    order.metadata?.cartData || []
                  );
                  return sum + cartTotal;
                },
                0
              );

              const totalPaidAmount = ordersArray
                .filter(
                  (order: Order) =>
                    order.status === "paid" || order.crossmintStatus === "paid"
                )
                .reduce((sum: number, order: Order) => {
                  const cartTotal = calculateCartTotal(
                    order.metadata?.cartData || []
                  );
                  return sum + cartTotal;
                }, 0);

              return {
                ...merchant,
                storeUrl: merchant.storeURL || merchant.storeUrl || "N/A",
                totalOrders: ordersArray,
                totalOrdersCount,
                totalAmount,
                totalPaidAmount,
              };
            }
          );
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
        console.error("Failed to fetch analytics:", response.status);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  useEffect(() => {
    findMerchant();
  }, []);

  useEffect(() => {
    console.log("AdminDashboard - useEffect triggered");
    console.log("Token available:", !!token);
    console.log("Token value:", token);

    if (token) {
      console.log(
        "AdminDashboard - Calling fetchData, fetchAdmins, and fetchAnalytics"
      );
      // fetchData();
      // fetchAdmins();
      fetchAnalytics();
    } else {
      console.log("AdminDashboard - No token available, skipping API calls");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
      return date.toLocaleString();
    } catch (error) {
      return "Invalid Date";
    }
  };

  const EmptyState: React.FC<{ message: string; colSpan: number }> = ({
    message,
    colSpan,
  }) => (
    <tr>
      <td colSpan={colSpan} className="empty-state">
        {message}
      </td>
    </tr>
  );

  const handleAddNewStoreUrl = async () => {
    try {
      console.log("params", { newStoreUrl, newReceivingAddress });
      // const token = localStorage.getItem("jwtToken");
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoic2FtYWQxMzM1NEBnbWFpbC5jb20iLCJuYW1lIjoiU3VwZXIgQWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NjA1MTE5OTUsImV4cCI6MTc2MDU5ODM5NX0.qwY7IOXP2kWtU7U9bBwy1Ymx2zLzS3tjAfd5szXqrLo";

      const result = await fetch(
        "http://localhost:5000/merchants/add-store-url",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            storeUrl: newStoreUrl,
            receivingAddress: newReceivingAddress,
          }),
        }
      );

      console.log("result", result);
      await findMerchant();
      alert("successfully added");
      setShowAddStoreModal(false);
    } catch (err) {}
  };

  const [showEditStoreModal, setShowEditStoreModal] = useState(false);
  const [editModalStore, setEditModalStore]: any = useState({});

  const handleStoreEdit = (merchantStore: any) => {
    console.log("merchant store", merchantStore);

    setNewStoreUrl(merchantStore.storeUrl);
    setNewReceivingAddress(merchantStore.receivingAddress)

    setShowEditStoreModal(true);
    setEditModalStore(merchantStore);
  };

  const handleEditStore = async () => {
    const response = await fetch(
      `http://localhost:5000/merchants/update-store`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 👈 send JWT here
        },
        body: JSON.stringify({
          oldStoreUrl: editModalStore.storeUrl,
          newStoreUrl,
          newReceivingAddress,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update store: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ Store updated:", data);

    await findMerchant()
    alert('success')
    setShowEditStoreModal(false)
    setNewStoreUrl('')
    setNewReceivingAddress('')
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header-bar">
        <div className="header-left">
          <span className="header-logo">🔒</span>
          <h1>CloakPay User</h1>
        </div>
      </header>

      <div className="admin-main-layout">
        {/* Sidebar Navigation */}
        <aside className="admin-sidebar">
          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <span className="nav-item-icon">🏪</span>
              <span>Profile</span>
            </button>
            <button
              className={`nav-item ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              <span className="nav-item-icon">📦</span>
              <span>Orders</span>
            </button>
            {/* <button
              className={`nav-item ${activeTab === 'vaults' ? 'active' : ''}`}
              onClick={() => setActiveTab('vaults')}
            >
              <span className="nav-item-icon">💰</span>
              <span>Vaults</span>
            </button> */}
            <button
              className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              <span className="nav-item-icon">⚙️</span>
              <span>Settings</span>
            </button>
            <button
              className={`nav-item ${
                activeTab === "analytics" ? "active" : ""
              }`}
              onClick={() => setActiveTab("analytics")}
            >
              <span className="nav-item-icon">🔔</span>
              <span>Analytics</span>
            </button>
          </nav>
        </aside>

        {/* Debug: merchant here */}
        {activeTab === "profile" && (
          <div className="tab-content">
            <div className="content-header">
              <h2>Merchant Management</h2>
            </div>

            {/* Merchant Sub-tabs */}
            <div className="merchant-sub-tabs">
              <button
                // className={`sub-tab ${merchantSubTab === 'pending' ? 'active' : ''}`}
                // onClick={() => setMerchantSubTab('pending')}
                onClick={() => setShowAddStoreModal(true)}
              >
                Add store
              </button>
              {/* <button
                      className={`sub-tab ${merchantSubTab === 'approved' ? 'active' : ''}`}
                      // onClick={() => setMerchantSubTab('approved')}
                    >
                      Approved Merchants
                    </button> */}
            </div>

            {/* Pending Merchants */}
            {/* {merchantSubTab === "pending" && (
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
                      pendingMerchants.map((merchant: any) => (
                        <tr key={merchant.id}>
                          <td>{merchant.id}</td>
                          <td>{merchant.businessName}</td>
                          <td>{merchant.businessAddress}</td>
                          <td>{merchant.contactInformation}</td>
                          <td className="url-cell">
                            {merchant.storeUrl !== "N/A" ? (
                              <a
                                href={merchant.storeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="store-link"
                              >
                                {merchant.storeUrl}
                              </a>
                            ) : (
                              merchant.storeUrl
                            )}
                          </td>
                          <td className="address-cell">
                            {merchant.receivingAddress}
                          </td>
                          <td>{formatDate(merchant.createdAt)}</td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="approve-btn"
                                // onClick={() => handleMerchantAction(merchant.id, 'approve')}
                              >
                                Approve
                              </button>
                              <button
                                className="reject-btn"
                                // onClick={() => handleMerchantAction(merchant.id, 'reject')}
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
            )} */}

            {/* Approved Merchants */}
            {merchant && (
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Edit</th>
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
                    {merchant.stores.map(
                      (merchantStore: any, index: number) => {
                        return (
                          <tr key={merchant.id}>
                            <th
                              onClick={() => {
                                handleStoreEdit(merchantStore);
                              }}
                            >
                              Edit icon
                            </th>
                            <td>{merchant?.contactInformation || "N/A"}</td>
                            <td>{merchant?.businessName}</td>
                            <td className="url-cell">
                              {merchantStore !== "N/A" ? (
                                <a
                                  href={merchantStore}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="store-link"
                                >
                                  {merchantStore.storeUrl}
                                </a>
                              ) : (
                                merchantStore
                              )}
                            </td>
                            <td className="address-cell">
                              {merchantStore.receivingAddress}
                            </td>
                            <td>{merchant.totalOrdersCount || 0}</td>
                            <td>${(merchant.totalAmount || 0).toFixed(2)}</td>
                            <td>
                              ${(merchant.totalPaidAmount || 0).toFixed(2)}
                            </td>
                            <td>${merchant.totalFeesGenerated || 0}</td>
                            <td>${merchant.pendingAmountToBeReceived || 0}</td>
                            <td>
                              <button
                                className="view-orders-btn"
                                onClick={() => {
                                  setSelectedMerchantId(merchant.id);
                                  setActiveTab("orders");
                                }}
                              >
                                View Orders
                              </button>
                            </td>
                          </tr>
                        );
                      }
                    )}

                    {/* ))
                          )} */}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "orders" && (
          <div className="tab-content">
            <div className="content-header">
              {/* <h2>
                      {selectedMerchantId 
                        ? `Orders - ${merchants.find(m => m.id === selectedMerchantId)?.businessName || 'Merchant'}` 
                        : 'All Orders'}
                    </h2> */}
              {/* {selectedMerchantId && (
                      <button
                        className="back-to-merchants-btn"
                        onClick={() => {
                          setSelectedMerchantId(null);
                          setActiveTab('pro');
                        }}
                      >
                        ← Back to Merchants
                      </button>
                    )} */}
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
                  {merchant.orders.map((order: any) => {
                    console.log("order", order);
                    const cartTotal = calculateCartTotal(
                      order.metadata?.cartData || []
                    );
                    return (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.wooId}</td>
                        <td>{merchant.businessName}</td>
                        <td className="url-cell">
                          {order.storeUrl !== "N/A" ? (
                            <a
                              href={order.storeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="store-link"
                            >
                              {order.storeUrl}
                            </a>
                          ) : (
                            order.storeUrl
                          )}
                        </td>
                        <td>${cartTotal.toFixed(2)}</td>
                        <td>
                          <span
                            className={`status-badge ${order.status.toLowerCase()}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`status-badge ${order.crossmintStatus.toLowerCase()}`}
                          >
                            {order.crossmintStatus}
                          </span>
                        </td>
                        <td className="address-cell">
                          {order.transactionHash || "N/A"}
                        </td>
                        <td>{order.customerEmail || "N/A"}</td>
                        <td>{formatDate(order.createdAt)}</td>
                        <td>
                          {order.completedAt
                            ? formatDate(order.completedAt)
                            : "N/A"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="tab-content">
            <div className="content-header"></div>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Keys</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>123</td>
                    {/* <td>{order.wooId}</td>
                        <td>{merchant.businessName}</td> */}
                  </tr>
                  {/* {merchant.orders.map((order: any) => {
                    console.log("order", order);
                    const cartTotal = calculateCartTotal(
                      order.metadata?.cartData || []
                    );
                    return (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.wooId}</td>
                        <td>{merchant.businessName}</td>
                        <td className="url-cell">
                          {order.storeUrl !== "N/A" ? (
                            <a
                              href={order.storeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="store-link"
                            >
                              {order.storeUrl}
                            </a>
                          ) : (
                            order.storeUrl
                          )}
                        </td>
                        <td>${cartTotal.toFixed(2)}</td>
                        <td>
                          <span
                            className={`status-badge ${order.status.toLowerCase()}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`status-badge ${order.crossmintStatus.toLowerCase()}`}
                          >
                            {order.crossmintStatus}
                          </span>
                        </td>
                        <td className="address-cell">
                          {order.transactionHash || "N/A"}
                        </td>
                        <td>{order.customerEmail || "N/A"}</td>
                        <td>{formatDate(order.createdAt)}</td>
                        <td>
                          {order.completedAt
                            ? formatDate(order.completedAt)
                            : "N/A"}
                        </td>
                      </tr>
                    );
                  })} */}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="tab-content">
            <div className="content-header">
              <h2>Vault Analytics</h2>
            </div>

            {!analytics ? (
              <div className="loading-state">Loading analytics data...</div>
            ) : (
              <>
                {console.log("Rendering Vaults - Analytics:", analytics)}
                {console.log("Platform data:", analytics?.platform)}
                {console.log("Distributions data:", analytics?.distributions)}

                {/* Platform Analytics Cards */}
                {analytics?.platform ? (
                  <>
                    <div className="analytics-cards">
                      <div className="analytics-card">
                        <div className="card-label">Vault Address</div>
                        <div className="card-value address-cell">
                          {analytics.platform.vaultAddress}
                        </div>
                      </div>
                      <div className="analytics-card">
                        <div className="card-label">Total Fees Generated</div>
                        <div className="card-value">
                          ${analytics.platform.totalFeesGeneratedFromMerchants}
                        </div>
                      </div>
                      <div className="analytics-card">
                        <div className="card-label">Total Fees Received</div>
                        <div className="card-value">
                          ${analytics.platform.totalFeesActuallyReceived}
                        </div>
                      </div>
                      <div className="analytics-card">
                        <div className="card-label">Pending Payment</div>
                        <div className="card-value">
                          $
                          {
                            analytics.platform
                              .totalPendingPaymentFromDailyDistribution
                          }
                        </div>
                      </div>
                    </div>

                    {/* Orders Summary */}
                    <div className="section-divider">
                      <h3>Orders Summary</h3>
                    </div>
                    {/* <div className="analytics-cards">
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
                    </div> */}
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
                        <div className="card-value">
                          ${analytics.distributions.totalDistributed}
                        </div>
                      </div>
                      <div className="analytics-card">
                        <div className="card-label">Total Pending</div>
                        <div className="card-value">
                          ${analytics.distributions.totalPending}
                        </div>
                      </div>
                      <div className="analytics-card">
                        <div className="card-label">Merchants Remaining</div>
                        <div className="card-value">
                          $
                          {
                            analytics.distributions
                              .totalRemainingAmountOfAllMerchants
                          }
                        </div>
                      </div>
                      <div className="analytics-card">
                        <div className="card-label">
                          Platform Fees Remaining
                        </div>
                        <div className="card-value">
                          $
                          {analytics.distributions.totalRemainingFeesOfPlatform}
                        </div>
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
                          {!analytics.distributions.allDistributionRecords ||
                          analytics.distributions.allDistributionRecords
                            .length === 0 ? (
                            <EmptyState
                              message="No distribution records found"
                              colSpan={8}
                            />
                          ) : (
                            analytics.distributions.allDistributionRecords.map(
                              (record: any) => (
                                <tr key={record.id}>
                                  <td>{record.id}</td>
                                  <td>{record.merchantName}</td>
                                  <td>${record.totalAmount}</td>
                                  <td>${record.merchantAmount}</td>
                                  <td>${record.platformFees}</td>
                                  <td>
                                    <span
                                      className={`status-badge ${record.status.toLowerCase()}`}
                                    >
                                      {record.status}
                                    </span>
                                  </td>
                                  <td className="address-cell">
                                    {record.transactionHash}
                                  </td>
                                  <td>{formatDate(record.distributedAt)}</td>
                                </tr>
                              )
                            )
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

        {showEditStoreModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowEditStoreModal(false)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button
                className="modal-close-btn"
                onClick={() => setShowEditStoreModal(false)}
              >
                ✕
              </button>
              <h2>Edit Store</h2>
              <div className="modal-form">
                <div className="form-group">
                  <input
                    type="email"
                    id="admin-email"
                    disabled={true}
                    placeholder="Enter new store url"
                    value={newStoreUrl}
                    // onChange={(e) => setNewStoreUrl(e.target.value)}
                    className="modal-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    id="admin-email"
                    placeholder="Enter receiving address"
                    value={newReceivingAddress}
                    onChange={(e) => setNewReceivingAddress(e.target.value)}
                    className="modal-input"
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button
                    className="modal-cancel-btn"
                    onClick={() => {
                      setShowAddStoreModal(false);
                      setNewStoreUrl("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="modal-submit-btn"
                    onClick={handleEditStore}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showAddStoreModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowAddStoreModal(false)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button
                className="modal-close-btn"
                onClick={() => {
                  setShowAddStoreModal(false);
                  setNewStoreUrl('')
                  setNewReceivingAddress('')
                }}
              >
                ✕
              </button>
              <h2>Add New Store</h2>
              <div className="modal-form">
                <div className="form-group">
                  <input
                    type="email"
                    id="admin-email"
                    placeholder="Enter new store url"
                    value={newStoreUrl}
                    onChange={(e) => setNewStoreUrl(e.target.value)}
                    className="modal-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    id="admin-email"
                    placeholder="Enter receiving address"
                    value={newReceivingAddress}
                    onChange={(e) => setNewReceivingAddress(e.target.value)}
                    className="modal-input"
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button
                    className="modal-cancel-btn"
                    onClick={() => {
                      setShowAddStoreModal(false);
                      setNewStoreUrl("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="modal-submit-btn"
                    onClick={handleAddNewStoreUrl}
                  >
                    Add store
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;

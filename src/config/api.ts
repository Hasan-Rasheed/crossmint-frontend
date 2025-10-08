export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // Admin Authentication
  ADMIN_REQUEST_OTP: `${API_BASE_URL}/admin/request-otp`,
  ADMIN_VERIFY_OTP: `${API_BASE_URL}/admin/verify-otp`,
  
  // Admin Dashboard
  ADMIN_MERCHANTS: `${API_BASE_URL}/admin/dashboard/merchants`,
  ADMIN_MERCHANT_BY_ID: (id: string) => `${API_BASE_URL}/admin/dashboard/merchants/${id}`,
  ADMIN_LIST: `${API_BASE_URL}/admin/list`,
  ADMIN_DEACTIVATE: (id: number) => `${API_BASE_URL}/admin/deactivate/${id}`,
  
  // Merchant
  MERCHANTS_CREATE: `${API_BASE_URL}/merchants`,
  MERCHANTS_GET_ALL: `${API_BASE_URL}/merchants/getAll`,
};

/**
 * Helper function to create headers with authorization
 */
export const createAuthHeaders = (token: string) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
});

/**
 * Helper function to create headers without authorization
 */
export const createHeaders = () => ({
  'Content-Type': 'application/json',
});

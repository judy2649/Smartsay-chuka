import axios from 'axios';

// Determine API URL based on environment
let API_BASE_URL = process.env.REACT_APP_API_URL;

if (!API_BASE_URL) {
  // Auto-detect based on hostname
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Local development - backend on port 10000
    API_BASE_URL = 'http://localhost:10000/api';
  } else {
    // Production - use Render backend
    API_BASE_URL = 'https://smartsay-chuka-backend.onrender.com/api';
  }
}

console.log('🔧 API Configuration:');
console.log('   Hostname:', window.location.hostname);
console.log('   API_BASE_URL:', API_BASE_URL);
console.log('   REACT_APP_API_URL env:', process.env.REACT_APP_API_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('API Request:', config.method.toUpperCase(), config.url);
  return config;
});

// Handle response errors
api.interceptors.response.use(
  response => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  error => {
    console.error('API Error:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const hostelService = {
  getAllHostels: () => api.get('/hostels'),
  getHostelById: (id) => api.get(`/hostels/${id}`),
  createHostel: (data) => api.post('/hostels', data),
  updateHostel: (id, data) => api.put(`/hostels/${id}`, data),
  addReview: (id, data) => api.post(`/hostels/${id}/review`, data)
};

hostelService.importHostels = (data) => api.post('/hostels/import', data);

export const paymentService = {
  initiateMpesaPayment: (data) => api.post('/payments/initiate', data),
  getPaymentHistory: () => api.get('/payments/history')
};

// Mock payment helper for offline/testing
paymentService.confirmMockPayment = () => api.post('/payments/mock/confirm');

export const userService = {
  getProfile: () => api.get('/users/profile')
};

export default api;

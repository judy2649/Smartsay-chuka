import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL
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

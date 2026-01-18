import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  }
};

export const hostelService = {
  getAllHostels: () => api.get('/hostels'),
  getHostelById: (id) => api.get(`/hostels/${id}`),
  addReview: (id, data) => api.post(`/hostels/${id}/review`, data)
};

export const paymentService = {
  initiateMpesaPayment: (data) => api.post('/payments/initiate', data),
  getPaymentHistory: () => api.get('/payments/history')
};

export const userService = {
  getProfile: () => api.get('/users/profile')
};

export default api;

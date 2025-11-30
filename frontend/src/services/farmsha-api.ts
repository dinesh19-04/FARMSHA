// API endpoints and authentication service for FARMSHA

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const authAPI = {
  // Registration with OTP
  register: async (data) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Verify OTP and complete registration
  verifyOTP: async (userId, otp, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, otp, password }),
    });
    return response.json();
  },

  // Login
  login: async (email, password, role) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    });
    return response.json();
  },
};

export const farmerAPI = {
  // Search machinery
  searchMachinery: async (params, token) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(
      `${API_BASE_URL}/farmer/search?${queryString}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.json();
  },

  // Get machinery details
  getMachineryDetails: async (machineryId, token) => {
    const response = await fetch(
      `${API_BASE_URL}/farmer/machinery/${machineryId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.json();
  },

  // Create booking
  createBooking: async (bookingData, token) => {
    const response = await fetch(`${API_BASE_URL}/farmer/booking/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookingData),
    });
    return response.json();
  },

  // Get farmer's bookings
  getBookings: async (token) => {
    const response = await fetch(`${API_BASE_URL}/farmer/bookings`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  // Rate a booking
  rateBooking: async (bookingId, rating, review, token) => {
    const response = await fetch(
      `${API_BASE_URL}/farmer/booking/${bookingId}/rate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, review }),
      }
    );
    return response.json();
  },
};

export const ownerAPI = {
  // Add new machinery
  addMachinery: async (machineryData, token) => {
    const response = await fetch(`${API_BASE_URL}/owner/machinery/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(machineryData),
    });
    return response.json();
  },

  // Update machinery pricing
  updatePricing: async (machineryId, pricePerHour, pricePerAcre, token) => {
    const response = await fetch(
      `${API_BASE_URL}/owner/machinery/${machineryId}/pricing`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pricePerHour, pricePerAcre }),
      }
    );
    return response.json();
  },

  // Get owner's machinery
  getMachinery: async (token) => {
    const response = await fetch(`${API_BASE_URL}/owner/machinery`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  // Get booking requests
  getBookings: async (token) => {
    const response = await fetch(`${API_BASE_URL}/owner/bookings`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  // Accept or reject booking
  respondToBooking: async (bookingId, action, token) => {
    const response = await fetch(
      `${API_BASE_URL}/owner/booking/${bookingId}/respond`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
      }
    );
    return response.json();
  },

  // Get earnings
  getEarnings: async (token) => {
    const response = await fetch(`${API_BASE_URL}/owner/earnings`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },
};

export const agentAPI = {
  // Get all users
  getUsers: async (params, token) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/agent/users?${queryString}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  // Get bookings in region
  getBookings: async (token) => {
    const response = await fetch(`${API_BASE_URL}/agent/bookings`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  // Add user manually
  addUser: async (userData, token) => {
    const response = await fetch(`${API_BASE_URL}/agent/user/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  },
};

export const commonAPI = {
  // Get notifications
  getNotifications: async (token) => {
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  // Mark notification as read
  markNotificationAsRead: async (notificationId, token) => {
    const response = await fetch(
      `${API_BASE_URL}/notifications/${notificationId}/read`,
      {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.json();
  },

  // Get profile
  getProfile: async (token) => {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  // Update profile
  updateProfile: async (profileData, token) => {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
    return response.json();
  },
};

// Local storage helpers
export const tokenStorage = {
  setToken: (token) => localStorage.setItem('farmsha_token', token),
  getToken: () => localStorage.getItem('farmsha_token'),
  removeToken: () => localStorage.removeItem('farmsha_token'),
  setUser: (user) => localStorage.setItem('farmsha_user', JSON.stringify(user)),
  getUser: () => JSON.parse(localStorage.getItem('farmsha_user') || 'null'),
  removeUser: () => localStorage.removeItem('farmsha_user'),
  clear: () => {
    localStorage.removeItem('farmsha_token');
    localStorage.removeItem('farmsha_user');
  },
};

// Authentication context helper
export const isUserLoggedIn = () => !!tokenStorage.getToken();

export const getCurrentUser = () => tokenStorage.getUser();

export const getUserRole = () => tokenStorage.getUser()?.role;

export const logout = () => {
  tokenStorage.clear();
  window.location.href = '/';
};

import axios from 'axios';

/**
 * SparkoMind Unified Axios Client
 * Configured with automatic credential transmission for HTTP-only cookie authentication.
 */
const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for Bearer token injection
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sparkomind_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent error extraction
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorPayload = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred.',
      statusCode: error.response?.status || 500,
      errors: error.response?.data?.errors || null
    };
    return Promise.reject(errorPayload);
  }
);

/* --------------------------------------------------------------------------
   Auth Endpoints
   -------------------------------------------------------------------------- */
export const authApi = {
  register: (payload) => api.post('/auth/register', payload),
  login: (payload) => api.post('/auth/login', payload),
  logout: () => api.post('/auth/logout'),
  sendOtp: (payload) => api.post('/auth/send-otp', payload),
  sendEmailOtp: (payload) => api.post('/auth/send-otp', payload),
  verifyOtp: (payload) => api.post('/auth/verify-otp', payload),
  forgotPassword: (payload) => api.post('/auth/forgot-password', payload),
  resetPassword: (payload) => api.post('/auth/reset-password', payload),
  getMe: () => api.get('/auth/me'),
  updatePreferences: (payload) => api.put('/auth/preferences', payload)
};

/* --------------------------------------------------------------------------
   Game Endpoints
   -------------------------------------------------------------------------- */
export const gameApi = {
  getAll: (params) => api.get('/games', { params }),
  getBySlug: (slug) => api.get(`/games/${slug}`),
  create: (payload) => api.post('/games', payload)
};

/* --------------------------------------------------------------------------
   Challenge & Zero-Trust Attempt Endpoints
   -------------------------------------------------------------------------- */
export const challengeApi = {
  getForPlay: (gameSlug, level, demographic) =>
    api.get(`/challenges/${gameSlug}/level/${level}`, { params: { demographic } }),
  submitAttempt: (challengeId, payload) =>
    api.post(`/challenges/${challengeId}/attempt`, payload),
  getHistory: () => api.get('/challenges/history')
};

/* --------------------------------------------------------------------------
   System Health Check
   -------------------------------------------------------------------------- */
export const healthApi = {
  check: () => api.get('/health')
};

export default api;

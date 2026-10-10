import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5005';
const ML_SERVICE_URL = import.meta.env.VITE_ML_SERVICE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
});

// Attach JWT token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dia_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Health check service
export const checkServicesHealth = async () => {
  const results = {
    backend: false,
    mlService: false,
  };

  try {
    const bRes = await axios.get(`${BACKEND_URL}/health`, { timeout: 3000 });
    if (bRes.status === 200) results.backend = true;
  } catch (e) {
    results.backend = false;
  }

  try {
    const mlRes = await axios.get(`${ML_SERVICE_URL}/health`, { timeout: 3000 });
    if (mlRes.status === 200) results.mlService = true;
  } catch (e) {
    results.mlService = false;
  }

  return results;
};

// Predict API (with automatic fallback to direct FastAPI if backend is unavailable)
export const submitAssessment = async (patientName, features) => {
  try {
    // Try via Backend proxy first
    const response = await api.post('/api/diabetes/predict', {
      patientName,
      features,
    });
    return response.data.data;
  } catch (backendError) {
    console.warn('Backend proxy failed, attempting direct ML service fallback...', backendError);
    // Direct call to FastAPI microservice
    const directRes = await axios.post(`${ML_SERVICE_URL}/predict`, features);
    const {
      prediction,
      outcome,
      risk_score_percentage,
      risk_level,
      key_risk_factors,
      recommendations,
      timestamp,
    } = directRes.data;

    return {
      _id: 'direct_' + Date.now(),
      patientName: patientName || 'Direct Assessment',
      features,
      prediction,
      outcome,
      riskScorePercentage: risk_score_percentage,
      riskLevel: risk_level,
      keyRiskFactors: key_risk_factors,
      recommendations,
      createdAt: timestamp,
    };
  }
};

// Fetch Screening History
export const fetchScreeningHistory = async () => {
  try {
    const res = await api.get('/api/diabetes/history');
    return res.data.data || [];
  } catch (err) {
    console.warn('Could not fetch backend history:', err);
    return [];
  }
};

// Fetch Stats
export const fetchStats = async () => {
  try {
    const res = await api.get('/api/diabetes/stats');
    return res.data.stats;
  } catch (err) {
    return {
      totalScreenings: 0,
      highRiskCount: 0,
      moderateRiskCount: 0,
      lowRiskCount: 0,
      avgRiskScore: 0,
    };
  }
};

// Auth Services
export const login = async (email, password) => {
  const res = await api.post('/api/auth/login', { email, password });
  if (res.data.token) {
    localStorage.setItem('dia_token', res.data.token);
    localStorage.setItem('dia_user', JSON.stringify(res.data.user));
  }
  return res.data;
};

export const register = async (userData) => {
  const res = await api.post('/api/auth/register', userData);
  if (res.data.token) {
    localStorage.setItem('dia_token', res.data.token);
    localStorage.setItem('dia_user', JSON.stringify(res.data.user));
  }
  return res.data;
};

export const logout = () => {
  localStorage.removeItem('dia_token');
  localStorage.removeItem('dia_user');
};

export default api;


import axios from 'axios';

// Use environment variable or default to '/api' for production deployment
const baseURL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

console.log('🚀 API Connection initialized at:', baseURL);

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor for debugging production errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const errorDetails = {
            url: error.config?.url,
            fullUrl: (error.config?.baseURL || '') + (error.config?.url || ''),
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
            isNetworkError: !error.response
        };

        if (errorDetails.isNetworkError) {
            console.error('❌ Connection Error (Server Unreachable):', errorDetails);
        } else {
            console.error('🌐 API logical Error:', errorDetails);
        }

        return Promise.reject(error);
    }
);

export default api;

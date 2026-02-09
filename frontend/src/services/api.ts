/**
 * API Configuration
 * Axios instance with base URL and interceptors
 */

import axios from 'axios';

// Get base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Create Axios instance
export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor (for logging in development)
api.interceptors.request.use(
    (config) => {
        if (import.meta.env.DEV) {
            console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.params);
        }
        return config;
    },
    (error) => {
        console.error('[API Request Error]', error);
        return Promise.reject(error);
    }
);

// Response interceptor (for logging and error handling)
api.interceptors.response.use(
    (response) => {
        if (import.meta.env.DEV) {
            console.log(`[API Response] ${response.config.url}`, response.data);
        }
        return response;
    },
    (error) => {
        // Centralized error logging
        if (error.response) {
            // Server responded with error status
            console.error('[API Error]', {
                status: error.response.status,
                data: error.response.data,
                url: error.config?.url,
            });
        } else if (error.request) {
            // Request made but no response
            console.error('[API Error] No response received', error.request);
        } else {
            // Error in request setup
            console.error('[API Error]', error.message);
        }
        return Promise.reject(error);
    }
);

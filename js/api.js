/**
 * API Service for Maison des Jeunes Al Qods
 * Handles fetch requests, JWT authentication, and token refreshing.
 */

const API_BASE_URL = 'http://localhost:8000/api/v1';

class ApiService {
    constructor() {
        this.baseUrl = API_BASE_URL;
    }

    // Get auth token from local storage
    getToken() {
        return localStorage.getItem('access_token');
    }

    // Set tokens after login
    setTokens(accessToken) {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('hasAccount', 'true');
    }

    // Clear session on logout
    clearSession() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('hasAccount');
        localStorage.removeItem('user');
    }

    // Save user data
    setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    // Get current user data
    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    // Core fetch wrapper
    async fetch(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        
        const headers = {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        };

        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Handle FormData (file uploads) - we shouldn't set Content-Type manually
        if (options.body instanceof FormData) {
            delete headers['Content-Type'];
        }

        const config = {
            ...options,
            headers,
        };

        try {
            let response = await window.fetch(url, config);

            // Handle 401 Unauthorized (Token expired)
            if (response.status === 401 && !endpoint.includes('/auth/login')) {
                const refreshed = await this.refreshToken();
                if (refreshed) {
                    // Retry original request with new token
                    headers['Authorization'] = `Bearer ${this.getToken()}`;
                    response = await window.fetch(url, { ...config, headers });
                } else {
                    this.clearSession();
                    window.location.href = '/public/login.html';
                    throw new Error('Session expirée');
                }
            }

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.message || 'Une erreur est survenue');
            }

            return data;
        } catch (error) {
            console.error(`[API] Error on ${endpoint}:`, error);
            throw error;
        }
    }

    // Attempt to refresh the JWT using the httpOnly cookie refresh token
    async refreshToken() {
        try {
            // Note: credentials: 'include' is required to send the httpOnly refresh token cookie
            const response = await window.fetch(`${this.baseUrl}/auth/refresh-token`, {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                if (data.access_token) {
                    this.setTokens(data.access_token);
                    return true;
                }
            }
            return false;
        } catch (err) {
            return false;
        }
    }

    // ==========================================
    // API Endpoints Methods
    // ==========================================

    // Auth
    async login(email, password) {
        const res = await window.fetch(`${this.baseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: 'include' // Needed to set the refresh token cookie
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Erreur de connexion');
        
        this.setTokens(data.access_token);
        this.setUser(data.user);
        return data.user;
    }

    async register(userData) {
        return this.fetch('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    async logout() {
        try {
            await window.fetch(`${this.baseUrl}/auth/logout`, { method: 'POST', credentials: 'include' });
        } finally {
            this.clearSession();
            window.location.href = '/public/login.html';
        }
    }
}

// Create a global instance
window.api = new ApiService();

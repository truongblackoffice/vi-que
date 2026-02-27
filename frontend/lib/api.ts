import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // Remove the /api prefix because baseURL creates it already
                await axios.post('/auth/refresh', {}, {
                    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
                    withCredentials: true,
                });
                return api(originalRequest);
            } catch (refreshError) {
                if (typeof window !== 'undefined') {
                    // Force clean up Zustand auth state
                    window.localStorage.removeItem('vique-auth-storage');
                    window.location.href = '/auth/login';
                }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;

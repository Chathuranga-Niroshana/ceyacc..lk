import axios from 'axios';

const getToken = () => localStorage.getItem('token');

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;

        // Log and pass the error to component
        if (status === 401) {
            console.warn('401 Unauthorized');
        } else if (status >= 500) {
            console.error('Server error:', error.response);
        }

        return Promise.reject(error.response?.data || error.message);
    }
);

export default axiosInstance;

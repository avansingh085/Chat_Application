import axios from "axios";
const BASE_URL = "https://chat-backend-1-3dgt.onrender.com"; 

export const getToken = () => localStorage.getItem("token");

export const setToken = (token) => {
    if (token) {
        localStorage.setItem("token", token);
    } else {
        localStorage.removeItem("token");
    }
};
const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});
apiClient.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const apiGet = async (url, params = {}) => {
    try {
        const response = await apiClient.get(url, { params });
        return response.data;
    } catch (error) {
        console.error("GET Error:", error.response?.data || error.message);
        throw error;
    }
};

export const apiPost = async (url, data = {}) => {
    try {
        const response = await apiClient.post(url, data);
        return response.data;
    } catch (error) {
        console.error("POST Error:", error.response?.data || error.message);
        throw error;
    }
};

export default apiClient;

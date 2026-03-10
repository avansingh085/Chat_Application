import axios from "axios";
  const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api`; 
//  const BASE_URL = "http://localhost:3001/api";

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});


export const apiGet = async (url, params = {}) => {
    try {
        const response = await apiClient.get(url, { params });
        return response.data;
    } catch (error) {
        console.log("GET Error:", error.response?.data || error.message);
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

import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api"
})

axiosInstance.interceptors.request.use((config) => {
    const state = useAuthStore.getState();
    const token = state.user?.token;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Logout user
            useAuthStore.getState().logout();
        }
        return Promise.reject(error);
    }
)

export default axiosInstance;
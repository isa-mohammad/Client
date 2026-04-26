import axiosInstance from "./axios";
import { useAuthStore } from "../store/useAuthStore";
import type { Task } from "../types";
const signIn = async (credentials: { email: string; password?: string }) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
}

const signUp = async (credentials: { email: string; password?: string }) => {
    const response = await axiosInstance.post('/auth/register', credentials);
    return response.data;
}

const logOut = async () => {
    const auth = useAuthStore.getState();
    auth.logout();
}

const fetchTasks = async (name?: string, status?: string) => {
    const params: { name?: string, status?: string } = {};
    if (name) params.name = name;
    if (status) params.status = status;
    const response = await axiosInstance.get('/tasks', { params });
    return response.data;
}

const fetchTasksByUser = async (id: string) => {
    const response = await axiosInstance.get(`/tasks/user/${id}`);
    return response.data;
}

const addTask = async (task: { title: string }) => {
    const response = await axiosInstance.post('/tasks', task);
    return response.data;
}

const toggleTask = async (id: string) => {
    const response = await axiosInstance.put(`/tasks/${id}`);
    return response.data;
}

const refreshTasks = async () => {
    const tasks = await fetchTasks();
    const auth = useAuthStore.getState();
    const userId = auth.user?._id;
    const userTasks = tasks.filter((task: Task) => task.user._id === userId);
    return userTasks;
}

export { signIn, signUp, logOut, fetchTasks, fetchTasksByUser, addTask, toggleTask, refreshTasks }
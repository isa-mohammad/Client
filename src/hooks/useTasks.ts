import { useState, useEffect, useCallback } from 'react';
import type { Task, TasksState, TaskStatus } from '../types';
import { useAuthStore } from '../store/useAuthStore';

export const useTasks = () => {
  const [state, setState] = useState<TasksState>({
    data: [],
    loading: true,
    error: null,
  });

  const user = useAuthStore((state) => state.user);

  const fetchTasks = useCallback(async () => {
    // Only fetch if we have a token
    if (!user?.token) {
      setState({ data: [], loading: false, error: null });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch('http://localhost:5000/api/tasks', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch tasks');
      }

      // data is wrapped in { tasks: [...] } based on our controller
      const tasksArray = data.tasks || data;

      setState({ data: tasksArray, loading: false, error: null });
    } catch (err) {
      setState({ data: [], loading: false, error: (err as Error).message });
    }
  }, [user?.token]);

  const fetchTasksWithFilters = useCallback(async (name: string, status: TaskStatus) => {
    if (!user?.token) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const params = new URLSearchParams();
      if (name) params.append('name', name);
      if (status !== 'all') params.append('completed', status === 'completed' ? 'true' : 'false');
      
      const queryString = params.toString() ? `?${params.toString()}` : '';
      const response = await fetch(`http://localhost:5000/api/tasks${queryString}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch tasks');
      }

      // data is wrapped in { tasks: [...] } based on our controller
      const tasksArray = data.tasks || data;

      setState({ data: tasksArray, loading: false, error: null });
    } catch (err) {
      setState({ data: [], loading: false, error: (err as Error).message });
    }
  }, [user?.token]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const toggleTask = async (id: string) => {
    // Optimistic UI update
    const taskToToggle = state.data.find(t => t._id === id);
    if (!taskToToggle || !user?.token) return;

    setState((prev) => ({
      ...prev,
      data: prev.data.map((task) =>
        task._id === id ? { ...task, completed: !task.completed } : task
      ),
    }));

    try {
      await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'PATCH', // Assumes your backend supports PATCH or PUT for updates
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ completed: !taskToToggle.completed })
      });
    } catch (err) {
      console.error('Failed to toggle task:', err);
      // Optional: Revert UI state on failure
      fetchTasks();
    }
  };

  const addTask = async (title: string) => {
    if (!user?.token) return;

    try {
      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ title, completed: false })
      });

      if (!response.ok) throw new Error('Failed to create task');
      
      const newTask = await response.json();
      
      setState((prev) => ({
        ...prev,
        data: [newTask, ...prev.data], // Add to beginning of list
      }));
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };

  return { ...state, toggleTask, addTask, fetchTasksWithFilters, refresh: fetchTasks };
};

export interface User {
  _id: string;
  email: string;
  token?: string;
}

export interface Task {
  _id: string;
  title: string;
  completed: boolean;
  createdAt?: string;
  user?: User; // Populated user object or just an ID
}

export type TaskStatus = 'all' | 'completed' | 'pending';

export interface TasksState {
  data: Task[];
  loading: boolean;
  error: string | null;
}

import React, { useState, useMemo, useEffect } from 'react';
import { debounce } from 'lodash';
import { useTasks } from '../hooks/useTasks';
import { useAuthStore } from '../store/useAuthStore';
import TaskCard from './TaskCard';
import type { TaskStatus } from '../types';

const Dashboard: React.FC = () => {
  const { data: tasks, loading, error, toggleTask, addTask, fetchTasksWithFilters, refresh } = useTasks();
  const logout = useAuthStore((state) => state.logout);
  const [filter, setFilter] = useState<TaskStatus>('all');
  const [search, setSearch] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const debouncedFetch = debounce((name: string, status: TaskStatus) => {
      fetchTasksWithFilters(name, status);
    }, 300)

  useEffect(() => {
    debouncedFetch(search, filter);
    return () => {
      debouncedFetch.cancel();
    };
  }, [search, filter, debouncedFetch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSetFilter = (s: TaskStatus) => {
    setFilter(s);
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    await addTask(newTaskTitle);
    setNewTaskTitle(''); // Clear input after adding
  };

  if (error) return <div className="error-state">Error: {error}</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header animate-fade">
        <h1 className="gradient-text">Task Intelligence</h1>
        <p>Advanced monitoring for your productivity flow.</p>
        <button onClick={logout} className="logout-btn">
          Sign Out
        </button>
      </header>

      <div className="task-creator glass animate-fade">
        <form onSubmit={handleAddTask} className="add-task-form">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="add-task-input"
          />
          <button type="submit" className="add-task-btn" disabled={!newTaskTitle.trim()}>
            + Add Task
          </button>
        </form>
      </div>

      <div className="controls glass animate-fade">
        <input 
          type="text" 
          placeholder="Search tasks..." 
          value={search}
          onChange={handleSearchChange}
          className="search-input"
        />
        
        <div className="filter-group">
          {(['all', 'completed', 'pending'] as TaskStatus[]).map((s) => (
            <button
              key={s}
              onClick={()=>handleSetFilter(s)}
              className={`filter-btn ${filter === s ? 'active' : ''}`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        <button onClick={refresh} className="refresh-btn">
          ↻ Refresh
        </button>
      </div>

      <div className="task-grid">
        {loading ? (
          <div className="loader">Analyzing data stream...</div>
        ) : tasks.length > 0 ? (
          tasks.slice(0, 12).map((task) => (
            <TaskCard key={task._id} task={task} onToggle={toggleTask} />
          ))
        ) : (
          <div className="empty-state">No tasks found matching your criteria.</div>
        )}
      </div>

      <style>{`
        .dashboard-container {
          max-width: 1000px;
          margin: 4rem auto;
          padding: 0 2rem;
        }

        .dashboard-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .dashboard-header h1 {
          font-size: 3.5rem;
          font-weight: 800;
          letter-spacing: -2px;
          margin-bottom: 0.5rem;
        }

        .controls {
          padding: 1rem;
          border-radius: 20px;
          display: flex;
          gap: 1rem;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .search-input {
          flex: 1;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--glass-border);
          padding: 0.8rem 1.2rem;
          border-radius: 12px;
          color: white;
          outline: none;
          min-width: 200px;
        }

        .search-input:focus {
          border-color: var(--accent-primary);
        }

        .filter-group {
          display: flex;
          gap: 0.5rem;
        }

        .filter-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          padding: 0.5rem 1rem;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .filter-btn.active {
          background: var(--accent-primary);
          color: white;
        }

        .refresh-btn {
          background: transparent;
          border: 1px solid var(--accent-secondary);
          color: var(--accent-secondary);
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
        }

        .task-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .loader, .empty-state, .error-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 4rem;
          color: var(--text-secondary);
          font-size: 1.1rem;
        }

        .error-state { color: #ef4444; }
      `}</style>
    </div>
  );
};

export default Dashboard;

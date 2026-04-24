import React from 'react';
import type { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle }) => {
  return (
    <div className={`task-card glass animate-fade ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <span className={`status-dot ${task.completed ? 'done' : 'pending'}`}></span>
        <h3>{task.title}</h3>
      </div>
      <button 
        className="toggle-btn"
        onClick={()=>onToggle(task._id)}
      >
        {task.completed ? 'Undo' : 'Complete'}
      </button>

      <style>{`
        .task-card {
          padding: 1.5rem;
          border-radius: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.3s ease;
          border: 1px solid var(--border-color);
        }
        
        .task-card:hover {
          border-color: var(--accent-primary);
          transform: scale(1.02);
          box-shadow: 0 10px 30px -10px rgba(99, 102, 241, 0.2);
        }

        .task-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .status-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .status-dot.done { background: var(--success); box-shadow: 0 0 10px var(--success); }
        .status-dot.pending { background: var(--pending); box-shadow: 0 0 10px var(--pending); }

        h3 {
          font-size: 1rem;
          font-weight: 400;
          color: var(--text-primary);
          text-transform: capitalize;
        }

        .completed h3 {
          text-decoration: line-through;
          color: var(--text-secondary);
        }

        .toggle-btn {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          color: var(--text-primary);
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          font-family: inherit;
          font-size: 0.85rem;
          transition: all 0.2s ease;
        }

        .toggle-btn:hover {
          background: var(--accent-primary);
          border-color: var(--accent-primary);
        }
      `}</style>
    </div>
  );
};

export default TaskCard;

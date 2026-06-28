import { CalendarDays, Check, Pencil, Trash2 } from 'lucide-react';

const formatDate = (value) => {
  if (!value) return 'No due date';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
};

const TaskCard = ({ task, onDelete, onEdit, onToggleStatus }) => {
  const isCompleted = task.status === 'done';

  return (
    <article className={`task-card ${isCompleted ? 'completed' : ''} priority-${task.priority}`}>
      <div className="task-card-top">
        <span className={`priority-badge ${task.priority}`}>{task.priority === 'low' ? 'Average' : task.priority}</span>
        <div className="task-actions">
          <button
            type="button"
            className="icon-button"
            onClick={() => onToggleStatus(task)}
            aria-label={isCompleted ? 'Move to to do' : 'Move forward'}
            title={isCompleted ? 'Move to to do' : 'Move forward'}
          >
            <Check size={17} />
          </button>
          <button type="button" className="icon-button" onClick={() => onEdit(task)} aria-label="Edit task" title="Edit task">
            <Pencil size={17} />
          </button>
          <button
            type="button"
            className="icon-button danger"
            onClick={() => onDelete(task._id)}
            aria-label="Delete task"
            title="Delete task"
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>

      <h3>{task.title}</h3>
      {task.description && <p>{task.description}</p>}

      <div className="progress-track" aria-hidden="true">
        <span style={{ width: isCompleted ? '100%' : task.status === 'in-progress' ? '55%' : '20%' }} />
      </div>

      <div className="task-meta">
        <span className="label-with-icon">
          <CalendarDays size={16} /> {formatDate(task.dueDate)}
        </span>
      </div>
    </article>
  );
};

export default TaskCard;

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Plus,
  RefreshCw,
  Star,
  UserRound,
} from 'lucide-react';
import TaskCard from './components/TaskCard.jsx';
import TaskFilters from './components/TaskFilters.jsx';
import TaskForm from './components/TaskForm.jsx';
import Toast from './components/Toast.jsx';
import { createTask, deleteTask, getTasks, updateTask } from './services/taskApi.js';

const initialFilters = {
  search: '',
  status: 'all',
  priority: 'all',
  sortBy: 'createdAt',
  order: 'desc',
};

const boardColumns = [
  { id: 'todo', title: 'To do', icon: CalendarDays },
  { id: 'in-progress', title: 'In progress', icon: Clock3 },
  { id: 'done', title: 'Done', icon: CheckCircle2 },
];

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [selectedTask, setSelectedTask] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState('todo');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    window.setTimeout(() => setToast({ message: '', type }), 2600);
  }, []);

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getTasks(filters);
      setTasks(response.data || []);
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [filters, showToast]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleSubmit = async (taskData) => {
    setIsSubmitting(true);
    try {
      if (selectedTask) {
        const response = await updateTask(selectedTask._id, taskData);
        setTasks((current) => current.map((task) => (task._id === response.data._id ? response.data : task)));
        setSelectedTask(null);
        showToast('Task updated');
      } else {
        const response = await createTask(taskData);
        setTasks((current) => [response.data, ...current]);
        showToast('Task added');
      }
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this task?');
    if (!confirmed) return;

    try {
      await deleteTask(id);
      setTasks((current) => current.filter((task) => task._id !== id));
      if (selectedTask?._id === id) setSelectedTask(null);
      showToast('Task deleted');
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const handleToggleStatus = async (task) => {
    try {
      const nextStatus = task.status === 'todo' ? 'in-progress' : task.status === 'in-progress' ? 'done' : 'todo';
      const response = await updateTask(task._id, { status: nextStatus });
      setTasks((current) => current.map((item) => (item._id === task._id ? response.data : item)));
      showToast('Task moved');
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const prepareTaskForColumn = (status) => {
    setSelectedTask(null);
    setDefaultStatus(status);
  };

  const applyQuickFilter = (nextFilters) => {
    setFilters({ ...filters, ...nextFilters });
  };

  const emptyMessage = useMemo(() => {
    if (filters.search || filters.status !== 'all' || filters.priority !== 'all') {
      return 'No tasks match these filters.';
    }
    return 'No tasks yet. Add your first one from the form.';
  }, [filters]);

  const counts = useMemo(() => ({
    all: tasks.length,
    important: tasks.filter((task) => task.priority === 'high').length,
    todo: tasks.filter((task) => task.status === 'todo').length,
    progress: tasks.filter((task) => task.status === 'in-progress').length,
    done: tasks.filter((task) => task.status === 'done').length,
  }), [tasks]);

  return (
    <main>
      <Toast message={toast.message} type={toast.type} />

      <section className="app-shell">
        <aside className="project-sidebar">
          <div className="profile-chip">
            <div className="avatar">JS</div>
            <div>
              <strong>Justin Santosh</strong>
              <span>TaskFlow workspace</span>
            </div>
          </div>

          <h2 className="sidebar-title">Views</h2>

          <div className="project-list">
            <button
              type="button"
              className={filters.status === 'all' && filters.priority === 'all' ? 'active' : ''}
              onClick={() => applyQuickFilter({ status: 'all', priority: 'all' })}
            >
              <CalendarDays size={18} /> All tasks <span>{counts.all}</span>
            </button>
            <button
              type="button"
              className={filters.priority === 'high' ? 'active' : ''}
              onClick={() => applyQuickFilter({ status: 'all', priority: 'high' })}
            >
              <Star size={18} /> Important <span>{counts.important}</span>
            </button>
            <button
              type="button"
              className={filters.status === 'todo' ? 'active' : ''}
              onClick={() => applyQuickFilter({ status: 'todo', priority: 'all' })}
            >
              <CalendarDays size={18} /> To do <span>{counts.todo}</span>
            </button>
            <button
              type="button"
              className={filters.status === 'in-progress' ? 'active' : ''}
              onClick={() => applyQuickFilter({ status: 'in-progress', priority: 'all' })}
            >
              <Clock3 size={18} /> In progress <span>{counts.progress}</span>
            </button>
            <button
              type="button"
              className={filters.status === 'done' ? 'active' : ''}
              onClick={() => applyQuickFilter({ status: 'done', priority: 'all' })}
            >
              <CheckCircle2 size={18} /> Done <span>{counts.done}</span>
            </button>
          </div>
        </aside>

        <section className="workspace">
          <div className="workspace-header">
            <div>
              <p className="eyebrow">Task tracker</p>
              <h1>Planned</h1>
            </div>
            <button type="button" className="secondary-button" onClick={loadTasks} disabled={isLoading}>
              <RefreshCw size={17} /> {isLoading ? 'Refreshing' : 'Refresh'}
            </button>
          </div>

          <div className="workspace-tools">
            <TaskFilters filters={filters} onFilterChange={setFilters} />
          </div>

          {isLoading ? (
            <div className="state-panel">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="state-panel">{emptyMessage}</div>
          ) : (
            <div className="board">
              {boardColumns.map(({ id, title, icon: Icon }) => {
                const columnTasks = tasks.filter((task) => task.status === id);

                return (
                  <section className="board-column" key={id}>
                    <div className="column-header">
                      <h2>
                        <Icon size={18} /> {title} <span>({columnTasks.length})</span>
                      </h2>
                      <button type="button" onClick={() => prepareTaskForColumn(id)}>
                        <Plus size={16} /> Add Task
                      </button>
                    </div>

                    <div className="column-stack">
                      {columnTasks.map((task) => (
                        <TaskCard
                          key={task._id}
                          task={task}
                          onDelete={handleDelete}
                          onEdit={setSelectedTask}
                          onToggleStatus={handleToggleStatus}
                        />
                      ))}
                      {columnTasks.length === 0 && (
                        <div className="empty-column">No tasks here</div>
                      )}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </section>

        <aside className="compose-panel">
          <div className="compose-heading">
            <UserRound size={18} />
            <span>{selectedTask ? 'Editing task' : `New ${defaultStatus.replace('-', ' ')} task`}</span>
          </div>
          <TaskForm
            defaultStatus={defaultStatus}
            selectedTask={selectedTask}
            onCancelEdit={() => setSelectedTask(null)}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </aside>
      </section>
    </main>
  );
};

export default App;

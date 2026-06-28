import { Calendar, Flag, Plus, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const emptyTask = {
  title: '',
  description: '',
  priority: 'medium',
  status: 'todo',
  dueDate: '',
};

const TaskForm = ({ defaultStatus = 'todo', selectedTask, onCancelEdit, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState(emptyTask);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedTask) {
      setFormData({
        title: selectedTask.title || '',
        description: selectedTask.description || '',
        priority: selectedTask.priority || 'medium',
        status: selectedTask.status || 'todo',
        dueDate: selectedTask.dueDate ? selectedTask.dueDate.slice(0, 10) : '',
      });
    } else {
      setFormData({ ...emptyTask, status: defaultStatus });
    }
    setErrors({});
  }, [defaultStatus, selectedTask]);

  const validate = () => {
    const nextErrors = {};

    if (!formData.title.trim()) nextErrors.title = 'Title is required';
    if (formData.title.trim().length > 0 && formData.title.trim().length < 3) {
      nextErrors.title = 'Title must be at least 3 characters';
    }
    if (formData.description.length > 600) {
      nextErrors.description = 'Description must stay under 600 characters';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    await onSubmit({
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      dueDate: formData.dueDate || null,
    });

    if (!selectedTask) setFormData({ ...emptyTask, status: defaultStatus });
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <div>
          <p className="eyebrow">Task manager</p>
          <h1>{selectedTask ? 'Update task' : 'Create a task'}</h1>
        </div>
        {selectedTask && (
          <button type="button" className="icon-button ghost" onClick={onCancelEdit} aria-label="Cancel edit">
            <X size={18} />
          </button>
        )}
      </div>

      <label>
        Title
        <input
          name="title"
          type="text"
          placeholder="Finish assignment report"
          value={formData.title}
          onChange={handleChange}
        />
        {errors.title && <span className="field-error">{errors.title}</span>}
      </label>

      <label>
        Description
        <textarea
          name="description"
          placeholder="Add context, links, or smaller steps"
          value={formData.description}
          onChange={handleChange}
          rows="4"
        />
        {errors.description && <span className="field-error">{errors.description}</span>}
      </label>

      <div className="form-grid">
        <label>
          <span className="label-with-icon">
            <Flag size={16} /> Priority
          </span>
          <select name="priority" value={formData.priority} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>

        <label>
          Status
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="todo">To do</option>
            <option value="in-progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </label>

        <label>
          <span className="label-with-icon">
            <Calendar size={16} /> Due date
          </span>
          <input name="dueDate" type="date" value={formData.dueDate} onChange={handleChange} />
        </label>
      </div>

      <button className="primary-button" type="submit" disabled={isSubmitting}>
        {selectedTask ? <Save size={18} /> : <Plus size={18} />}
        {isSubmitting ? 'Saving...' : selectedTask ? 'Save changes' : 'Add task'}
      </button>
    </form>
  );
};

export default TaskForm;

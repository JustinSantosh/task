import { ArrowDownAZ, ArrowUpAZ, Search } from 'lucide-react';

const TaskFilters = ({ filters, onFilterChange }) => {
  const updateFilter = (name, value) => {
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <section className="filters" aria-label="Task filters">
      <div className="search-box">
        <Search size={18} />
        <input
          type="search"
          placeholder="Search tasks"
          value={filters.search}
          onChange={(event) => updateFilter('search', event.target.value)}
        />
      </div>

      <select value={filters.status} onChange={(event) => updateFilter('status', event.target.value)}>
        <option value="all">All status</option>
        <option value="todo">To do</option>
        <option value="in-progress">In progress</option>
        <option value="done">Done</option>
      </select>

      <select value={filters.priority} onChange={(event) => updateFilter('priority', event.target.value)}>
        <option value="all">All priority</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      <select value={filters.sortBy} onChange={(event) => updateFilter('sortBy', event.target.value)}>
        <option value="createdAt">Created</option>
        <option value="dueDate">Due date</option>
        <option value="priority">Priority</option>
        <option value="title">Title</option>
      </select>

      <button
        type="button"
        className="icon-button"
        onClick={() => updateFilter('order', filters.order === 'asc' ? 'desc' : 'asc')}
        aria-label="Toggle sort order"
        title="Toggle sort order"
      >
        {filters.order === 'asc' ? <ArrowUpAZ size={18} /> : <ArrowDownAZ size={18} />}
      </button>
    </section>
  );
};

export default TaskFilters;

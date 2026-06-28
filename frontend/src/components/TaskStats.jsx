const TaskStats = ({ tasks }) => {
  const completed = tasks.filter((task) => task.status === 'done').length;
  const inProgress = tasks.filter((task) => task.status === 'in-progress').length;
  const pending = tasks.filter((task) => task.status === 'todo').length;
  const highPriority = tasks.filter((task) => task.priority === 'high').length;

  return (
    <section className="stats" aria-label="Task summary">
      <div>
        <span>Total</span>
        <strong>{tasks.length}</strong>
      </div>
      <div>
        <span>To do</span>
        <strong>{pending}</strong>
      </div>
      <div>
        <span>In progress</span>
        <strong>{inProgress}</strong>
      </div>
      <div>
        <span>Done</span>
        <strong>{completed}</strong>
      </div>
      <div>
        <span>High priority</span>
        <strong>{highPriority}</strong>
      </div>
    </section>
  );
};

export default TaskStats;

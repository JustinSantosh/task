const Toast = ({ message, type }) => {
  if (!message) return null;

  return (
    <div className={`toast ${type}`} role="status">
      {message}
    </div>
  );
};

export default Toast;


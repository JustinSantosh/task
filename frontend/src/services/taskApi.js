const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5500/api/v1';

const request = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || 'Something went wrong');
  }

  return data;
};

export const getTasks = (params) => {
  const query = new URLSearchParams(params).toString();
  return request(`/tasks${query ? `?${query}` : ''}`);
};

export const createTask = (task) =>
  request('/tasks', {
    method: 'POST',
    body: JSON.stringify(task),
  });

export const updateTask = (id, task) =>
  request(`/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(task),
  });

export const deleteTask = (id) =>
  request(`/tasks/${id}`, {
    method: 'DELETE',
  });


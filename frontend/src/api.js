const BASE_URL = '/api/tasks';

async function request(url, options) {
  const res = await fetch(url, options);

  if (res.status === 204) return null;

  const data = await res.json();
  if (!res.ok) {
    const message = data.errors ? data.errors.join(', ') : data.error;
    throw new Error(message || 'Request failed');
  }
  return data;
}

function jsonOptions(method, body) {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

export function getTasks() {
  return request(BASE_URL);
}

export function createTask(task) {
  return request(BASE_URL, jsonOptions('POST', task));
}

export function updateTask(id, task) {
  return request(`${BASE_URL}/${id}`, jsonOptions('PUT', task));
}

export function toggleTask(id) {
  return request(`${BASE_URL}/${id}/toggle`, { method: 'PATCH' });
}

export function deleteTask(id) {
  return request(`${BASE_URL}/${id}`, { method: 'DELETE' });
}

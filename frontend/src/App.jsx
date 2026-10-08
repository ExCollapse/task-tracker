import { useEffect, useState } from 'react';
import * as api from './api.js';
import TaskForm from './components/TaskForm.jsx';
import TaskList from './components/TaskList.jsx';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      const data = await api.getTasks();
      setTasks(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(task) {
    try {
      await api.createTask(task);
      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleToggle(id) {
    try {
      await api.toggleTask(id);
      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUpdate(id, task) {
    try {
      await api.updateTask(id, task);
      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await api.deleteTask(id);
      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  }

  const visibleTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'done') return task.completed;
    return true;
  });

  const doneCount = tasks.filter((task) => task.completed).length;

  return (
    <div className="container">
      <h1>Task Tracker</h1>

      <TaskForm onAdd={handleAdd} />

      {error && <p className="error">{error}</p>}

      <div className="filters">
        {['all', 'active', 'done'].map((name) => (
          <button
            key={name}
            className={filter === name ? 'active' : ''}
            onClick={() => setFilter(name)}
          >
            {name}
          </button>
        ))}
        <span className="counter">
          {doneCount} / {tasks.length} done
        </span>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <TaskList
          tasks={visibleTasks}
          onToggle={handleToggle}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default App;

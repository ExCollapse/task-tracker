import { useState } from 'react';

function isOverdue(task) {
  if (!task.due_date || task.completed) return false;
  const today = new Date().toISOString().slice(0, 10);
  return task.due_date < today;
}

function TaskItem({ task, onToggle, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [priority, setPriority] = useState(task.priority);
  const [dueDate, setDueDate] = useState(task.due_date || '');

  function handleSave() {
    if (!title.trim()) return;
    onUpdate(task.id, {
      title,
      description: task.description,
      priority,
      due_date: dueDate || null,
    });
    setEditing(false);
  }

  function handleCancel() {
    setTitle(task.title);
    setPriority(task.priority);
    setDueDate(task.due_date || '');
    setEditing(false);
  }

  if (editing) {
    return (
      <li className="task editing">
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <button onClick={handleSave}>Save</button>
        <button onClick={handleCancel}>Cancel</button>
      </li>
    );
  }

  return (
    <li className={task.completed ? 'task done' : 'task'}>
      <input type="checkbox" checked={task.completed} onChange={() => onToggle(task.id)} />
      <span className="title">{task.title}</span>
      <span className={`priority ${task.priority}`}>{task.priority}</span>
      {task.due_date && (
        <span className={isOverdue(task) ? 'due overdue' : 'due'}>{task.due_date}</span>
      )}
      <button onClick={() => setEditing(true)}>Edit</button>
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </li>
  );
}

export default TaskItem;

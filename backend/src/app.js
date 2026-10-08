const express = require('express');
const cors = require('cors');
const pool = require('./db');
const tasksRouter = require('./routes/tasks');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Database unavailable' });
  }
});

app.use('/api/tasks', tasksRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// error handler (also catches invalid JSON bodies)
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON' });
  }
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;

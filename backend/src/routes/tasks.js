const express = require('express');
const pool = require('../db');
const { validateTask, parseId, PRIORITIES } = require('../validate');

const router = express.Router();

// GET /api/tasks?completed=true&priority=high
router.get('/', async (req, res, next) => {
  try {
    const conditions = [];
    const values = [];

    if (req.query.completed === 'true' || req.query.completed === 'false') {
      values.push(req.query.completed === 'true');
      conditions.push(`completed = $${values.length}`);
    }

    if (req.query.priority) {
      if (!PRIORITIES.includes(req.query.priority)) {
        return res.status(400).json({ error: 'Invalid priority filter' });
      }
      values.push(req.query.priority);
      conditions.push(`priority = $${values.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const result = await pool.query(
      `SELECT * FROM tasks ${where}
       ORDER BY completed ASC, due_date ASC NULLS LAST, created_at DESC`,
      values
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/tasks/:id
router.get('/:id', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid task id' });

    const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// POST /api/tasks
router.post('/', async (req, res, next) => {
  try {
    const errors = validateTask(req.body);
    if (errors.length > 0) return res.status(400).json({ errors });

    const { title, description, priority, due_date } = req.body;
    const result = await pool.query(
      `INSERT INTO tasks (title, description, priority, due_date)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title.trim(), description || null, priority || 'medium', due_date || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// PUT /api/tasks/:id
router.put('/:id', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid task id' });

    const errors = validateTask(req.body);
    if (errors.length > 0) return res.status(400).json({ errors });

    const { title, description, priority, due_date } = req.body;
    const result = await pool.query(
      `UPDATE tasks
       SET title = $1, description = $2, priority = $3, due_date = $4
       WHERE id = $5
       RETURNING *`,
      [title.trim(), description || null, priority || 'medium', due_date || null, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/tasks/:id/toggle
router.patch('/:id/toggle', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid task id' });

    const result = await pool.query(
      'UPDATE tasks SET completed = NOT completed WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid task id' });

    const result = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
